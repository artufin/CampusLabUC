import Image from "next/image";
import Link from "next/link";
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

      <div className="home-bg-fixed">
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
                Plataforma de investigación e innovación que usa entornos reales como campo de
                estudio, involucrando a sus propios usuarios como co-creadores de soluciones.
                Aprovecha el espacio físico de los campus UC como microcosmos de información para
                la experimentación, aprendizaje y co-creación entre academia, comunidad y actores
                externos, en torno a la sustentabilidad e innovación social.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="tag-tip" tabIndex={0}>
                  <span className="tag">Datos ecológicamente válidos</span>
                  <span className="tag-tip__box">
                    Los datos provienen de contextos reales, no de laboratorios controlados.
                  </span>
                </span>
                <span className="tag-tip" tabIndex={0}>
                  <span className="tag">Comportamientos auténticos</span>
                  <span className="tag-tip__box">
                    Los usuarios no simulan; sus acciones reflejan la complejidad cotidiana.
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 7 }}>
                <span className="tag-tip" tabIndex={0}>
                  <span className="tag">Adopción real</span>
                  <span className="tag-tip__box">
                    Las soluciones se prueban contra la vida real, aumentando su probabilidad de
                    éxito.
                  </span>
                </span>
                <span className="tag-tip" tabIndex={0}>
                  <span className="tag">Laboratorio vivo</span>
                  <span className="tag-tip__box">
                    Parte fundamental del Plan Estratégico UC 2026-2030.
                  </span>
                </span>
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
                Disponibilizar datos reales para catalizar innovaciones e investigaciones
                sostenibles.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">02</div>
              <p className="obj-card__t">
                Promover proyectos interdisciplinarios y apoyar la formación académica con
                experiencias prácticas de innovación y sustentabilidad.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">03</div>
              <p className="obj-card__t">
                Contribuir a la generación de conocimiento aplicado y su transferencia hacia
                políticas públicas y prácticas institucionales escalables.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">04</div>
              <p className="obj-card__t">
                Fomentar el vínculo entre la universidad y comunidades locales mediante
                metodologías participativas.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">05</div>
              <p className="obj-card__t">
                Contribuir a la eficiencia operativa de los espacios y servicios del campus UC.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">06</div>
              <p className="obj-card__t">
                Fomentar la participación estudiantil en iniciativas de impacto local y compromiso
                público.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo lo hacemos */}
      <section className="s s--white">
        <div className="wrap">
          <p className="overline" style={{ color: "var(--t)", marginBottom: 12 }}>
            Cómo lo hacemos
          </p>
          <h2 className="sh" style={{ marginBottom: 48 }}>Metodología</h2>
          <div className="g3">
            <div className="obj-card">
              <div className="obj-card__n">01</div>
              <p className="obj-card__t">
                <strong>Insight Research.</strong> Lectura del campus a partir de los datos
                existentes y entrevistas con la comunidad, sin intervenir aún en sus prácticas.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">02</div>
              <p className="obj-card__t">
                <strong>Co-creación y prototipado.</strong> Talleres con estudiantes, académicos y
                gestión para idear soluciones y probarlas en condiciones reales del campus.
              </p>
            </div>
            <div className="obj-card">
              <div className="obj-card__n">03</div>
              <p className="obj-card__t">
                <strong>Field Testing.</strong> Despliegue a mayor escala de los prototipos
                seleccionados, midiendo su impacto con los mismos flujos de datos nativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datos del campus */}
      <section className="s s--cream">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <p className="overline" style={{ color: "var(--t)" }}>
              Infraestructura de datos
            </p>
            <Link href="/datos-abiertos" style={{ color: "var(--or)", fontSize: 14, fontWeight: 700 }}>
              Ver datos abiertos →
            </Link>
          </div>
          <h2 className="sh" style={{ marginBottom: 48 }}>Datos del campus</h2>
          <div className="g3">
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Energía.</strong> Consumo y generación eléctrica por edificio.
              </p>
            </div>
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Clima interior.</strong> Temperatura, humedad y CO₂ en salas y laboratorios.
              </p>
            </div>
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Ocupación y movilidad.</strong> Aforo de espacios y desplazamiento en el
                campus.
              </p>
            </div>
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Agua y residuos.</strong> Consumo de agua potable y gestión de residuos.
              </p>
            </div>
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Flora y fauna.</strong> Biodiversidad presente en las áreas verdes del
                campus.
              </p>
            </div>
            <div className="obj-card">
              <p className="obj-card__t">
                <strong>Infraestructura física.</strong> Estado y uso de la infraestructura del
                campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Académicos asociados */}
      <section className="s s--white">
        <div className="wrap">
          <h2 className="sh sh--tD" style={{ marginBottom: 48 }}>Académicos participantes</h2>
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

      <LatestExperiencesCarousel items={experiences} />
      </div>

      <SponsorBand sponsors={sponsors} />

    </SiteShell>
  );
}
