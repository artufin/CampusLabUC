import { OpportunityGraphic } from "@/components/OpportunityGraphic";
import { OpportunityList } from "@/components/OpportunityList";
import { SiteShell } from "@/components/SiteShell";
import { getChallengeCategories, getOpportunities } from "@/lib/labvivo-data";

export default async function OportunidadesPage() {
  const [categories, opportunities] = await Promise.all([
    getChallengeCategories(),
    getOpportunities(),
  ]);

  return (
    <SiteShell currentPath="/oportunidades">
      <div className="page-stack">
        <h1 className="page-title">Oportunidades de investigacion</h1>

        <section className="opportunity-intro">
          <article>
            <h2 className="section-title">Funcion</h2>
            <p className="section-subtitle">
              Las oportunidades permiten activar proyectos de aprendizaje e
              investigacion aplicada, vinculando cursos, tesis, practicas y
              trabajo con actores del territorio para generar soluciones
              sostenibles en los campus.
            </p>
          </article>

          <OpportunityGraphic />
        </section>

        <OpportunityList opportunities={opportunities} />
      </div>
    </SiteShell>
  );
}
