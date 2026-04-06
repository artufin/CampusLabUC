import Link from "next/link";

export default function DatosAbiertosPage() {
  const datasetHref = "/datos-abiertos/dataset";

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Datos Abiertos", href: "/datos-abiertos" },
    { label: "Oportunidades", href: "#" },
    { label: "Nosotros", href: "#" },
  ];

  const dataPlaceholders = [
    "Dataset 001 - Energía",
    "Dataset 002 - Agua",
    "Dataset 003 - Residuos",
    "Dataset 004 - Emisiones",
    "Dataset 005 - Movilidad",
    "Dataset 006 - Consumo",
    "Dataset 007 - Clima",
    "Dataset 008 - Sismos",
  ];

  return (
    <main className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
      <header className="w-full border-b border-black/10 pb-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
            LabVivo UC
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Datos Abiertos
          </h1>
        </div>

        <nav
          aria-label="Navegación principal"
          className="mt-5 flex w-full flex-wrap items-center gap-3 border-t border-black/10 pt-4"
        >
          {navItems.map((item) => {
            const isActive = item.label === "Datos Abiertos";

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <section className="mt-6 w-full">
          <article className="flex min-h-[16rem] w-full flex-col justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-700 p-6 text-white transition duration-200 group-hover:-translate-y-0.5 group-hover:border-slate-500 group-hover:shadow-lg sm:p-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
              Carrusel
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Desafíos</h2>
          </div>
          </article>
      </section>

      <section className="mt-6 w-full">
        <article className="min-h-[30rem] w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 sm:p-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Datos disponibles
            </p>

            <ul className="grid grid-cols-1 gap-4 text-slate-700 sm:grid-cols-2">
              {dataPlaceholders.map((item) => (
                <li key={item} className="list-inside">
                  <Link
                    href={datasetHref}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
}
