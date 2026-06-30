import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PAGE_NAV_ITEMS } from "@/components/navigation";

interface SiteShellProps {
  children: ReactNode;
  currentPath: string;
}

function isNavItemActive(currentPath: string, href: string): boolean {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteShell({ children, currentPath }: SiteShellProps) {
  return (
    <div className="site">
      <div className="topbar">
        <span className="topbar__u">PONTIFICIA UNIVERSIDAD CATÓLICA DE CHILE</span>
        <span className="topbar__d">·</span>
        <span>CampusLab UC</span>
      </div>

      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="nav__brand">
            <Image
              src="/assets/icons/campuslab.svg"
              alt="CampusLab UC"
              width={32}
              height={32}
              className="nav__logo"
            />
            <span className="nav__name">CampusLab UC</span>
          </Link>
          <ul className="nav__links">
            {PAGE_NAV_ITEMS.map((item) => {
              const active = isNavItemActive(currentPath, item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={active ? "active" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__grid">
            <div>
              <div className="footer__brand-name">CampusLab UC</div>
              <p className="footer__brand-desc">
                Red interdisciplinaria que impulsa experiencias de aprendizaje y colaboración desde
                los campus UC. Conectamos academia, estudiantes, comunidades y actores externos para
                diseñar soluciones sostenibles.
              </p>
            </div>
            <div>
              <div className="footer__col-title">Páginas</div>
              <ul className="footer__links">
                {PAGE_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer__col-title">Contacto</div>
              <ul className="footer__links">
                <li><a href="mailto:campuslab.ing@uc.cl">campuslab.ing@uc.cl</a></li>
                <li><span>Escuela de Diseño UC</span></li>
                <li><span>Avda. Vicuña Mackenna 4860</span></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span className="footer__copy">© 2025 Pontificia Universidad Católica de Chile</span>
            <span className="footer__copy">CampusLab UC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
