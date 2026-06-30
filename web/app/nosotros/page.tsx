import { EmptyState } from "@/components/EmptyState";
import { MemberChip } from "@/components/MemberChip";
import { PersonCard } from "@/components/PersonCard";
import { SiteShell } from "@/components/SiteShell";
import { getAssociatedMembers, getPeopleByGroup } from "@/lib/labvivo-data";

export default async function NosotrosPage() {
  const [executivePeople, associatedMembers] = await Promise.all([
    getPeopleByGroup("executive"),
    getAssociatedMembers(),
  ]);

  return (
    <SiteShell currentPath="/nosotros">
      <section className="phero">
        <div className="wrap">
          <h1 className="phero__h1">Nosotros</h1>
          <p className="phero__desc">
            Somos una red interdisciplinaria que impulsa experiencias de aprendizaje y colaboración
            desde los campus UC. Conectamos academia, estudiantes, comunidades y actores externos
            para diseñar soluciones sostenibles con evidencia y acción concreta.
          </p>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="s s--white">
        <div className="wrap">
          <div className="g2">
            <div>
              <p className="overline" style={{ color: "var(--or)", marginBottom: 14 }}>
                Nuestra misión
              </p>
              <h2 className="sh sh--tD" style={{ marginBottom: 24 }}>¿Quiénes somos?</h2>
              <p className="body">
                CampusLab UC es una iniciativa que transforma el campus universitario en un espacio
                de experimentación real. Integramos docencia, investigación y extensión para que los
                desafíos del entorno universitario se conviertan en oportunidades concretas de
                aprendizaje e innovación sostenible.
              </p>
            </div>
            <div className="img-ph img-green" style={{ height: 280 }}>
              <span>Equipo Campus Lab</span>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo ejecutivo */}
      <section className="s s--cream">
        <div className="wrap">
          <h2 className="sh sh--tD" style={{ marginBottom: 12 }}>Equipo Ejecutivo</h2>
          <p className="body" style={{ marginBottom: 48, maxWidth: 600 }}>
            Las personas que lideran y desarrollan la plataforma y sus proyectos.
          </p>
          {executivePeople.length > 0 ? (
            <div className="g3">
              {executivePeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay equipo ejecutivo disponible"
              description="Los perfiles se cargarán de forma automática cuando el endpoint de personas quede habilitado."
            />
          )}
        </div>
      </section>

      {/* Miembros asociados */}
      <section className="s s--white s--pb100">
        <div className="wrap">
          <h2 className="sh sh--tD" style={{ marginBottom: 12 }}>Miembros eméritos</h2>
          <p className="body" style={{ marginBottom: 36, maxWidth: 560 }}>
            Comunidad amplia de estudiantes, profesores y colaboradores que participan en los
            proyectos del Campus Lab.
          </p>
          {associatedMembers.length > 0 ? (
            <div className="members">
              {associatedMembers.map((name) => (
                <MemberChip key={name} name={name} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay miembros asociados"
              description="Esta sección se llenará dinámicamente usando los datos de la API de personas."
            />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
