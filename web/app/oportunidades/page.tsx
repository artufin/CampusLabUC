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
    new Map(opportunities.map((item) => [item.categoryId, item.categoryName])),
    ([value, label]) => ({ value, label }),
  ).sort((a, b) => a.label.localeCompare(b.label));

  const labelOptions = Array.from(
    new Set(opportunities.map((item) => item.label)),
  ).sort((a, b) => a.localeCompare(b));

  const filtered = opportunities.filter((item) => {
    const text = [item.title, item.description, item.categoryName, item.label, item.supervisor]
      .join(" ")
      .toLowerCase();
    return (
      (!filters.category || item.categoryId === filters.category) &&
      (!filters.label    || item.label === filters.label) &&
      (!filters.search   || text.includes(filters.search.toLowerCase()))
    );
  });

  const pageSize = 3;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(parsePage(readSearchParam(resolvedSearchParams.page)), totalPages);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <SiteShell currentPath="/oportunidades">
      <section className="phero">
        <div className="wrap">
          <h1 className="phero__h1">Oportunidades</h1>
          <p className="phero__desc">
            Usa el buscador para localizar una oportunidad y combina los filtros por categoría y
            nivel de involucramiento. Cada desafío tiene un encargado académico y un portal de
            postulación.
          </p>
        </div>
      </section>

      <OpportunityList
        opportunities={paginated}
        categoryOptions={categoryOptions}
        labelOptions={labelOptions}
        filters={filters}
        pagination={{ page, total, totalPages, pageSize }}
      />
    </SiteShell>
  );
}
