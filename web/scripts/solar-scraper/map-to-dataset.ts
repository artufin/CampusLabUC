import type {
  OpenDataDataset,
  OpenDataMeasurement,
  OpenDataMetric,
} from "../../lib/types";
import { PLANTS } from "./plants.config";
import type { RawPlantReading } from "./types";

/**
 * `fusionsolar-client.ts` downsamples its curves to ~30-minute resolution
 * (~48 points/day) before this runs, so 300 comfortably keeps several days of
 * trend rather than just today; older points roll off past this cap.
 */
const MAX_MEASUREMENTS = 300;

function buildEmptyDataset(plantId: string): OpenDataDataset {
  const plant = PLANTS.find((p) => p.id === plantId)!;
  return {
    id: plant.id,
    title: `Generación solar — ${plant.label}`,
    summary: `Generación fotovoltaica de la planta ${plant.label}, monitoreada vía FusionSolar. Aún sin datos.`,
    description:
      `Datos de generación fotovoltaica de la planta ${plant.label}, obtenidos automáticamente ` +
      "desde la plataforma de monitoreo Huawei FusionSolar utilizada por el proveedor de equipos " +
      "solares Nikola Chile. La serie se actualiza dos veces al día mediante un proceso automatizado.",
    tags: ["Energía solar", "Generación eléctrica", plant.label],
    source: {
      id: `source-${plant.id}`,
      kind: "electric",
      label: `Planta solar ${plant.label}`,
      location: plant.location,
      magnitude: "Potencia y energía generada",
      unit: "kWh",
      expectedFrequency: "Actualización 2 veces al día",
      instrument: "Inversor fotovoltaico Huawei, monitoreado vía FusionSolar",
    },
    stream: {
      mode: "polling",
      status: "degraded",
      cadence: "Actualización cada ~12 h",
      timezone: "America/Santiago",
      lastUpdate: new Date(0).toISOString(),
    },
    metrics: [],
    measurements: [],
    downloads: ["JSON de generación solar"],
  };
}

function buildMetrics(reading: RawPlantReading): OpenDataMetric[] {
  const metrics: OpenDataMetric[] = [];
  if (reading.currentPowerKw !== null) {
    metrics.push({
      label: "Potencia actual",
      value: `${reading.currentPowerKw} kW`,
      detail: "Lectura más reciente",
    });
  }
  if (reading.dailyEnergyKwh !== null) {
    metrics.push({
      label: "Energía hoy",
      value: `${reading.dailyEnergyKwh} kWh`,
      detail: "Acumulado del día",
    });
  }
  if (reading.monthEnergyKwh !== null) {
    metrics.push({
      label: "Energía del mes",
      value: `${reading.monthEnergyKwh} kWh`,
      detail: "Acumulado mensual",
    });
  }
  if (reading.cumulativeEnergyKwh !== null) {
    metrics.push({
      label: "Energía total",
      value: `${reading.cumulativeEnergyKwh} kWh`,
      detail: "Acumulado histórico de la planta",
    });
  }
  return metrics;
}

function buildMeasurements(reading: RawPlantReading): OpenDataMeasurement[] {
  if (reading.timeSeries.length > 0) {
    return reading.timeSeries.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
      quality: "good",
    }));
  }
  // Fallback: a single point representing this run's snapshot value.
  return [
    {
      timestamp: reading.scrapedAt,
      value: reading.currentPowerKw ?? reading.dailyEnergyKwh ?? 0,
      quality: "good",
    },
  ];
}

/**
 * FusionSolar's `realtimePower` always covers "today" from midnight to now, so
 * consecutive scrape runs on the same day return heavily overlapping
 * timestamps. Merge by timestamp (newest run wins for a given timestamp)
 * rather than naively concatenating, or the chart ends up with duplicate
 * points (and duplicate React keys).
 */
function mergeMeasurements(
  previous: OpenDataMeasurement[],
  incoming: OpenDataMeasurement[],
): OpenDataMeasurement[] {
  const byTimestamp = new Map<string, OpenDataMeasurement>();
  for (const point of previous) byTimestamp.set(point.timestamp, point);
  for (const point of incoming) byTimestamp.set(point.timestamp, point);

  return Array.from(byTimestamp.values())
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .slice(-MAX_MEASUREMENTS);
}

function buildDataset(
  plantId: string,
  reading: RawPlantReading,
  previous: OpenDataDataset | undefined,
): OpenDataDataset {
  const plant = PLANTS.find((p) => p.id === plantId)!;
  const base = previous ?? buildEmptyDataset(plantId);

  const newMeasurements = buildMeasurements(reading);
  const mergedMeasurements = mergeMeasurements(base.measurements, newMeasurements);

  return {
    ...base,
    id: plant.id,
    title: `Generación solar — ${plant.label}`,
    summary:
      `Generación fotovoltaica en tiempo casi real de la planta ${plant.label}, ` +
      "monitoreada vía FusionSolar.",
    tags: ["Energía solar", "Generación eléctrica", plant.label],
    source: {
      ...base.source,
      id: `source-${plant.id}`,
      kind: "electric",
      label: `Planta solar ${plant.label}`,
      location: plant.location,
    },
    stream: {
      ...base.stream,
      mode: "polling",
      status: "active",
      cadence: "Actualización cada ~12 h",
      timezone: "America/Santiago",
      lastUpdate: reading.scrapedAt,
    },
    metrics: buildMetrics(reading),
    measurements: mergedMeasurements,
  };
}

export function mapToOpenDataDatasets(
  readings: RawPlantReading[],
  previous: OpenDataDataset[],
): OpenDataDataset[] {
  return PLANTS.map((plant) => {
    const reading = readings.find((r) => r.plantId === plant.id);
    const previousDataset = previous.find((d) => d.id === plant.id);

    if (!reading || !reading.ok) {
      if (previousDataset) {
        return { ...previousDataset, stream: { ...previousDataset.stream, status: "degraded" as const } };
      }
      return buildEmptyDataset(plant.id);
    }

    return buildDataset(plant.id, reading, previousDataset);
  });
}

function consumptionDatasetId(plantId: string): string {
  return `${plantId}-consumo`;
}

function buildEmptyConsumptionDataset(plantId: string): OpenDataDataset {
  const plant = PLANTS.find((p) => p.id === plantId)!;
  const id = consumptionDatasetId(plantId);
  return {
    id,
    title: `Consumo eléctrico — ${plant.label}`,
    summary: `Consumo eléctrico del punto ${plant.label}, monitoreado vía FusionSolar. Aún sin datos.`,
    description:
      `Datos de consumo eléctrico del punto ${plant.label}, obtenidos automáticamente desde la ` +
      "plataforma de monitoreo Huawei FusionSolar utilizada por el proveedor de equipos solares Nikola " +
      "Chile. Incluye energía consumida, comprada a la red e inyectada a la red. La serie se actualiza " +
      "dos veces al día mediante un proceso automatizado.",
    tags: ["Energía solar", "Consumo eléctrico", plant.label],
    source: {
      id: `source-${id}`,
      kind: "electric",
      label: `Consumo ${plant.label}`,
      location: plant.location,
      magnitude: "Potencia y energía consumida",
      unit: "kWh",
      expectedFrequency: "Actualización 2 veces al día",
      instrument: "Medidor eléctrico Huawei, monitoreado vía FusionSolar",
    },
    stream: {
      mode: "polling",
      status: "degraded",
      cadence: "Actualización cada ~12 h",
      timezone: "America/Santiago",
      lastUpdate: new Date(0).toISOString(),
    },
    metrics: [],
    measurements: [],
    downloads: ["JSON de consumo eléctrico"],
  };
}

function buildConsumptionMetrics(reading: RawPlantReading): OpenDataMetric[] {
  const c = reading.consumption;
  const metrics: OpenDataMetric[] = [];
  if (c.dailyUseEnergyKwh !== null) {
    metrics.push({
      label: "Consumo hoy",
      value: `${c.dailyUseEnergyKwh} kWh`,
      detail: "Acumulado del día",
    });
  }
  if (c.dailyBuyEnergyKwh !== null) {
    metrics.push({
      label: "Comprado a la red hoy",
      value: `${c.dailyBuyEnergyKwh} kWh`,
      detail: "Energía importada desde la red",
    });
  }
  if (c.dailyOnGridEnergyKwh !== null) {
    metrics.push({
      label: "Inyectado a la red hoy",
      value: `${c.dailyOnGridEnergyKwh} kWh`,
      detail: "Excedente solar exportado",
    });
  }
  if (c.dailySelfUseEnergyKwh !== null) {
    metrics.push({
      label: "Autoconsumo hoy",
      value: `${c.dailySelfUseEnergyKwh} kWh`,
      detail: "Consumo cubierto por generación propia",
    });
  }
  if (c.monthUseEnergyKwh !== null) {
    metrics.push({
      label: "Consumo del mes",
      value: `${c.monthUseEnergyKwh} kWh`,
      detail: "Acumulado mensual",
    });
  }
  return metrics;
}

function buildConsumptionMeasurements(reading: RawPlantReading): OpenDataMeasurement[] {
  if (reading.consumption.timeSeries.length > 0) {
    return reading.consumption.timeSeries.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
      quality: "good",
    }));
  }
  return [
    {
      timestamp: reading.scrapedAt,
      value: reading.consumption.dailyUseEnergyKwh ?? 0,
      quality: "good",
    },
  ];
}

function buildConsumptionDataset(
  plantId: string,
  reading: RawPlantReading,
  previous: OpenDataDataset | undefined,
): OpenDataDataset {
  const plant = PLANTS.find((p) => p.id === plantId)!;
  const id = consumptionDatasetId(plantId);
  const base = previous ?? buildEmptyConsumptionDataset(plantId);

  const newMeasurements = buildConsumptionMeasurements(reading);
  const mergedMeasurements = mergeMeasurements(base.measurements, newMeasurements);

  return {
    ...base,
    id,
    title: `Consumo eléctrico — ${plant.label}`,
    summary:
      `Consumo eléctrico en tiempo casi real del punto ${plant.label}, ` +
      "monitoreado vía FusionSolar.",
    tags: ["Energía solar", "Consumo eléctrico", plant.label],
    source: {
      ...base.source,
      id: `source-${id}`,
      kind: "electric",
      label: `Consumo ${plant.label}`,
      location: plant.location,
    },
    stream: {
      ...base.stream,
      mode: "polling",
      status: "active",
      cadence: "Actualización cada ~12 h",
      timezone: "America/Santiago",
      lastUpdate: reading.scrapedAt,
    },
    metrics: buildConsumptionMetrics(reading),
    measurements: mergedMeasurements,
  };
}

export function mapToConsumptionDatasets(
  readings: RawPlantReading[],
  previous: OpenDataDataset[],
): OpenDataDataset[] {
  return PLANTS.map((plant) => {
    const reading = readings.find((r) => r.plantId === plant.id);
    const previousDataset = previous.find((d) => d.id === consumptionDatasetId(plant.id));

    if (!reading || !reading.ok) {
      if (previousDataset) {
        return { ...previousDataset, stream: { ...previousDataset.stream, status: "degraded" as const } };
      }
      return buildEmptyConsumptionDataset(plant.id);
    }

    return buildConsumptionDataset(plant.id, reading, previousDataset);
  });
}
