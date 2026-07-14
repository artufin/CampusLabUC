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
//   the response is an HTML error page, not JSON — UNLESS the request carries
//   a valid `roarand` anti-CSRF header. That header is injected by the SPA's
//   own bundled request-wrapper and isn't computable from outside it, but it
//   IS just a session-scoped token: once you've captured it off ONE real
//   request fired by the page (via `response.request().allHeaders()`), it can
//   be reused verbatim across further manual `context.request.get()` calls in
//   that same browser context — confirmed live by replaying the
//   `energy-balance` call with a different `queryTime`/`dateStr` and the same
//   `roarand` and getting a genuine 200 with that day's data. So: the FIRST
//   request of each kind still has to come from a real page navigation (to
//   mint the token), but follow-up variations of that same request (e.g.
//   walking `energy-balance` backwards over several days for a week of
//   history) don't need additional navigations or UI interaction — see
//   `fetchHistoricalEnergyBalance` below.
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
//
// - `energy-balance` also takes `queryTime` (local midnight of the requested
//   day, as epoch ms) and a matching `dateStr` — verified live: decrementing
//   both by 24h and replaying the request (same `roarand`, see above) returns
//   that earlier day's `productPower`/`usePower`/`xAxis`, not a repeat of
//   today. `fetchHistoricalEnergyBalance` walks this back `HISTORY_DAYS` more
//   days past the one the initial navigation already fetched, so each scrape
//   run comes back with a full week of curve data instead of just today's.
//   `station-detail`'s `realtimePower` has no equivalent date param (or none
//   found so far), so today's generation curve still comes from there as
//   before — only the historical days route through `energy-balance`.

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

/** How many days before "today" to additionally fetch — 6 + today = a full week. */
const HISTORY_DAYS = 6;

interface EnergyBalanceCurves {
  generation: Array<{ timestamp: string; value: number }>;
  consumption: Array<{ timestamp: string; value: number }>;
}

/** Parses one `energy-balance` response body's parallel curve arrays into timestamped points. */
function parseEnergyBalanceCurves(
  data: { xAxis?: string[]; productPower?: string[]; usePower?: string[] },
  offsetHours: number,
): EnergyBalanceCurves {
  const xAxis = data.xAxis ?? [];
  const productPower = data.productPower ?? [];
  const usePower = data.usePower ?? [];
  const now = Date.now();

  const points = xAxis
    .map((label, i) => ({
      timestamp: parseLocalDateTime(label, offsetHours),
      generationValue: toNumber(productPower[i]) ?? 0,
      consumptionValue: toNumber(usePower[i]) ?? 0,
    }))
    .filter((point) => new Date(point.timestamp).getTime() <= now)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    generation: downsample(
      points.map((p) => ({ timestamp: p.timestamp, value: p.generationValue })),
      CURVE_SAMPLE_STRIDE,
    ),
    consumption: downsample(
      points.map((p) => ({ timestamp: p.timestamp, value: p.consumptionValue })),
      CURVE_SAMPLE_STRIDE,
    ),
  };
}

/**
 * Replays `energy-balance` for the `HISTORY_DAYS` days before the one the initial
 * navigation already covered, reusing that request's `roarand` header (see the
 * recon notes at the top of this file for why that's safe) instead of navigating
 * the page again per day.
 */
async function fetchHistoricalEnergyBalance(
  context: BrowserContext,
  todayRequestUrl: string,
  roarand: string,
  referer: string,
  offsetHours: number,
): Promise<EnergyBalanceCurves> {
  const generation: EnergyBalanceCurves["generation"] = [];
  const consumption: EnergyBalanceCurves["consumption"] = [];
  const oneDayMs = 24 * 60 * 60 * 1000;
  const url = new URL(todayRequestUrl);
  const todayQueryTime = Number(url.searchParams.get("queryTime"));

  for (let offset = 1; offset <= HISTORY_DAYS; offset++) {
    const queryTime = todayQueryTime - offset * oneDayMs;
    const d = new Date(queryTime);
    const dateStr =
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-` +
      `${String(d.getUTCDate()).padStart(2, "0")} 00:00:00`;
    url.searchParams.set("queryTime", String(queryTime));
    url.searchParams.set("dateStr", dateStr);
    url.searchParams.set("_", String(Date.now()));

    try {
      const response = await context.request.get(url.toString(), {
        headers: {
          roarand,
          accept: "application/json, text/javascript, */*; q=0.01",
          "x-requested-with": "XMLHttpRequest",
          referer,
        },
      });
      if (!response.ok()) {
        console.warn(
          `[solar-scraper] historical energy-balance request failed (day -${offset}): HTTP ${response.status()}`,
        );
        continue;
      }
      const json = await response.json();
      const curves = parseEnergyBalanceCurves(json.data ?? {}, offsetHours);
      generation.push(...curves.generation);
      consumption.push(...curves.consumption);
    } catch (err) {
      console.warn(`[solar-scraper] historical energy-balance request errored (day -${offset}):`, err);
    }
  }

  return { generation, consumption };
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
    // It's also the only source for the past HISTORY_DAYS days of both curves
    // (today's generation still comes from realtimePower above) — see
    // fetchHistoricalEnergyBalance and the recon notes at the top of this file.
    let consumptionTimeSeries: Array<{ timestamp: string; value: number }> = [];
    let historicalGeneration: Array<{ timestamp: string; value: number }> = [];
    let historicalConsumption: Array<{ timestamp: string; value: number }> = [];
    try {
      const energyBalanceResponse = await energyBalanceResponsePromise;
      const offsetParam = new URL(energyBalanceResponse.url()).searchParams.get("timeZone");
      const offsetHours = offsetParam ? Number(offsetParam) : -4;
      const balance = (await energyBalanceResponse.json()).data ?? {};
      consumptionTimeSeries = parseEnergyBalanceCurves(balance, offsetHours).consumption;

      const roarand = (await energyBalanceResponse.request().allHeaders()).roarand;
      if (roarand) {
        const historical = await fetchHistoricalEnergyBalance(
          context,
          energyBalanceResponse.url(),
          roarand,
          page.url(),
          offsetHours,
        );
        historicalGeneration = historical.generation;
        historicalConsumption = historical.consumption;
      } else {
        console.warn(`[solar-scraper] no roarand header on energy-balance response for plant ${plant.id}, skipping history`);
      }
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
      timeSeries: [...historicalGeneration, ...timeSeries].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp),
      ),
      consumption: {
        dailyUseEnergyKwh: toNumber(dailyNrg.useNrg),
        monthUseEnergyKwh: toNumber(monthNrg.useNrg),
        yearUseEnergyKwh: toNumber(yearNrg.useNrg),
        dailyBuyEnergyKwh: toNumber(dailyNrg.buyNrg),
        dailyOnGridEnergyKwh: toNumber(dailyNrg.onGridNrg),
        dailySelfUseEnergyKwh: toNumber(dailyNrg.selfUseNrg),
        timeSeries: [...historicalConsumption, ...consumptionTimeSeries].sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp),
        ),
      },
    };
  } finally {
    await page.close();
  }
}
