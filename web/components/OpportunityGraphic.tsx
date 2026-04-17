import Image from "next/image";

const LAYERS = [
  { src: "/assets/opportunity-shape/outer.svg", className: "layer-outer" },
  { src: "/assets/opportunity-shape/layer-3.svg", className: "layer-3" },
  { src: "/assets/opportunity-shape/layer-2.svg", className: "layer-2" },
  { src: "/assets/opportunity-shape/layer-1.svg", className: "layer-1" },
  { src: "/assets/opportunity-shape/center.svg", className: "layer-center" },
] as const;

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
      {LAYERS.map((layer) => (
        <Image
          key={layer.src}
          src={layer.src}
          alt=""
          width={430}
          height={560}
          className={`opportunity-layer ${layer.className}`}
          aria-hidden="true"
        />
      ))}

      {LABELS.map((label) => (
        <div key={label.id} className={`opportunity-label ${label.className}`}>
          <Image
            src={label.icon}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          <span>{label.title}</span>
        </div>
      ))}
    </div>
  );
}
