import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PAGE_NAV_ITEMS } from "@/components/navigation";

interface SiteShellProps {
  children: ReactNode;
  currentPath: string;
}

function isNavItemActive(currentPath: string, href: string): boolean {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteShell({ children, currentPath }: SiteShellProps) {
  return (
    <div className="labvivo-shell">
      <div className="top-chrome-fixed">
        <header className="uc-banner-fixed">
          <div className="uc-banner-logo-block" aria-hidden="true">
            <Image
              src="/assets/icons/logo_uc.svg"
              alt=""
              width={172}
              height={99}
              className="uc-banner-logo-vector"
            />
          </div>

          <div className="uc-banner-inner">
            <div className="uc-banner-main">
              <p className="uc-banner-title">
                Pontificia Universidad Catolica de Chile
              </p>
              <p className="uc-banner-subtitle">
                Laboratorios Vivos de Aprendizaje
              </p>
            </div>
          </div>
        </header>

        <div className="page-navbar-fixed">
          <div className="page-navbar-inner">
            <div className="page-navbar-main">
              <Link href="/" className="page-navbar-home-link">
                Laboratorios Vivos de Aprendizaje
              </Link>

              <nav
                aria-label="Navegacion principal"
                className="page-navbar-links"
              >
                {PAGE_NAV_ITEMS.map((item) => {
                  const active = isNavItemActive(currentPath, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`page-navbar-link ${active ? "is-active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <main className="page-content">{children}</main>
    </div>
  );
}
