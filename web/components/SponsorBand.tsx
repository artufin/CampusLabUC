import Image from "next/image";
import type { Sponsor } from "@/lib/types";

interface SponsorBandProps {
  sponsors: Sponsor[];
}

export function SponsorBand({ sponsors }: SponsorBandProps) {
  return (
    <section className="sponsor-band">
      <h2 className="section-title">Sponsors</h2>
      <div className="sponsor-grid">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className={`sponsor-item ${sponsor.logoUrl ? "has-logo" : ""}`}
          >
            {sponsor.logoUrl ? (
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={280}
                height={100}
                className="sponsor-logo"
              />
            ) : (
              <span>{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
