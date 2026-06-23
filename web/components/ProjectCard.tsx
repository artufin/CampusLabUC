import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/repositorio-experiencias/${project.id}`} className="repo-entry">
      <div className="repo-entry__img">
        <div className="repo-img-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="repo-entry__info">
        <h2 className="repo-entry__title">{project.title}</h2>
        <div className="repo-entry__lbl">¿Qué?</div>
        <div className="repo-entry__val">{project.description}</div>
        <div className="repo-entry__lbl">Contacto</div>
        <div className="repo-entry__val" style={{ marginBottom: 6 }}>{project.contactName}</div>
        <span className="repo-entry__email">{project.contactEmail}</span>
        <div className="repo-meta">
          <div>
            <div className="repo-entry__lbl">Etiquetas</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="repo-entry__lbl">Tipo de desafío</div>
            <div className="repo-entry__val" style={{ marginBottom: 0, marginTop: 6 }}>
              {project.challengeType}
            </div>
          </div>
          <div>
            <div className="repo-entry__lbl">Nivel de involucramiento</div>
            <div className="repo-entry__val" style={{ marginBottom: 0, marginTop: 6 }}>
              {project.engagementLevel}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
