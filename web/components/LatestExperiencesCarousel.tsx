"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Experience } from "@/lib/types";

interface LatestExperiencesCarouselProps {
  items: Experience[];
}

export function LatestExperiencesCarousel({ items }: LatestExperiencesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".exp-card");
    const step = (card?.offsetWidth ?? 260) + 20;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

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
        <div className="carousel">
          <button
            type="button"
            className="carousel__btn carousel__btn--prev"
            aria-label="Experiencia anterior"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>
          <div className="carousel__track" ref={trackRef}>
            {items.map((item) => (
              <Link key={item.id} href={`/repositorio-experiencias/${item.id}`} className="exp-card">
                <div className="exp-card__img">
                </div>
                <div className="exp-card__body">
                  <div className="exp-card__title">{item.title}</div>
                  <div className="exp-card__desc">{item.summary}</div>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="carousel__btn carousel__btn--next"
            aria-label="Siguiente experiencia"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
