import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { InfoSection } from "@/components/info-section";
import { MenuBrowser } from "@/components/menu-browser";
import { SiteFooter } from "@/components/site-footer";
import { dictionaries, hasLocale } from "@/lib/i18n";
import { getMenu } from "@/lib/menu-repository";

export default async function MenuPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = dictionaries[lang];
  const { restaurant, categories } = await getMenu();

  return (
    <>
      <Hero restaurant={restaurant} locale={lang} dict={dict} />
      <main>
        <MenuBrowser categories={categories} locale={lang} dict={dict} />
        <InfoSection restaurant={restaurant} locale={lang} dict={dict} />
      </main>
      <SiteFooter name={restaurant.name} dict={dict} />
    </>
  );
}
