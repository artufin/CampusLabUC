import Image from "next/image";
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

function getMailHref(email?: string): string | undefined {
  if (!email) return undefined;
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}

export function PersonCard({ person }: { person: Person }) {
  const socials = [
    person.social.instagram && {
      href: person.social.instagram,
      label: "Instagram",
      icon: "/assets/icons/instagram.svg",
    },
    person.social.linkedin && {
      href: person.social.linkedin,
      label: "LinkedIn",
      icon: "/assets/icons/linkedin.svg",
    },
    getMailHref(person.social.email) && {
      href: getMailHref(person.social.email)!,
      label: "Email",
      icon: "/assets/icons/mail.svg",
    },
  ].filter(Boolean) as Array<{ href: string; label: string; icon: string }>;

  return (
    <div className="ac-card" tabIndex={0}>
      <div className="ac-card__top" style={{ background: getCardBg(person.name) }}>
        <div className="ac-card__ini">{getInitials(person.name)}</div>
      </div>
      <div className="ac-card__body">
        <div className="ac-card__name">{person.name}</div>
        <div className="ac-card__role">{person.role}</div>
        {socials.length > 0 ? (
          <div className="ac-card__socials" aria-label={`Contacto de ${person.name}`}>
            {socials.map((social) => (
              <a
                key={social.label}
                className="ac-card__social"
                href={social.href}
                target={social.label === "Email" ? undefined : "_blank"}
                rel={social.label === "Email" ? undefined : "noreferrer"}
                aria-label={`${social.label} de ${person.name}`}
                title={social.label}
              >
                <Image src={social.icon} alt="" aria-hidden="true" width={15} height={15} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
