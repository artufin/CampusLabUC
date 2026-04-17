import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteShell } from "@/components/SiteShell";
import { getProjects } from "@/lib/labvivo-data";

interface RepositorioPageProps {
  searchParams?: {
    page?: string;
  };
}

function parsePage(value: string | undefined): number {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export default async function RepositorioExperienciasPage({
  searchParams,
}: RepositorioPageProps) {
  const currentPage = parsePage(searchParams?.page);
  const pagination = await getProjects(currentPage, 5);

  const prevPageHref = `/repositorio-experiencias?page=${Math.max(1, pagination.page - 1)}`;
  const nextPageHref = `/repositorio-experiencias?page=${Math.min(
    pagination.totalPages,
    pagination.page + 1,
  )}`;

  return (
    <SiteShell currentPath="/repositorio-experiencias">
      <div className="page-stack">
        <h1 className="page-title">Repositorio de experiencias</h1>
        <p className="page-intro">
          Cada proyecto se presenta como ficha de experiencia y se carga de
          forma dinamica para facilitar la futura integracion con API. La
          paginacion usa parametros de URL para mostrar cinco iniciativas por
          pagina.
        </p>

        {pagination.projects.length > 0 ? (
          <section className="project-list">
            {pagination.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        ) : (
          <EmptyState
            title="No hay proyectos disponibles"
            description="Cuando la API de proyectos este activa, aqui se mostrara el listado paginado de experiencias."
          />
        )}

        <div className="pagination-row" aria-label="Navegacion de paginas">
          <Link
            href={prevPageHref}
            className={`pagination-link ${pagination.page <= 1 ? "disabled" : ""}`}
            aria-disabled={pagination.page <= 1}
          >
            Anterior
          </Link>

          <p>
            Pagina {pagination.page} de {pagination.totalPages}
          </p>

          <Link
            href={nextPageHref}
            className={`pagination-link ${
              pagination.page >= pagination.totalPages ? "disabled" : ""
            }`}
            aria-disabled={pagination.page >= pagination.totalPages}
          >
            Siguiente
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
