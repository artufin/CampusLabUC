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

      {/* Sobre la iniciativa */}
      <section className="s s--white">
        <div className="wrap">
          <div className="g2">
            <div
              className="img-ph img-green"
              style={{ height: 300 }}
            >
            </div>
            <div>
              <p className="overline" style={{ color: "var(--or)", marginBottom: 14 }}>
                La iniciativa
              </p>
              <h2 className="sh sh--tD" style={{ marginBottom: 24 }}>
                Sobre la iniciativa
              </h2>
              <p className="body" style={{ marginBottom: 28 }}>
                CampusLab UC es una innovación educativa que utiliza los campus universitarios como
                escenarios de aprendizaje, experimentación y co-creación. Este modelo promueve la
                colaboración activa entre academia, gestión universitaria y comunidades para enfrentar
                desafíos relacionados con la sostenibilidad.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="tag">Innovación educativa</span>
                <span className="tag">Sostenibilidad</span>
                <span className="tag">Co-creación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="s s--tL">
        <div className="wrap">
          <p className="overline" style={{ color: "var(--t)", marginBottom: 12 }}>
            ¿Qué buscamos?
          </p>
          <h2 className="sh" style={{ marginBottom: 48 }}>Objetivos</h2>
          <div className="g3">
            <div className="obj-card">
              <div className="obj-card__n">01</div>
              <p className="obj-card__t">
                Integrar academia y gestión para responder a necesidades territoriales con enfoque
                sostenible.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">02</div>
              <p className="obj-card__t">
                Desarrollar proyectos innovadores y escalables que puedan replicarse en distintos
                contextos.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">03</div>
              <p className="obj-card__t">
                Visibilizar resultados y aprendizajes para fortalecer la colaboración entre actores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="s s--white">
        <div className="wrap">
          <div className="g2">
            <div>
              <h2 className="sh" style={{ marginBottom: 20 }}>Pilares</h2>
              <p className="body">
                Aprendizaje situado, colaboración interdisciplinaria y acción con impacto medible en
                el entorno universitario.
              </p>
            </div>
            <div className="img-ph img-forest" style={{ height: 240 }} />
          </div>
        </div>
      </section>

      {/* Propuesta de valor */}
      <section className="s s--cream">
        <div className="wrap">
          <div className="g2">
            <div className="img-ph img-blue" style={{ height: 240 }} />
            <div>
              <h2 className="sh" style={{ marginBottom: 20 }}>Propuesta de valor</h2>
              <p className="body">
                Vincular docencia, investigación y extensión en una sola experiencia para que cada
                desafío del campus se convierta en una oportunidad real de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Académicos asociados */}
      <section className="s s--white">
        <div className="wrap">
          <h2 className="sh sh--tD" style={{ marginBottom: 48 }}>Académicos asociados</h2>
          {academicPeople.length > 0 ? (
            <div className="g3">
              {academicPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay académicos cargados"
              description="Cuando la API de personas esté disponible, esta sección mostrará los perfiles del grupo académico."
            />
          )}
        </div>
      </section>

      <SponsorBand sponsors={sponsors} />
      <LatestExperiencesCarousel items={experiences} />
    </SiteShell>
  );
}
