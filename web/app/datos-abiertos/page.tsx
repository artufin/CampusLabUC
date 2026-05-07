import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getOpenDataDatasets } from "@/lib/labvivo-data";

export default async function DatosAbiertosPage() {
  const datasets = await getOpenDataDatasets();

  return (
    <SiteShell currentPath="/datos-abiertos">
      <div className="page-stack">
        <h1 className="page-title">Datos abiertos</h1>

        <article className="map-placeholder-card">
          <h2 className="section-title">Catálogo de datasets</h2>
          <p className="section-subtitle">
            Cada dataset apunta a una ficha de detalle preparada para albergar
            trazabilidad, descargas y visualizaciones especificas.
          </p>

          <div className="dataset-catalog">
            {datasets.map((dataset) => (
              <Link
                key={dataset.id}
                className="dataset-card"
                href={`/datos-abiertos/${dataset.id}`}
              >
                <h3>{dataset.title}</h3>
                <p>{dataset.summary}</p>
                <p className="dataset-card-meta">
                  {dataset.source.label} · {dataset.source.unit}
                </p>
                <span className="dataset-card-link">Ver dataset</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="map-placeholder-card">
          <h2 className="section-title">Mapa interactivo</h2>
          <p className="section-subtitle">
            Integracion pendiente para visualizacion interactiva de capas y
            ubicaciones. Mientras tanto se mantiene el contenedor listo.
          </p>

          <div className="map-placeholder-inner">
            <div>
              <p>Proximamente</p>
              <p style={{ fontSize: "1rem", marginTop: 8 }}>
                Vista placeholder para el mapa de campus y datasets
              </p>
            </div>
          </div>

        </article>
      </div>
    </SiteShell>
  );
}
