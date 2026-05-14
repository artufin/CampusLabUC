import Image from "next/image";

const GRAPHIC_SRC = "/assets/icons/desafios.svg";

export function OpportunityGraphic({ compact }: { compact?: boolean }) {
  return (
    <div className={`opportunity-graphic${compact ? " compact" : ""}`}>
      <Image
        src={GRAPHIC_SRC}
        alt=""
        width={459}
        height={583}
        className="opportunity-layer layer-outer"
        aria-hidden="true"
      />
    </div>
  );
}
