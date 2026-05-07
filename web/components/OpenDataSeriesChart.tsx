import type { OpenDataDataset, OpenDataMeasurement } from "@/lib/types";

interface OpenDataSeriesChartProps {
  dataset: OpenDataDataset;
}

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

          {points.map((point, index) => (
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
            if (index > 0 && index < dataset.measurements.length - 1 && index % 2 === 1) {
              return null;
            }

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
