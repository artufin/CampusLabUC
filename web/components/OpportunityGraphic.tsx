import Image from "next/image";

const GRAPHIC_SRC = "/assets/icons/desafios.svg";

const LABELS = [
  {
    id: "forest",
    title: "Investigacion Bosque",
    icon: "/assets/icons/forest.svg",
    className: "label-forest",
  },
  {
    id: "tree",
    title: "Tesis/Titulo Arbol",
    icon: "/assets/icons/tree.svg",
    className: "label-tree",
  },
  {
    id: "plant",
    title: "Practica Planta",
    icon: "/assets/icons/plant.svg",
    className: "label-plant",
  },
  {
    id: "germination",
    title: "Cursos Germinacion",
    icon: "/assets/icons/germination.svg",
    className: "label-germination",
  },
] as const;

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
