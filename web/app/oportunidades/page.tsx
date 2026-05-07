import { OpportunityGraphic } from "@/components/OpportunityGraphic";
import { OpportunityList } from "@/components/OpportunityList";
import { SiteShell } from "@/components/SiteShell";
import { getOpportunities } from "@/lib/labvivo-data";

type SearchParamValue = string | string[] | undefined;

interface OportunidadesPageProps {
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

export default async function OportunidadesPage({
  searchParams,
}: OportunidadesPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const opportunities = await getOpportunities();

  const filters = {
    category: readSearchParam(resolvedSearchParams.category),
    label: readSearchParam(resolvedSearchParams.label),
    search: readSearchParam(resolvedSearchParams.q).trim(),
  };

  const categoryOptions = Array.from(
    new Map(
      opportunities.map((item) => [item.categoryId, item.categoryName]),
    ),
    ([value, label]) => ({ value, label }),
  ).sort((left, right) => left.label.localeCompare(right.label));

  const labelOptions = Array.from(
    new Set(opportunities.map((item) => item.label)),
  ).sort((left, right) => left.localeCompare(right));

  const filteredOpportunities = opportunities.filter((item) => {
    const searchableText = [
      item.title,
      item.description,
      item.categoryName,
      item.label,
      item.supervisor,
      item.typeLabel,
    ]
      .join(" ")
      .toLowerCase();

    const normalizedSearch = filters.search.toLowerCase();

    return (
      (!filters.category || item.categoryId === filters.category) &&
      (!filters.label || item.label === filters.label) &&
      (!normalizedSearch || searchableText.includes(normalizedSearch))
    );
  });

  const pageSize = 3;
  const total = filteredOpportunities.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(
    parsePage(readSearchParam(resolvedSearchParams.page)),
    totalPages,
  );
  const startIndex = (page - 1) * pageSize;
  const paginatedOpportunities = filteredOpportunities.slice(
    startIndex,
    startIndex + pageSize,
  );

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

        <OpportunityList
          opportunities={paginatedOpportunities}
          categoryOptions={categoryOptions}
          labelOptions={labelOptions}
          filters={filters}
          pagination={{
            page,
            total,
            totalPages,
            pageSize,
          }}
          subtitle="Usa el buscador para localizar una oportunidad y combina los filtros por categoria y label."
        />
      </div>
    </SiteShell>
  );
}
