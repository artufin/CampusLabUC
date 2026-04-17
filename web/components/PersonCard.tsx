import Image from "next/image";
import type { Person } from "@/lib/types";

interface PersonCardProps {
  person: Person;
}

const SOCIAL_ICONS = {
  email: "/assets/icons/mail.svg",
  instagram: "/assets/icons/instagram.svg",
  linkedin: "/assets/icons/linkedin.svg",
} as const;

export function PersonCard({ person }: PersonCardProps) {
  const hasPhoto = Boolean(person.photoUrl);

  return (
    <article className="person-card group">
      <div className="person-photo-wrap">
        {hasPhoto ? (
          <Image
            src={person.photoUrl as string}
            alt={`Foto de ${person.name}`}
            fill
            className="person-photo"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="person-photo-placeholder" aria-hidden="true">
            <span>{person.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="person-body">
        <h3 className="person-name">{person.name}</h3>
        <p className="person-role">{person.role}</p>
        <p className="person-bio">{person.bio}</p>
      </div>

      <div className="person-socials" aria-label="Redes de contacto">
        {person.social.email ? (
          <a
            href={`mailto:${person.social.email}`}
            className="person-social-link"
            aria-label="Correo"
          >
            <Image
              src={SOCIAL_ICONS.email}
              alt="Correo"
              width={18}
              height={14}
            />
          </a>
        ) : null}

        {person.social.instagram ? (
          <a
            href={person.social.instagram}
            className="person-social-link"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={SOCIAL_ICONS.instagram}
              alt="Instagram"
              width={17}
              height={17}
            />
          </a>
        ) : null}

        {person.social.linkedin ? (
          <a
            href={person.social.linkedin}
            className="person-social-link"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={SOCIAL_ICONS.linkedin}
              alt="LinkedIn"
              width={17}
              height={17}
            />
          </a>
        ) : null}
      </div>
    </article>
  );
}
