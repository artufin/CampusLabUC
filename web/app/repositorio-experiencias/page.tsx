import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteShell } from "@/components/SiteShell";
import { getProjects } from "@/lib/labvivo-data";

type SearchParamValue = string | string[] | undefined;

interface RepositorioPageProps {
  searchParams?:
    | Promise<Record<string, SearchParamValue>>
    | Record<string, SearchParamValue>;
}

function readSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parsePage(value: string) {
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildHref(
  page: number,
  filters: { challengeType: string; engagementLevel: string; search: string },
) {
  const params = new URLSearchParams();
  if (filters.challengeType) params.set("challengeType", filters.challengeType);
  if (filters.engagementLevel) params.set("engagementLevel", filters.engagementLevel);
  if (filters.search) params.set("q", filters.search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? "/repositorio-experiencias?" + query : "/repositorio-experiencias";
}

export default async function RepositorioExperienciasPage({
  searchParams,
}: RepositorioPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const allProjectsData = await getProjects(1, 999);
  const allProjects = allProjectsData.projects;

  const filters = {
    challengeType: readSearchParam(resolvedSearchParams.challengeType),
    engagementLevel: readSearchParam(resolvedSearchParams.engagementLevel),
    search: readSearchParam(resolvedSearchParams.q).trim(),
  };

  const challengeTypeOptions = Array.from(
    new Set(allProjects.map((p) => p.challengeType).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const engagementLevelOptions = Array.from(
    new Set(allProjects.map((p) => p.engagementLevel).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const filtered = allProjects.filter((p) => {
    const text = [p.title, p.description, p.contactName, ...(p.tags ?? [])]
      .join(" ")
      .toLowerCase();
    return (
      (!filters.challengeType || p.challengeType === filters.challengeType) &&
      (!filters.engagementLevel || p.engagementLevel === filters.engagementLevel) &&
      (!filters.search || text.includes(filters.search.toLowerCase()))
    );
  });

  const pageSize = 5;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(parsePage(readSearchParam(resolvedSearchParams.page)), totalPages);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = Boolean(filters.challengeType || filters.engagementLevel || filters.search);

  return (
    <SiteShell currentPath="/repositorio-experiencias">
      <section className="phero">
        <div className="wrap">
          <h1 className="phero__h1">Repositorio de experiencias</h1>
          <p className="phero__desc">
            Cada proyecto se presenta como una ficha con información de contacto, etiquetas
            temáticas, tipo de desafío y nivel de involucramiento disponible.
          </p>
        </div>
      </section>

      <section className="s s--cream">
        <div className="wrap">
          <form className="filters" method="get" action="/repositorio-experiencias">
            <input type="hidden" name="page" value="1" />
            <div className="fg">
              <label htmlFor="repo-search">Buscador de texto</label>
              <input
                id="repo-search"
                type="search"
                name="q"
                placeholder="Buscar por título o descripción…"
                defaultValue={filters.search}
              />
            </div>
            <div className="fg">
              <label htmlFor="repo-challenge">Tipo de desafío</label>
              <select id="repo-challenge" name="challengeType" defaultValue={filters.challengeType}>
                <option value="">Todos</option>
                {challengeTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label htmlFor="repo-engagement">Nivel de involucramiento</label>
              <select
                id="repo-engagement"
                name="engagementLevel"
                defaultValue={filters.engagementLevel}
              >
                <option value="">Todos</option>
                {engagementLevelOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button className="btn btn--teal" type="submit">Aplicar filtros</button>
            {hasFilters && (
              <Link href="/repositorio-experiencias" className="btn btn--outline">
                Limpiar
              </Link>
            )}
          </form>

          {paginated.length > 0 ? (
            paginated.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <EmptyState
              title="No hay proyectos para esos filtros"
              description="Ajusta el tipo de desafío, el nivel de involucramiento o el texto de búsqueda para ver otros resultados."
            />
          )}

          <div className="pag">
            <span className="pag__info">
              Página {page} de {totalPages}
              {total > 0 ? ` · ${total} resultados` : ""}
            </span>
            <div className="pag__pages">
              <Link
                href={buildHref(page - 1, filters)}
                className={`pg pg--text${page <= 1 ? " disabled" : ""}`}
                aria-disabled={page <= 1}
              >
                Anterior
              </Link>
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={buildHref(p, filters)}
                    className={`pg${p === page ? " active" : ""}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </Link>
                );
              })}
              <Link
                href={buildHref(page + 1, filters)}
                className={`pg pg--text${page >= totalPages ? " disabled" : ""}`}
                aria-disabled={page >= totalPages}
              >
                Siguiente
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
