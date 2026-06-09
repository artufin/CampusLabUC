import Image from "next/image";
import Link from "next/link";
import type { Experience } from "@/lib/types";

interface LatestExperiencesCarouselProps {
  items: Experience[];
}

export function LatestExperiencesCarousel({ items }: LatestExperiencesCarouselProps) {
  return (
    <section className="s s--cream s--pb100">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
          <h2 className="sh">Últimas experiencias</h2>
          <Link
            href="/repositorio-experiencias"
            style={{ color: "var(--or)", fontSize: 14, fontWeight: 700 }}
          >
            Ver repositorio →
          </Link>
        </div>
        <div className="g4">
          {items.map((item) => (
            <div key={item.id} className="exp-card">
              <div className="exp-card__img">
              </div>
              <div className="exp-card__body">
                <div className="exp-card__title">{item.title}</div>
                <div className="exp-card__desc">{item.summary}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
