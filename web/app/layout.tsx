import type { Metadata } from "next";
import { Archivo, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LabVivo UC",
  description:
    "Plataforma de Laboratorios Vivos de Aprendizaje UC con datos abiertos, oportunidades y repositorio de experiencias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunitoSans.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full labvivo-body">{children}</body>
    </html>
  );
}
