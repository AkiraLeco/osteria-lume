import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600"],
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Página não encontrada · Osteria Lume",
  robots: { index: false },
};

// Mesmo script do layout: esta página não passa por ele, então aplica o tema salvo por conta própria.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m)document.documentElement.setAttribute("data-theme",m[1])}catch(e){}})()`;

/** 404 para qualquer URL fora de /pt e /en. Bilíngue, porque aqui não se sabe o idioma de quem chegou. */
export default function GlobalNotFound() {
  const button =
    "inline-flex h-12 items-center rounded-full px-6 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grid min-h-dvh place-items-center px-4 font-sans">
        <main className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="font-serif text-7xl font-semibold text-accent">404</p>
          <h1 className="font-serif text-3xl font-semibold">Página não encontrada</h1>
          <p className="text-muted" lang="en">
            Page not found.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/pt" className={`${button} bg-accent text-on-accent hover:bg-accent-hover`}>
              Ver o cardápio
            </Link>
            <Link href="/en" lang="en" className={`${button} border border-border hover:bg-surface-2`}>
              See the menu
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
