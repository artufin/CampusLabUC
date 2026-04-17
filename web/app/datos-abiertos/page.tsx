import Link from "next/link";
import { ChallengeCircleMap } from "@/components/ChallengeCircleMap";
import { SiteShell } from "@/components/SiteShell";
import { getChallengeCategories, getOpenDataEntries } from "@/lib/labvivo-data";

export default async function DatosAbiertosPage() {
  const [categories, openDataEntries] = await Promise.all([
    getChallengeCategories(),
    getOpenDataEntries(),
  ]);

  return (
    <SiteShell currentPath="/datos-abiertos">
      <div className="page-stack">
        <h1 className="page-title">Datos abiertos</h1>

        <ChallengeCircleMap
          categories={categories}
          title="Oportunidades"
          subtitle="Categorias de desafios cargadas de forma dinamica para reutilizar el mismo origen de datos en varias vistas."
        />

        <section className="info-cards">
          {openDataEntries.map((entry) => (
            <article key={entry.id} className="info-card">
              <h3>{entry.title}</h3>
              <p>{entry.body}</p>
            </article>
          ))}
        </section>

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

          <p style={{ marginTop: 14 }}>
            Si quieres revisar una estructura de dataset, visita
            <Link
              href="/datos-abiertos/dataset"
              style={{ textDecoration: "underline", marginLeft: 6 }}
            >
              /datos-abiertos/dataset
            </Link>
            .
          </p>
        </article>
      </div>
    </SiteShell>
  );
}
