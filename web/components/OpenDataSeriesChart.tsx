import type { OpenDataDataset, OpenDataMeasurement } from "@/lib/types";

interface OpenDataSeriesChartProps {
  dataset: OpenDataDataset;
}

/** Above this many points, individual circles would overlap into an unreadable blob — show only the line. */
const MAX_VISIBLE_CIRCLES = 40;
/** Fixed label count regardless of dataset size — an unbounded label-per-point row overflows the layout. */
const MAX_AXIS_LABELS = 6;

function formatMeasurementLabel(timestamp: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatSummaryValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/** Picks up to `maxLabels` indices, evenly spaced across `count`, always including the first and last. */
function pickLabelIndices(count: number, maxLabels: number): Set<number> {
  if (count <= maxLabels) {
    return new Set(Array.from({ length: count }, (_, i) => i));
  }
  const step = (count - 1) / (maxLabels - 1);
  const indices = new Set<number>();
  for (let i = 0; i < maxLabels; i++) {
    indices.add(Math.round(i * step));
  }
  return indices;
}

function buildLinePoints(
  measurements: OpenDataMeasurement[],
  width: number,
  height: number,
  padding: number,
) {
  const numericValues = measurements.map((measurement) => measurement.value);
  const minimum = Math.min(...numericValues);
  const maximum = Math.max(...numericValues);
  const range = maximum - minimum || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  return measurements.map((measurement, index) => {
    const x = padding + (innerWidth * index) / Math.max(measurements.length - 1, 1);
    const normalized = (measurement.value - minimum) / range;
    const y = padding + innerHeight - normalized * innerHeight;

    return { x, y };
  });
}

export function OpenDataSeriesChart({ dataset }: OpenDataSeriesChartProps) {
  const width = 860;
  const height = 300;
  const padding = 36;
  const points = buildLinePoints(dataset.measurements, width, height, padding);
  const values = dataset.measurements.map((measurement) => measurement.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const fillPath = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
  const showCircles = points.length <= MAX_VISIBLE_CIRCLES;
  const labelIndices = pickLabelIndices(dataset.measurements.length, MAX_AXIS_LABELS);

  return (
    <section className="dataset-chart-card">
      <div className="dataset-chart-header">
        <div>
          <p className="dataset-chart-kicker">Serie temporal</p>
          <h2 className="section-title">{dataset.title}</h2>
          <p className="section-subtitle">{dataset.summary}</p>
        </div>

        <div className="dataset-chart-stat">
          <span>Unidad</span>
          <strong>{dataset.source.unit}</strong>
        </div>
      </div>

      <div className="dataset-chart-figure">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${dataset.title} con ${dataset.measurements.length} puntos de medicion`}
        >
          <defs>
            <linearGradient id={`chart-fill-${dataset.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(97, 112, 47, 0.35)" />
              <stop offset="100%" stopColor="rgba(97, 112, 47, 0.04)" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((row) => {
            const y = padding + (row * (height - padding * 2)) / 3;

            return <line key={row} x1={padding} x2={width - padding} y1={y} y2={y} className="dataset-chart-grid" />;
          })}

          <path d={fillPath} className="dataset-chart-area" fill={`url(#chart-fill-${dataset.id})`} />
          <path d={pathData} className="dataset-chart-line" />

          {showCircles &&
            points.map((point, index) => (
              <g key={`${dataset.measurements[index].timestamp}-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  className={`dataset-chart-point quality-${dataset.measurements[index].quality}`}
                />
              </g>
            ))}
        </svg>

        <div className="dataset-chart-axis">
          {dataset.measurements.map((measurement, index) => {
            if (!labelIndices.has(index)) return null;

            return (
              <span key={measurement.timestamp}>
                {formatMeasurementLabel(measurement.timestamp)}
              </span>
            );
          })}
        </div>
      </div>

      <div className="dataset-chart-summary">
        <article>
          <span>Minimo</span>
          <strong>{formatSummaryValue(minimum)}</strong>
        </article>
        <article>
          <span>Promedio</span>
          <strong>{formatSummaryValue(average)}</strong>
        </article>
        <article>
          <span>Maximo</span>
          <strong>{formatSummaryValue(maximum)}</strong>
        </article>
        <article>
          <span>Puntos</span>
          <strong>{dataset.measurements.length}</strong>
        </article>
      </div>
    </section>
  );
}
