import type { Metadata } from "next";
import { Amiri, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "CampusLab UC",
  description:
    "Plataforma de CampusLab UC con datos abiertos, oportunidades y repositorio de experiencias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${amiri.variable} ${sourceSans3.variable}`}>
      <body>{children}</body>
    </html>
  );
}
