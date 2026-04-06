import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabVivo UC",
  description: "Landing page de LabVivo UC con navegación, bloque de texto y carrusel placeholder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_40%,_#eef2ff_100%)] text-slate-950">
        {children}
      </body>
    </html>
  );
}
