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
      <div className="page-stack">
        <h1 className="page-title">Nosotros</h1>

        <section>
          <h2 className="section-title">Quienes somos</h2>
          <p className="page-intro">
            Somos una red interdisciplinaria que impulsa experiencias de
            aprendizaje y colaboracion desde los campus UC. Conectamos academia,
            estudiantes, comunidades y actores externos para disenar soluciones
            sostenibles con evidencia y accion concreta.
          </p>
        </section>

        <section>
          <h2 className="section-title">Equipo Ejecutivo</h2>

          {executivePeople.length > 0 ? (
            <div className="people-grid">
              {executivePeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay equipo ejecutivo disponible"
              description="Los perfiles se cargaran de forma automatica cuando el endpoint de personas quede habilitado."
            />
          )}
        </section>

        <section style={{ marginTop: 52 }}>
          <h2 className="section-title">Miembros asociados</h2>

          {associatedMembers.length > 0 ? (
            <div className="member-chip-grid">
              {associatedMembers.map((name) => (
                <MemberChip key={name} name={name} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay miembros asociados"
              description="Esta cuadricula se llenara dinamicamente usando los datos de la API compartida de personas."
            />
          )}
        </section>
      </div>
    </SiteShell>
  );
}
