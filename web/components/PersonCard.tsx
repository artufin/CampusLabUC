import type { Person } from "@/lib/types";

const BG_COLORS = [
  "#2d5a6b", "#3d6b5a", "#4a6b4a", "#5a4a6b", "#6b5a3d",
  "#2d6b5e", "#3d5a6b", "#4a6b3d", "#6b4a3d", "#3d4a6b",
];

function getCardBg(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return BG_COLORS[hash % BG_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="ac-card">
      <div className="ac-card__top" style={{ background: getCardBg(person.name) }}>
        <div className="ac-card__ini">{getInitials(person.name)}</div>
      </div>
      <div className="ac-card__body">
        <div className="ac-card__name">{person.name}</div>
        <div className="ac-card__role">{person.role}</div>
      </div>
    </div>
  );
}
