import Link from "next/link";
import type { ReactNode } from "react";
import type { Opportunity } from "@/lib/types";

interface OpportunityOption {
  label: string;
  value: string;
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  categoryOptions: OpportunityOption[];
  labelOptions: string[];
  filters: {
    category: string;
    label: string;
    search: string;
  };
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    pageSize: number;
  };
  subtitle?: string;
  title?: string;
  graphic?: ReactNode;
}

function buildHref(page: number, filters: OpportunityListProps["filters"]) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.label)    params.set("label", filters.label);
  if (filters.search)   params.set("q", filters.search);
  if (page > 1)         params.set("page", String(page));
  const query = params.toString();
  return query ? "/oportunidades?" + query : "/oportunidades";
}

function OppIcon({ categoryName }: { categoryName: string }) {
  if (categoryName.toLowerCase().includes("agua")) {
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <path d="M26 10 C26 10 14 24 14 32 C14 39.7 19.4 46 26 46 C32.6 46 38 39.7 38 32 C38 24 26 10 26 10Z" fill="#c5e1e5" stroke="#026e6e" strokeWidth="1.8"/>
        <path d="M20 34 Q26 30 32 34" stroke="#026e6e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (categoryName.toLowerCase().includes("transporte") || categoryName.toLowerCase().includes("movilidad")) {
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <rect x="14" y="28" width="8" height="12" rx="2" fill="#4a9a6a"/>
        <rect x="10" y="20" width="16" height="12" rx="2" fill="#2d6b4a"/>
        <circle cx="18" cy="44" r="3" fill="#1a4a2e"/>
        <path d="M30 40 Q34 30 34 20 Q34 12 40 12" stroke="#2d6b4a" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="40" cy="10" r="3" fill="#4a9a6a"/>
      </svg>
    );
  }
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M26 44V20M26 20C26 20 18 14 10 16M26 20C26 20 34 14 42 16M26 20C26 20 20 26 20 32M26 20C26 20 32 26 32 32" stroke="#2d6b4a" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="26" cy="46" r="2" fill="#2d6b4a"/>
    </svg>
  );
}

export function OpportunityList({
  opportunities,
  categoryOptions,
  labelOptions,
  filters,
  pagination,
  subtitle,
  title = "Oportunidades disponibles",
  graphic,
}: OpportunityListProps) {
  const hasFilters = Boolean(filters.category || filters.label || filters.search);

  return (
    <section>
      {/* Filters + graphic */}
      <section className="s s--white" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: graphic ? "1fr auto" : "1fr", gap: 48, alignItems: "start" }}>
            <div>
              <p className="overline" style={{ color: "var(--or)", marginBottom: 12 }}>
                {title}
              </p>
              <h2 className="sh sh--tD" style={{ marginBottom: 8 }}>Buscar y filtrar</h2>
              {subtitle && (
                <p className="body" style={{ marginBottom: 24, maxWidth: 500 }}>
                  Mostrando {opportunities.length} de {pagination.total} resultado{pagination.total !== 1 ? "s" : ""}{hasFilters ? " filtrados" : ""}.
                </p>
              )}
              <form className="filters" method="get" action="/oportunidades">
                <input type="hidden" name="page" value="1" />
                <div className="fg">
                  <label htmlFor="opp-search">Buscador de texto</label>
                  <input
                    id="opp-search"
                    type="search"
                    name="q"
                    placeholder="Buscar por título…"
                    defaultValue={filters.search}
                  />
                </div>
                <div className="fg">
                  <label htmlFor="opp-category">Categoría</label>
                  <select id="opp-category" name="category" defaultValue={filters.category}>
                    <option value="">Todas</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label htmlFor="opp-label">Nivel</label>
                  <select id="opp-label" name="label" defaultValue={filters.label}>
                    <option value="">Todos</option>
                    {labelOptions.map((lbl) => (
                      <option key={lbl} value={lbl}>{lbl}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn--teal" type="submit">Aplicar filtros</button>
                {hasFilters && (
                  <Link href="/oportunidades" className="btn btn--outline">Limpiar</Link>
                )}
              </form>
            </div>
            {graphic}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="s s--cream" style={{ paddingTop: 32 }}>
        <div className="wrap">
          {opportunities.length > 0 ? (
            opportunities.map((item) => (
              <div key={item.id} className="opp-card">
                <div style={{ flex: 1 }}>
                  <span className="opp-card__cat">{item.categoryName}</span>
                  <h3 className="opp-card__title">{item.title}</h3>
                  <p className="opp-card__desc">{item.description}</p>
                  <div className="opp-card__tags">
                    <span className="tag">{item.label}</span>
                    <span className="tag tag--gray">{item.supervisor}</span>
                  </div>
                  <a
                    href="https://gestionipre.investigacion.ing.uc.cl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opp-card__link"
                  >
                    Ir a portal para postular →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No hay oportunidades para esos filtros</h3>
              <p>Ajusta la categoría, el nivel o el texto de búsqueda para ver otros resultados.</p>
            </div>
          )}

          <div className="pag">
            <span className="pag__info">
              Página {pagination.page} de {pagination.totalPages}
              {pagination.total > 0 ? ` · ${pagination.total} resultados` : ""}
            </span>
            <div className="pag__pages">
              <Link
                href={buildHref(pagination.page - 1, filters)}
                className={`pg pg--text${pagination.page <= 1 ? " disabled" : ""}`}
                aria-disabled={pagination.page <= 1}
              >
                Anterior
              </Link>
              {Array.from({ length: pagination.totalPages }, (_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={buildHref(p, filters)}
                    className={`pg${p === pagination.page ? " active" : ""}`}
                    aria-current={p === pagination.page ? "page" : undefined}
                  >
                    {p}
                  </Link>
                );
              })}
              <Link
                href={buildHref(pagination.page + 1, filters)}
                className={`pg pg--text${pagination.page >= pagination.totalPages ? " disabled" : ""}`}
                aria-disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
