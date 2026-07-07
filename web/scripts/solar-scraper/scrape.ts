import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { OpenDataDataset } from "../../lib/types";
import { scrapeAllPlants } from "./fusionsolar-client";
import { mapToConsumptionDatasets, mapToOpenDataDatasets } from "./map-to-dataset";

process.loadEnvFile(path.join(__dirname, "../../.env"));

const OUTPUT_PATH = path.join(__dirname, "../../data/solar-plants.json");

interface OutputFile {
  generatedAt: string;
  datasets: OpenDataDataset[];
}

function readPreviousDatasets(): OpenDataDataset[] {
  if (!existsSync(OUTPUT_PATH)) return [];
  try {
    const raw = readFileSync(OUTPUT_PATH, "utf-8");
    const parsed = JSON.parse(raw) as OutputFile;
    return parsed.datasets ?? [];
  } catch (err) {
    console.warn("[solar-scraper] could not read previous output, starting fresh:", err);
    return [];
  }
}

async function main() {
  console.log("[solar-scraper] starting scrape run...");
  const previousDatasets = readPreviousDatasets();

  const readings = await scrapeAllPlants();
  const failedCount = readings.filter((r) => !r.ok).length;
  if (failedCount > 0) {
    console.warn(`[solar-scraper] ${failedCount}/${readings.length} plant(s) failed this run.`);
  }

  const datasets = [
    ...mapToOpenDataDatasets(readings, previousDatasets),
    ...mapToConsumptionDatasets(readings, previousDatasets),
  ];

  const output: OutputFile = {
    generatedAt: new Date().toISOString(),
    datasets,
  };

  mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log(`[solar-scraper] wrote ${datasets.length} dataset(s) to ${OUTPUT_PATH}`);

  const allFailed = readings.every((r) => !r.ok);
  if (allFailed) {
    console.error("[solar-scraper] all plants failed this run.");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[solar-scraper] fatal error:", err);
  process.exit(1);
});
