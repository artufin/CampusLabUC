import type { ChallengeCategory } from "@/lib/types";

interface ChallengeCircleMapProps {
  categories: ChallengeCategory[];
  title?: string;
  subtitle?: string;
}

export function ChallengeCircleMap({
  categories,
  title = "Categorias",
  subtitle,
}: ChallengeCircleMapProps) {
  return (
    <section className="challenge-map">
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}

      <div className="challenge-map-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="challenge-circle"
            style={{ backgroundColor: category.color }}
          >
            <span className="challenge-circle-name">{category.name}</span>
            <span className="challenge-circle-description">
              {category.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
