import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getOpenDataDatasets } from "@/lib/labvivo-data";

const KIND_LABELS: Record<string, string> = {
  electric: "Eléctrico",
  seismic: "Sísmico",
  hydraulic: "Hidráulico",
  environmental: "Ambiental",
  mobility: "Movilidad",
  academic: "Académico",
};

type SearchParamValue = string | string[] | undefined;

interface DatosAbiertosPageProps {
  searchParams?:
    | Promise<Record<string, SearchParamValue>>
    | Record<string, SearchParamValue>;
}

function readSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function DatosAbiertosPage({
  searchParams,
}: DatosAbiertosPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const datasets = await getOpenDataDatasets();

  const filters = {
    kind: readSearchParam(resolvedSearchParams.kind),
    search: readSearchParam(resolvedSearchParams.q).trim(),
  };

  const kindOptions = Array.from(
    new Set(datasets.map((d) => d.source.kind).filter(Boolean)),
  ).sort((a, b) => (KIND_LABELS[a] ?? a).localeCompare(KIND_LABELS[b] ?? b, "es"));

  const filtered = datasets.filter((d) => {
    const text = [d.title, d.summary, d.source.label, ...(d.tags ?? [])]
      .join(" ")
      .toLowerCase();
    return (
      (!filters.kind || d.source.kind === filters.kind) &&
      (!filters.search || text.includes(filters.search.toLowerCase()))
    );
  });

  const hasFilters = Boolean(filters.kind || filters.search);

  return (
    <SiteShell currentPath="/datos-abiertos">
      <section className="phero">
        <div className="wrap">
          <h1 className="phero__h1">Datos abiertos</h1>
          <p className="phero__desc">
            Cada dataset apunta a una ficha de detalle preparada para albergar trazabilidad,
            descargas y visualizaciones específicas. Los datos son recolectados en el campus UC y
            están disponibles de forma abierta para investigación y docencia.
          </p>
        </div>
      </section>

      <section className="s s--cream">
        <div className="wrap">
          <form className="filters" method="get" action="/datos-abiertos">
            <div className="fg">
              <label htmlFor="ds-search">Buscador de texto</label>
              <input
                id="ds-search"
                type="search"
                name="q"
                placeholder="Buscar por título o descripción…"
                defaultValue={filters.search}
              />
            </div>
            <div className="fg">
              <label htmlFor="ds-kind">Tipo de fuente</label>
              <select id="ds-kind" name="kind" defaultValue={filters.kind}>
                <option value="">Todos</option>
                {kindOptions.map((k) => (
                  <option key={k} value={k}>{KIND_LABELS[k] ?? k}</option>
                ))}
              </select>
            </div>
            <button className="btn btn--teal" type="submit">Aplicar filtros</button>
            {hasFilters && (
              <Link href="/datos-abiertos" className="btn btn--outline">Limpiar</Link>
            )}
          </form>

          {filtered.length > 0 ? (
            <div className="ds-grid">
              {filtered.map((dataset) => (
                <div key={dataset.id} className="ds-card">
                  <h3 className="ds-card__title">{dataset.title}</h3>
                  <p className="ds-card__desc">{dataset.summary}</p>
                  <div className="ds-card__sensor">
                    {dataset.source.label} · {dataset.source.unit}
                    {dataset.source.kind && (
                      <span className="tag tag--gray" style={{ marginLeft: 8 }}>
                        {KIND_LABELS[dataset.source.kind] ?? dataset.source.kind}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/datos-abiertos/${dataset.id}`}
                    className="btn btn--teal btn--sm"
                    style={{ alignSelf: "flex-start" }}
                  >
                    Ver dataset
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No hay datasets para esos filtros</h3>
              <p>Ajusta el tipo de fuente o el texto de búsqueda para ver otros resultados.</p>
            </div>
          )}
        </div>
      </section>

      <section className="s s--white s--pb100">
        <div className="wrap">
          <p className="overline" style={{ color: "var(--or)", marginBottom: 12 }}>
            Visualización geoespacial
          </p>
          <h2 className="sh sh--tD" style={{ marginBottom: 16 }}>Mapa interactivo</h2>
          <p className="body" style={{ marginBottom: 40, maxWidth: 640 }}>
            Integración pendiente para visualización interactiva de capas y ubicaciones de sensores
            en el campus.
          </p>
          <div className="map-ph">
            <div className="map-ph__inner">
              <div className="map-ph__title">Próximamente</div>
              <div className="map-ph__sub">Vista interactiva del campus y datasets geolocalizados</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
