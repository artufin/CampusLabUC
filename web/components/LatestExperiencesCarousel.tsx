"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Experience } from "@/lib/types";

interface LatestExperiencesCarouselProps {
  items: Experience[];
}

export function LatestExperiencesCarousel({
  items,
}: LatestExperiencesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const node = trackRef.current;

    if (!node) {
      return;
    }

    const amount = Math.max(node.clientWidth * 0.75, 220);
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="latest-section">
      <h2 className="section-title">Ultimas experiencias</h2>
      <div className="latest-carousel">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => scrollByCards("left")}
          aria-label="Desplazar experiencias hacia la izquierda"
        >
          &#8249;
        </button>

        <div ref={trackRef} className="latest-track">
          {items.map((item) => (
            <article key={item.id} className="latest-card">
              <div className="latest-image-wrap">
                <Image
                  src={item.imageUrl ?? "/assets/photos/experiencia_img.png"}
                  alt={item.title}
                  fill
                  className="latest-image"
                  sizes="(max-width: 768px) 72vw, 320px"
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow"
          onClick={() => scrollByCards("right")}
          aria-label="Desplazar experiencias hacia la derecha"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}
