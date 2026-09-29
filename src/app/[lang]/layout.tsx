import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeSync } from "@/components/theme-toggle";
import { dictionaries, hasLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";
import "../globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

// Só "pt" e "en" existem; qualquer outro idioma na URL vai direto para a página 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = dictionaries[lang];
  return {
    // Na Vercel, usa o domínio de produção para montar as URLs absolutas das imagens de compartilhamento.
    metadataBase: new URL(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000",
    ),
    title: meta.title,
    description: meta.description,
    alternates: { languages: { "pt-BR": "/pt", en: "/en" } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: ["/images/dishes/hero.jpg"],
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141312" },
  ],
};

// Aplica o tema salvo antes da primeira pintura, evitando o "piscar" do tema claro.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m)document.documentElement.setAttribute("data-theme",m[1])}catch(e){}})()`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${serif.variable} ${sans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
