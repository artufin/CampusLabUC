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
      <div className="page-stack">
        {dataset ? (
          <>
            <div className="dataset-detail-hero">
              <div>
                <p className="dataset-detail-kicker">{dataset.source.label}</p>
                <h1 className="page-title">{dataset.title}</h1>
                <p className="page-intro">{dataset.description}</p>
              </div>
            </div>

            <OpenDataSeriesChart dataset={dataset} />

            <section className="dataset-metadata-grid">
              <article className="info-card">
                <h3>Fuente</h3>
                <p>{dataset.source.magnitude}</p>
                <p>{dataset.source.expectedFrequency}</p>
                <p>{dataset.source.instrument}</p>
              </article>

              <article className="info-card">
                <h3>Stream</h3>
                <p>{dataset.stream.mode}</p>
                <p>{dataset.stream.status}</p>
                <p>{dataset.stream.cadence}</p>
                <p>{dataset.stream.timezone}</p>
              </article>

              <article className="info-card">
                <h3>Mediciones</h3>
                <p>Ultima actualizacion: {formatTimestamp(dataset.stream.lastUpdate)}</p>
                <p>Serie de {dataset.measurements.length} puntos numericos</p>
                <p>
                  Valores entre {Math.min(...dataset.measurements.map((item) => item.value))} y {Math.max(...dataset.measurements.map((item) => item.value))}
                </p>
              </article>
            </section>

            
            <article className="info-card">
            <h3>Descargas</h3>
            <ul>
                {dataset.downloads.map((download) => (
                <li key={download}>{download}</li>
                ))}
            </ul>
            </article>
          </>
        ) : (
          <article className="info-card dataset-not-found-card">
            <h1 className="page-title">Dataset no encontrado</h1>
            <p className="page-intro">
              No existe un dataset con ese identificador. Revisa el catalogo y elige una de las fichas disponibles.
            </p>

            <div className="dataset-catalog compact">
              {datasets.map((item) => (
                <Link key={item.id} className="dataset-card" href={`/datos-abiertos/${item.id}`}>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="dataset-card-link">Abrir dataset</span>
                </Link>
              ))}
            </div>
          </article>
        )}
      </div>
    </SiteShell>
  );
}