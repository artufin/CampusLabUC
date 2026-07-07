// Recon findings (Fase 1 spike, throwaway script, results captured here):
//
// - Login is a plain two-field form, no CAPTCHA/2FA encountered with the
//   provided account: selectors are `#username input`, `#password input`,
//   submit via clicking `#btn_outerverify` (a div, not a real <button>).
//
// - After submitting, the hash-routed SPA settles on a URL like
//   `.../uniportal/pvmswebsite/assets/build/cloud.html?app-id=smartpvms&
//   instance-id=smartpvms&zone-id=<dynamic>#/home/list` and fires a POST to
//   `/rest/pvms/web/station/v1/station/station-list` on its own. That single
//   call returns ALL plants' snapshot KPIs at once: `dn`, `name`,
//   `plantStatus`, `currentPower`, `dailyEnergy`, `monthEnergy`, `yearEnergy`,
//   `cumulativeEnergy`.
//
// - Direct calls to these endpoints via a raw `context.request` (or even
//   `fetch()` executed inside the page via `page.evaluate`) are REJECTED —
//   the response is an HTML error page, not JSON. FusionSolar requires a
//   `roarand` anti-CSRF header that's injected by the SPA's own bundled
//   request-wrapper, not reproducible from outside the page's real click/nav
//   flow. The robust approach is to let the actual page fire its own
//   requests via real navigation and capture the response with
//   `page.waitForResponse()` — never to replay requests manually.
//
// - Navigating a FRESH page directly to `#/view/station/{dn}/overview` (using
//   the `dn` from station-list) fires a GET to
//   `/rest/pvms/web/station/v1/overview/station-detail?stationDn={dn}`, whose
//   body includes `realtimePower`: today's power curve as
//   `{ "<unix-seconds>": kwValue, ... }` at ~5-minute intervals. This is used
//   directly as the `measurements` time series — no DOM-scraping fallback
//   was needed for this vendor.
//
// - Each navigation below uses a brand-new `page` (opened and closed per
//   call) rather than reusing one page across plants. This was a deliberate
//   choice: navigating between two URLs that only differ by the `dn` route
//   param (same hash-route shape) was not verified to reliably force the
//   SPA to refetch station-detail — a fresh page removes that ambiguity
//   entirely at a small, acceptable overhead cost.
//
// - Consumption data (not just generation) is also available, from the SAME
//   navigation used for generation — no extra page visit needed:
//   - `station-detail`'s `rptNrgKpi.{dailyNrg,monthNrg,yearNrg}` gives
//     `useNrg` (consumption), `buyNrg` (bought from grid), `onGridNrg`
//     (exported to grid), `selfUseNrg` (self-consumed solar) at daily/
//     monthly/yearly granularity.
//   - A GET to `/rest/pvms/web/station/v3/overview/energy-balance` (fired
//     automatically on the same navigation) returns `usePower` (consumption
//     curve) and `productPower` (generation curve) as parallel 288-point
//     arrays (5-minute slots across the full day), labeled by a `xAxis`
//     array of LOCAL wall-clock strings like "2026-06-30 00:05" — NOT
//     unix timestamps like realtimePower uses. Converting these to correct
//     UTC instants requires knowing FusionSolar's notion of the browser's
//     UTC offset, which it echoes back in the response URL's own `timeZone`
//     query param (e.g. `timeZone=-4.0`) — computed by the SPA from the
//     browser's local Date/timezone. To make this deterministic in CI
//     (where the runner's OS timezone is UTC, not Chile's), every
//     `browser.newContext()` below pins `timezoneId: "America/Santiago"` so
//     the SPA always computes the correct real-world offset for the plants'
//     actual location, regardless of where the scraper physically runs.

import { chromium, type Browser, type BrowserContext } from "playwright";
import { existsSync } from "node:fs";
import path from "node:path";
import { PLANTS, type PlantConfig } from "./plants.config";
import type { RawPlantReading, StationListEntry } from "./types";

const LOGIN_URL =
  "https://la5.fusionsolar.huawei.com/pvmswebsite/login/build/index.html";
const STORAGE_STATE_PATH = path.join(__dirname, "storage-state", "fusionsolar.json");
const TIMEZONE_ID = "America/Santiago";

function nowIso(): string {
  return new Date().toISOString();
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Converts an offset in hours (e.g. -4, -3.5) to an ISO suffix like "-04:00". */
function isoOffsetSuffix(offsetHours: number): string {
  const sign = offsetHours <= 0 ? "-" : "+";
  const abs = Math.abs(offsetHours);
  const hh = String(Math.floor(abs)).padStart(2, "0");
  const mm = String(Math.round((abs % 1) * 60)).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

/** Parses a "YYYY-MM-DD HH:mm" local wall-clock string using an explicit UTC offset. */
function parseLocalDateTime(dateTimeStr: string, offsetHours: number): string {
  const isoLocal = `${dateTimeStr.replace(" ", "T")}:00${isoOffsetSuffix(offsetHours)}`;
  return new Date(isoLocal).toISOString();
}

/**
 * FusionSolar's intraday curves sample every 5 minutes (~288 points/day) —
 * far denser than a public trend chart needs. Keep every Nth point to land
 * around 30-minute resolution (still ~48 points/day, plenty for a curve).
 */
const CURVE_SAMPLE_STRIDE = 6;

function downsample<T>(points: T[], stride: number): T[] {
  return stride <= 1 ? points : points.filter((_, i) => i % stride === 0);
}

function buildFailedReading(plantId: string, err: unknown): RawPlantReading {
  return {
    plantId,
    scrapedAt: nowIso(),
    ok: false,
    errorMessage: err instanceof Error ? err.message : String(err),
    currentPowerKw: null,
    dailyEnergyKwh: null,
    monthEnergyKwh: null,
    yearEnergyKwh: null,
    cumulativeEnergyKwh: null,
    timeSeries: [],
    consumption: {
      dailyUseEnergyKwh: null,
      monthUseEnergyKwh: null,
      yearUseEnergyKwh: null,
      dailyBuyEnergyKwh: null,
      dailyOnGridEnergyKwh: null,
      dailySelfUseEnergyKwh: null,
      timeSeries: [],
    },
  };
}

export async function scrapeAllPlants(): Promise<RawPlantReading[]> {
  const browser = await chromium.launch({ headless: true });
  const results: RawPlantReading[] = [];

  try {
    const { context, appBaseUrl } = await getOrCreateAuthenticatedSession(browser);

    try {
      const stationList = await fetchStationList(context, appBaseUrl);

      for (const plant of PLANTS) {
        try {
          results.push(await scrapePlant(context, plant, appBaseUrl, stationList));
        } catch (err) {
          console.error(`[solar-scraper] plant ${plant.id} failed:`, err);
          results.push(buildFailedReading(plant.id, err));
        }
      }

      await context.storageState({ path: STORAGE_STATE_PATH });
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function getOrCreateAuthenticatedSession(
  browser: Browser,
): Promise<{ context: BrowserContext; appBaseUrl: string }> {
  if (existsSync(STORAGE_STATE_PATH)) {
    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
      timezoneId: TIMEZONE_ID,
    });
    const page = await context.newPage();
    try {
      await page.goto(LOGIN_URL, { waitUntil: "networkidle", timeout: 20000 });
      if (!page.url().includes("/login/")) {
        const appBaseUrl = page.url().split("#")[0];
        console.log("[solar-scraper] reused existing session");
        return { context, appBaseUrl };
      }
    } catch {
      // fall through to a fresh login below
    } finally {
      await page.close();
    }
    await context.close();
  }

  console.log("[solar-scraper] no valid session — logging in fresh");
  const context = await browser.newContext({ timezoneId: TIMEZONE_ID });
  const appBaseUrl = await login(context);
  return { context, appBaseUrl };
}

async function login(context: BrowserContext): Promise<string> {
  const email = process.env.FUSIONSOLAR_EMAIL;
  const password = process.env.FUSIONSOLAR_PASSWORD;
  if (!email || !password) {
    throw new Error("Missing FUSIONSOLAR_EMAIL / FUSIONSOLAR_PASSWORD environment variables");
  }

  const page = await context.newPage();
  try {
    await page.goto(LOGIN_URL, { waitUntil: "networkidle" });

    const navigationPromise = page.waitForURL((url) => !url.toString().includes("/login/"), {
      timeout: 30000,
    });

    await page.locator("#username input").fill(email);
    await page.locator("#password input").fill(password);
    await page.locator("#btn_outerverify").click();

    try {
      await navigationPromise;
    } catch {
      throw new Error(
        "Login did not complete within 30s — check for CAPTCHA/2FA on FusionSolar or invalid " +
          "credentials; may require manual re-authentication.",
      );
    }

    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    return page.url().split("#")[0];
  } finally {
    await page.close();
  }
}

async function fetchStationList(
  context: BrowserContext,
  appBaseUrl: string,
): Promise<StationListEntry[]> {
  const page = await context.newPage();
  try {
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("station-list") && res.request().method() === "POST",
      { timeout: 20000 },
    );
    await page.goto(`${appBaseUrl}#/home/list`, { waitUntil: "networkidle" });
    const response = await responsePromise;
    const json = await response.json();
    return (json.data?.list ?? []) as StationListEntry[];
  } finally {
    await page.close();
  }
}

async function scrapePlant(
  context: BrowserContext,
  plant: PlantConfig,
  appBaseUrl: string,
  stationList: StationListEntry[],
): Promise<RawPlantReading> {
  const stationEntry = stationList.find((s) => s.name === plant.fusionSolarName);
  if (!stationEntry) {
    const available = stationList.map((s) => s.name).join(", ");
    throw new Error(
      `Plant "${plant.fusionSolarName}" not found in station-list response (found: ${available})`,
    );
  }

  const page = await context.newPage();
  try {
    const detailResponsePromise = page.waitForResponse(
      (res) => res.url().includes("station-detail") && res.request().method() === "GET",
      { timeout: 20000 },
    );
    const energyBalanceResponsePromise = page.waitForResponse(
      (res) => res.url().includes("energy-balance") && res.request().method() === "GET",
      { timeout: 20000 },
    );

    await page.goto(
      `${appBaseUrl}#/view/station/${encodeURIComponent(stationEntry.dn)}/overview`,
      { waitUntil: "networkidle" },
    );

    const detailResponse = await detailResponsePromise;
    const detail = (await detailResponse.json()).data ?? {};

    const realtimePower: Record<string, unknown> = detail.realtimePower ?? {};
    const timeSeries = downsample(
      Object.entries(realtimePower)
        .map(([unixSeconds, value]) => ({
          timestamp: new Date(Number(unixSeconds) * 1000).toISOString(),
          value: toNumber(value) ?? 0,
        }))
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
      CURVE_SAMPLE_STRIDE,
    );

    const rpt = detail.rptNrgKpi ?? {};
    const dailyNrg = rpt.dailyNrg ?? {};
    const monthNrg = rpt.monthNrg ?? {};
    const yearNrg = rpt.yearNrg ?? {};

    // energy-balance may not fire for every plant (e.g. no meter installed);
    // treat its absence as "no consumption data this run", not a hard failure.
    let consumptionTimeSeries: Array<{ timestamp: string; value: number }> = [];
    try {
      const energyBalanceResponse = await energyBalanceResponsePromise;
      const offsetParam = new URL(energyBalanceResponse.url()).searchParams.get("timeZone");
      const offsetHours = offsetParam ? Number(offsetParam) : -4;
      const balance = (await energyBalanceResponse.json()).data ?? {};
      const usePower: string[] = balance.usePower ?? [];
      const xAxis: string[] = balance.xAxis ?? [];
      const now = Date.now();

      consumptionTimeSeries = downsample(
        xAxis
          .map((label, i) => ({
            timestamp: parseLocalDateTime(label, offsetHours),
            value: toNumber(usePower[i]) ?? 0,
          }))
          .filter((point) => new Date(point.timestamp).getTime() <= now)
          .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
        CURVE_SAMPLE_STRIDE,
      );
    } catch (err) {
      console.warn(`[solar-scraper] no energy-balance data for plant ${plant.id}:`, err);
    }

    return {
      plantId: plant.id,
      scrapedAt: nowIso(),
      ok: true,
      currentPowerKw: toNumber(detail.currentPower ?? stationEntry.currentPower),
      dailyEnergyKwh: toNumber(detail.dailyEnergy ?? stationEntry.dailyEnergy),
      monthEnergyKwh: toNumber(detail.monthEnergy ?? stationEntry.monthEnergy),
      yearEnergyKwh: toNumber(detail.yearEnergy ?? stationEntry.yearEnergy),
      cumulativeEnergyKwh: toNumber(stationEntry.cumulativeEnergy),
      timeSeries,
      consumption: {
        dailyUseEnergyKwh: toNumber(dailyNrg.useNrg),
        monthUseEnergyKwh: toNumber(monthNrg.useNrg),
        yearUseEnergyKwh: toNumber(yearNrg.useNrg),
        dailyBuyEnergyKwh: toNumber(dailyNrg.buyNrg),
        dailyOnGridEnergyKwh: toNumber(dailyNrg.onGridNrg),
        dailySelfUseEnergyKwh: toNumber(dailyNrg.selfUseNrg),
        timeSeries: consumptionTimeSeries,
      },
    };
  } finally {
    await page.close();
  }
}
