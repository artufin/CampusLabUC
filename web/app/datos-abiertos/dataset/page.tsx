import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

const DOWNLOADS = [
  "CSV consolidado de indicadores",
  "JSON de metadatos",
  "Ficha metodologica (PDF)",
  "Diccionario de variables",
];

export default function DatasetPage() {
  return (
    <SiteShell currentPath="/datos-abiertos">
      <div className="page-stack">
        <h1 className="page-title">Dataset</h1>
        <p className="page-intro">
          Esta vista queda disponible para mostrar detalle de cada conjunto de
          datos y sus formatos de descarga.
        </p>

        <article className="info-card" style={{ marginBottom: 22 }}>
          <h3 style={{ marginBottom: 8 }}>Visualizacion del dataset</h3>
          <p>
            Espacio reservado para graficos, filtros y trazabilidad de origen.
            Al conectar la API, este bloque puede renderizar componentes de
            analitica en tiempo real.
          </p>
        </article>

        <article className="info-card">
          <h3 style={{ marginBottom: 8 }}>Descargas</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            {DOWNLOADS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p style={{ marginTop: 12 }}>
            <Link
              href="/datos-abiertos"
              style={{ textDecoration: "underline" }}
            >
              Volver a Datos Abiertos
            </Link>
          </p>
        </article>
      </div>
    </SiteShell>
  );
}
