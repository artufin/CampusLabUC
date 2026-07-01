/** Subset of fields we read from FusionSolar's station-list response entries. */
export interface StationListEntry {
  dn: string;
  name: string;
  plantStatus: string;
  currentPower: string | number;
  dailyEnergy: string | number;
  monthEnergy: string | number;
  yearEnergy: string | number;
  cumulativeEnergy: string | number;
}

/** Consumption-side fields, read from station-detail's rptNrgKpi + energy-balance. */
export interface RawConsumptionReading {
  dailyUseEnergyKwh: number | null;
  monthUseEnergyKwh: number | null;
  yearUseEnergyKwh: number | null;
  dailyBuyEnergyKwh: number | null;
  dailyOnGridEnergyKwh: number | null;
  dailySelfUseEnergyKwh: number | null;
  /** Today's intraday consumption curve from energy-balance's usePower, if available. */
  timeSeries: Array<{ timestamp: string; value: number }>;
}

/** Scraper-internal raw shape — deliberately NOT the same as OpenDataDataset. */
export interface RawPlantReading {
  plantId: string;
  scrapedAt: string;
  currentPowerKw: number | null;
  dailyEnergyKwh: number | null;
  monthEnergyKwh: number | null;
  yearEnergyKwh: number | null;
  cumulativeEnergyKwh: number | null;
  /** Today's intraday power curve from FusionSolar's station-detail, if available. */
  timeSeries: Array<{ timestamp: string; value: number }>;
  consumption: RawConsumptionReading;
  ok: boolean;
  errorMessage?: string;
}
