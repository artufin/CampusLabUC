import Image from "next/image";
import { EmptyState } from "@/components/EmptyState";
import { HomeHero } from "@/components/HomeHero";
import { LatestExperiencesCarousel } from "@/components/LatestExperiencesCarousel";
import { PersonCard } from "@/components/PersonCard";
import { SiteShell } from "@/components/SiteShell";
import { SponsorBand } from "@/components/SponsorBand";
import {
  getLatestExperiences,
  getPeopleByGroup,
  getSponsors,
} from "@/lib/labvivo-data";

export default async function Home() {
  const [academicPeople, sponsors, experiences] = await Promise.all([
    getPeopleByGroup("academic"),
    getSponsors(),
    getLatestExperiences(6),
  ]);

  return (
    <SiteShell currentPath="/">
      <HomeHero />

      <div className="page-stack">

        <section className="content-split">
          <article className="copy-block">
            <h2>Sobre la iniciativa</h2>
            <p>
              Campus Lab UC es una innovacion educativa
              que utiliza los campus universitarios como escenarios de
              aprendizaje, experimentacion y co-creacion. Este modelo promueve
              la colaboracion activa entre academia, gestion universitaria y
              comunidades para enfrentar desafios relacionados con la
              sostenibilidad.
            </p>
          </article>

          <div className="media-card">
            <Image
              src="/assets/photos/sobre_la_iniciativa.png"
              alt="Sesion de trabajo en laboratorio vivo"
              fill
              sizes="(max-width: 1060px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="highlight-strip">
          <div className="placeholder-boxes" aria-hidden="true">
            <div className="placeholder-box" />
            <div className="placeholder-box" />
          </div>

          <article>
            <h2>Objetivos</h2>
            <p>
              Esta iniciativa promueve aprendizajes con impacto real en los
              campus y su entorno.
            </p>
            <ol>
              <li>
                Integrar academia y gestion para responder a necesidades
                territoriales con enfoque sostenible.
              </li>
              <li>
                Desarrollar proyectos innovadores y escalables que puedan
                replicarse en distintos contextos.
              </li>
              <li>
                Visibilizar resultados y aprendizajes para fortalecer la
                colaboracion entre actores.
              </li>
            </ol>
          </article>
        </section>

        <section className="content-split">
          <article className="copy-block">
            <h2>Pilares</h2>
            <p>
              Aprendizaje situado, colaboracion interdisciplinaria y accion con
              impacto medible en el entorno universitario.
            </p>
          </article>

          <div className="media-card" aria-hidden="true" />
        </section>

        <section className="content-split">
          <article className="copy-block">
            <h2>Propuesta de valor</h2>
            <p>
              Vincular docencia, investigacion y extension en una sola
              experiencia para que cada desafio del campus se convierta en una
              oportunidad real de aprendizaje.
            </p>
          </article>

          <div className="media-card" aria-hidden="true" />
        </section>

        <section>
          <h2 className="section-title">Academicos asociados</h2>

          {academicPeople.length > 0 ? (
            <div className="people-grid">
              {academicPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay academicos cargados"
              description="Cuando la API de personas este disponible, esta seccion mostrara los perfiles vinculados al grupo academico."
            />
          )}
        </section>

        <SponsorBand sponsors={sponsors} />
        <LatestExperiencesCarousel items={experiences} />
      </div>
    </SiteShell>
  );
}
