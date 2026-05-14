import Image from "next/image";
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

const OPPORTUNITY_ICON_SRC: Record<Opportunity["icon"], string> = {
  forest: "/assets/icons/forest.svg",
  tree: "/assets/icons/tree.svg",
  plant: "/assets/icons/plant.svg",
  germination: "/assets/icons/germination.svg",
};

function buildOpportunityHref(
  page: number,
  filters: OpportunityListProps["filters"],
) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.label) {
    params.set("label", filters.label);
  }

  if (filters.search) {
    params.set("q", filters.search);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? "/oportunidades?" + query : "/oportunidades";
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

  const toolbar = (
    <div className="opportunity-toolbar">
      <div className="opportunity-toolbar-top">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>

        <p className="opportunity-summary">
          Mostrando {opportunities.length} de {pagination.total} resultados
          {hasFilters ? " filtrados" : ""}.
        </p>
      </div>

      <form className="opportunity-filters" method="get" action="/oportunidades">
        <input type="hidden" name="page" value="1" />

        <label className="opportunity-field opportunity-field-search">
          <span>Buscador de texto</span>
          <input
            className="opportunity-input"
            name="q"
            type="search"
            placeholder="Buscar por titulo, descripcion o tutor"
            defaultValue={filters.search}
          />
        </label>

        <label className="opportunity-field">
          <span>Categoria</span>
          <select
            className="opportunity-select"
            name="category"
            defaultValue={filters.category}
          >
            <option value="">Todas</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="opportunity-field">
          <span>Label</span>
          <select
            className="opportunity-select"
            name="label"
            defaultValue={filters.label}
          >
            <option value="">Todos</option>
            {labelOptions.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="opportunity-search-actions">
          <button className="opportunity-button" type="submit">
            Aplicar filtros
          </button>

          {hasFilters ? (
            <Link className="opportunity-reset" href="/oportunidades">
              Limpiar
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );

  return (
    <section className="opportunity-list">
      {graphic ? (
        <div className="opportunity-intro">
          {toolbar}
          {graphic}
        </div>
      ) : (
        toolbar
      )}

      <div className="opportunity-results">
        {opportunities.length > 0 ? (
          opportunities.map((item) => (
            <article key={item.id} className="opportunity-result-card">
              <div className="opportunity-result-body">
                <span className="opportunity-result-kicker">
                  {item.categoryName}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="opportunity-result-meta">
                  <span className="opportunity-chip">{item.label}</span>
                  <span className="opportunity-chip">{item.typeLabel}</span>
                  <span className="opportunity-chip">{item.supervisor}</span>
                </div>

                <a
                  href="https://gestionipre.investigacion.ing.uc.cl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opportunity-portal-link"
                >
                  Ir a portal para postular →
                </a>
              </div>

              <div className="opportunity-result-side">
                <Image
                  src={OPPORTUNITY_ICON_SRC[item.icon]}
                  alt=""
                  width={46}
                  height={46}
                  aria-hidden="true"
                />
                <p>{item.categoryName}</p>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No hay oportunidades para esos filtros</h3>
            <p>
              Ajusta la categoria, el label o el texto de busqueda para ver
              otros resultados.
            </p>
          </div>
        )}
      </div>

      <div className="opportunity-pagination">
        <p className="opportunity-pagination-info">
          Pagina {pagination.page} de {pagination.totalPages}
          {pagination.total > 0 ? ` · ${pagination.total} resultados` : ""}
        </p>

        <div className="opportunity-pagination-links">
          <Link
            className={
              "opportunity-pagination-link " +
              (pagination.page <= 1 ? "disabled" : "")
            }
            href={buildOpportunityHref(pagination.page - 1, filters)}
            aria-disabled={pagination.page <= 1}
            tabIndex={pagination.page <= 1 ? -1 : 0}
          >
            Anterior
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <Link
                key={page}
                className={
                  "opportunity-pagination-link " +
                  (page === pagination.page ? "is-current" : "")
                }
                href={buildOpportunityHref(page, filters)}
                aria-current={page === pagination.page ? "page" : undefined}
              >
                {page}
              </Link>
            );
          })}

          <Link
            className={
              "opportunity-pagination-link " +
              (pagination.page >= pagination.totalPages ? "disabled" : "")
            }
            href={buildOpportunityHref(pagination.page + 1, filters)}
            aria-disabled={pagination.page >= pagination.totalPages}
            tabIndex={pagination.page >= pagination.totalPages ? -1 : 0}
          >
            Siguiente
          </Link>
        </div>
      </div>
    </section>
  );
}
