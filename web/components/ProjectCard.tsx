import Image from "next/image";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-image-wrap">
        <Image
          src={project.imageUrl ?? "/assets/photos/chom_anais_weil.png"}
          alt={project.title}
          fill
          className="project-image"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="project-panel">
        <h3 className="project-title">{project.title}</h3>
        <div className="project-meta-block">
          <p className="project-meta-label">Que?</p>
          <p>{project.description}</p>
        </div>

        <div className="project-meta-block">
          <p className="project-meta-label">Contacto</p>
          <p>{project.contactName}</p>
          <a
            href={`mailto:${project.contactEmail}`}
            className="project-contact-link"
          >
            {project.contactEmail}
          </a>
        </div>

        <div className="project-meta-row">
          <div>
            <p className="project-meta-label">Etiquetas</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="project-meta-label">Tipo de desafio</p>
            <p>{project.challengeType}</p>
          </div>

          <div>
            <p className="project-meta-label">Nivel de involucramiento</p>
            <p>{project.engagementLevel}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
