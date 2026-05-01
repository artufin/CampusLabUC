import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

const DATASETS = [
  {
    id: "dataset-1",
    title: "Inventario de arbolado urbano",
    summary:
      "Registro mock de especies, estado sanitario y ubicacion de arbolado para visualizacion de campus.",
  },
  {
    id: "dataset-2",
    title: "Consumo hidrico por campus",
    summary:
      "Serie simulada de consumos, variaciones estacionales y puntos de monitoreo para lectura rapida.",
  },
  {
    id: "dataset-3",
    title: "Mapa de residuos valorizables",
    summary:
      "Catalogo de flujos, origen y tratamiento de materiales recuperables para proyectos docentes.",
  },
  {
    id: "dataset-4",
    title: "Red de movilidad activa",
    summary:
      "Conjunto ficticio de trazados, estaciones y recorridos para explorar patrones de desplazamiento.",
  },
];

export default async function DatosAbiertosPage() {
  return (
    <SiteShell currentPath="/datos-abiertos">
      <div className="page-stack">
        <h1 className="page-title">Datos abiertos</h1>

        <article className="map-placeholder-card">
          <h2 className="section-title">Catalogo de datasets</h2>
          <p className="section-subtitle">
            Cada dataset apunta a una ficha de detalle preparada para albergar
            trazabilidad, descargas y visualizaciones especificas.
          </p>

          <div className="dataset-catalog">
            {DATASETS.map((dataset) => (
              <Link
                key={dataset.id}
                className="dataset-card"
                href="/datos-abiertos/dataset"
              >
                <h3>{dataset.title}</h3>
                <p>{dataset.summary}</p>
                <span className="dataset-card-link">Ver dataset</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
