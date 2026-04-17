import Image from "next/image";

const GRAPHIC_SRC = "/assets/icons/desafios.svg";

export function OpportunityGraphic() {
  return (
    <div className="opportunity-graphic">
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
