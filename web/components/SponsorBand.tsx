import Image from "next/image";
import type { Sponsor } from "@/lib/types";

interface SponsorBandProps {
  sponsors: Sponsor[];
}

export function SponsorBand({ sponsors }: SponsorBandProps) {
  return (
    <section className="s s--pa s--slim">
      <div className="wrap">
        <p className="overline" style={{ color: "var(--tm)", marginBottom: 28 }}>
          Instituciones colaboradoras
        </p>
        <div className="sponsors">
          {sponsors.map((sponsor) =>
            sponsor.logoUrl ? (
              <Image
                key={sponsor.id}
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={160}
                height={60}
                className="sponsor-logo"
              />
            ) : (
              <span key={sponsor.id} className="sponsor-n">
                {sponsor.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
