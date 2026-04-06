import Link from "next/link";

export default function Home() {
  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Datos Abiertos", href: "/datos-abiertos" },
    { label: "Oportunidades", href: "#" },
    { label: "Nosotros", href: "#" },
  ];

  return (
    <main className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
      <header className="w-full border-b border-black/10 pb-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
            LabVivo UC
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            LabVivo UC
          </h1>
        </div>

        <nav
          aria-label="Navegación principal"
          className="mt-5 flex w-full flex-wrap items-center gap-3 border-t border-black/10 pt-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="mt-6 w-full">
        <article className="flex min-h-[18rem] w-full flex-col justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 sm:p-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Bloque de texto
            </p>
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Definición, pilares, desafíos, propuesta de valor.
            </h2>
          </div>
        </article>
      </section>

      <section className="mt-6 w-full">
        <aside className="flex min-h-[18rem] w-full flex-col rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-700 p-6 text-white sm:p-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
              Carrusel
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Tarrjetas de últimas experiencias
            </h2>
          </div>
        </aside>
      </section>
    </main>
  );
}
