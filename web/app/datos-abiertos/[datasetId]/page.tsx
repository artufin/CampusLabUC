import Link from "next/link";
import { OpenDataSeriesChart } from "@/components/OpenDataSeriesChart";
import { SiteShell } from "@/components/SiteShell";
import {
  getOpenDataDatasetById,
  getOpenDataDatasets,
} from "@/lib/labvivo-data";

interface DatasetDetailPageProps {
  params?: Promise<{ datasetId: string }> | { datasetId: string };
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default async function DatasetDetailPage({ params }: DatasetDetailPageProps) {
  const resolvedParams = await Promise.resolve(params ?? { datasetId: "" });
  const [dataset, datasets] = await Promise.all([
    getOpenDataDatasetById(resolvedParams.datasetId),
    getOpenDataDatasets(),
  ]);

  return (
    <SiteShell currentPath="/datos-abiertos">
      <section className="phero">
        <div className="wrap">
          {dataset ? (
            <>
              <p className="overline" style={{ color: "var(--tL)", marginBottom: 14 }}>
                {dataset.source.label}
              </p>
              <h1 className="phero__h1">{dataset.title}</h1>
              <p className="phero__desc">{dataset.description}</p>
            </>
          ) : (
            <h1 className="phero__h1">Dataset no encontrado</h1>
          )}
        </div>
      </section>

      <section className="s s--white">
        <div className="wrap">
          <Link href="/datos-abiertos" className="dataset-back-link">
            ← Volver a datos abiertos
          </Link>

          {dataset ? (
            <>
              <OpenDataSeriesChart dataset={dataset} />

              <div className="dataset-metadata-grid">
                <div className="info-card">
                  <h3>Fuente</h3>
                  <p>{dataset.source.magnitude}</p>
                  <p>{dataset.source.expectedFrequency}</p>
                  <p>{dataset.source.instrument}</p>
                </div>
                <div className="info-card">
                  <h3>Stream</h3>
                  <p>{dataset.stream.mode}</p>
                  <p>{dataset.stream.status}</p>
                  <p>{dataset.stream.cadence}</p>
                  <p>{dataset.stream.timezone}</p>
                </div>
                <div className="info-card">
                  <h3>Mediciones</h3>
                  <p>Última actualización: {formatTimestamp(dataset.stream.lastUpdate)}</p>
                  <p>Serie de {dataset.measurements.length} puntos numéricos</p>
                  <p>
                    Valores entre{" "}
                    {Math.min(...dataset.measurements.map((m) => m.value))} y{" "}
                    {Math.max(...dataset.measurements.map((m) => m.value))}
                  </p>
                </div>
              </div>

              <div className="info-card" style={{ marginTop: 20 }}>
                <h3>Descargas</h3>
                <ul>
                  {dataset.downloads.map((download) => (
                    <li key={download}>{download}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="dataset-not-found-card">
              <p className="body">
                No existe un dataset con ese identificador. Revisa el catálogo y elige una de las
                fichas disponibles.
              </p>
              <div className="ds-grid">
                {datasets.map((item) => (
                  <Link key={item.id} href={`/datos-abiertos/${item.id}`} className="ds-card">
                    <h3 className="ds-card__title">{item.title}</h3>
                    <p className="ds-card__desc">{item.summary}</p>
                    <span className="btn btn--teal btn--sm" style={{ alignSelf: "flex-start" }}>
                      Abrir dataset
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
