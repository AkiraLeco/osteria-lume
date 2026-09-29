import { AtSign, Clock, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, RestaurantInfo } from "@/lib/types";
import { OpeningHoursTable } from "./opening-hours";

type Props = { restaurant: RestaurantInfo; locale: Locale; dict: Dictionary };

const digits = (phone: string) => phone.replace(/\D/g, "");

function Block({ icon: Icon, title, children }: { icon: typeof Clock; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase">
        <Icon aria-hidden className="size-4 text-accent" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export function InfoSection({ restaurant, locale, dict }: Props) {
  const linkClass = "inline-flex min-h-11 items-center gap-2 text-text underline-offset-4 hover:text-accent hover:underline";

  return (
    <section id="info" aria-labelledby="info-title" className="border-t border-border bg-surface-2/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <h2 id="info-title" className="mb-8 font-serif text-4xl font-semibold sm:text-5xl">
          {dict.info.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <Block icon={MapPin} title={dict.info.address}>
            <p className="text-base">{restaurant.address}</p>
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 ${linkClass}`}>
              {dict.info.openMap}
              <ExternalLink aria-hidden className="size-4" />
            </a>
          </Block>

          <Block icon={Clock} title={dict.info.hours}>
            <OpeningHoursTable hours={restaurant.openingHours} locale={locale} dict={dict} />
          </Block>

          <Block icon={Phone} title={dict.info.contact}>
            <ul className="flex flex-col">
              <li>
                <a href={`tel:+${digits(restaurant.phone)}`} className={linkClass}>
                  <Phone aria-hidden className="size-4 text-muted" />
                  <span className="sr-only">{dict.info.phone}: </span>
                  {restaurant.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${digits(restaurant.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <MessageCircle aria-hidden className="size-4 text-muted" />
                  <span className="sr-only">{dict.info.whatsapp}: </span>
                  {restaurant.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${restaurant.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <AtSign aria-hidden className="size-4 text-muted" />
                  <span className="sr-only">{dict.info.instagram}: </span>
                  {restaurant.instagram}
                </a>
              </li>
            </ul>
          </Block>
        </div>
      </div>
    </section>
  );
}
