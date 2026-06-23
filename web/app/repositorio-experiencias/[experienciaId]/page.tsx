import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import {
  getExperienceById,
  getExperiences,
  getProjectById,
  getProjects,
} from "@/lib/labvivo-data";

interface ExperienceDetailPageProps {
  params?: Promise<{ experienciaId: string }> | { experienciaId: string };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const resolvedParams = await Promise.resolve(params ?? { experienciaId: "" });
  const [experience, project] = await Promise.all([
    getExperienceById(resolvedParams.experienciaId),
    getProjectById(resolvedParams.experienciaId),
  ]);

  if (project) {
    return (
      <SiteShell currentPath="/repositorio-experiencias">
        <section className="phero">
          <div className="wrap">
            <p className="overline" style={{ color: "var(--tL)", marginBottom: 14 }}>
              {project.challengeType}
            </p>
            <h1 className="phero__h1">{project.title}</h1>
            <p className="phero__desc">{project.description}</p>
          </div>
        </section>

        <section className="s s--white">
          <div className="wrap">
            <Link href="/repositorio-experiencias" className="dataset-back-link">
              ← Volver al repositorio
            </Link>

            <div className="img-ph img-forest" style={{ height: 320, marginBottom: 28 }} />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {project.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <p className="body" style={{ marginBottom: 32, maxWidth: 680 }}>
              {project.description}
            </p>

            <div className="dataset-metadata-grid">
              <div className="info-card">
                <h3>Contacto</h3>
                <p>{project.contactName}</p>
                <a href={`mailto:${project.contactEmail}`}>{project.contactEmail}</a>
              </div>
              <div className="info-card">
                <h3>Tipo de desafío</h3>
                <p>{project.challengeType}</p>
              </div>
              <div className="info-card">
                <h3>Nivel de involucramiento</h3>
                <p>{project.engagementLevel}</p>
              </div>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  if (experience) {
    return (
      <SiteShell currentPath="/repositorio-experiencias">
        <section className="phero">
          <div className="wrap">
            <p className="overline" style={{ color: "var(--tL)", marginBottom: 14 }}>
              {experience.location ?? "Experiencia del Campus Lab"}
            </p>
            <h1 className="phero__h1">{experience.title}</h1>
            <p className="phero__desc">{experience.summary}</p>
          </div>
        </section>

        <section className="s s--white">
          <div className="wrap">
            <Link href="/repositorio-experiencias" className="dataset-back-link">
              ← Volver al repositorio
            </Link>

            <div className="img-ph img-forest" style={{ height: 320, marginBottom: 28 }} />

            {experience.tags && experience.tags.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
                {experience.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            ) : null}

            <p className="body" style={{ marginBottom: 32, maxWidth: 680 }}>
              {experience.body ?? experience.summary}
            </p>

            <div className="dataset-metadata-grid">
              <div className="info-card">
                <h3>Ubicación</h3>
                <p>{experience.location ?? "Por confirmar"}</p>
              </div>
              <div className="info-card">
                <h3>Fecha</h3>
                <p>{experience.date ?? "Por confirmar"}</p>
              </div>
              <div className="info-card">
                <h3>Etiquetas</h3>
                <p>{experience.tags && experience.tags.length > 0 ? experience.tags.join(", ") : "Sin etiquetas"}</p>
              </div>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  const [experiences, { projects }] = await Promise.all([
    getExperiences(),
    getProjects(1, 999),
  ]);

  return (
    <SiteShell currentPath="/repositorio-experiencias">
      <section className="phero">
        <div className="wrap">
          <h1 className="phero__h1">Experiencia no encontrada</h1>
        </div>
      </section>

      <section className="s s--white">
        <div className="wrap">
          <Link href="/repositorio-experiencias" className="dataset-back-link">
            ← Volver al repositorio
          </Link>

          <div className="dataset-not-found-card">
            <p className="body">
              No existe una experiencia o proyecto con ese identificador. Revisa el repositorio y
              elige una de las fichas disponibles.
            </p>
            <div className="ds-grid">
              {[...experiences, ...projects].map((item) => (
                <Link
                  key={item.id}
                  href={`/repositorio-experiencias/${item.id}`}
                  className="ds-card"
                >
                  <h3 className="ds-card__title">{item.title}</h3>
                  <p className="ds-card__desc">
                    {"summary" in item ? item.summary : item.description}
                  </p>
                  <span className="btn btn--teal btn--sm" style={{ alignSelf: "flex-start" }}>
                    Ver ficha
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
