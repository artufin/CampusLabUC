const CIRCLES = [
  { id: "data", label: "Datos Aliados", color: "#483C24" },
  { id: "opportunities", label: "Oportunidades", color: "#60702F" },
  { id: "network", label: "Investigacion", color: "#483C24" },
  { id: "community", label: "Comunidad", color: "#60702F" },
] as const;

export function CircleHighlights() {
  return (
    <section className="circle-highlights" aria-label="Enfoques principales">
      {CIRCLES.map((item) => (
        <article
          key={item.id}
          className="highlight-circle"
          style={{ backgroundColor: item.color }}
        >
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}
