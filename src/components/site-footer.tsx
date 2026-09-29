import credits from "@/data/image-credits.json";
import type { Dictionary } from "@/lib/i18n";

type Credit = { title: string; author: string; license: string; source: string };

export function SiteFooter({ name, dict }: { name: string; dict: Dictionary }) {
  const entries = Object.values(credits as Record<string, Credit>);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:px-6">
        <p>
          <span className="font-serif text-lg font-semibold text-text">{name}</span> · {dict.footer.priceNote}
        </p>
        <p>{dict.footer.fictional}</p>
        <details className="group">
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-text underline-offset-4 hover:underline">
            {dict.footer.credits} ({entries.length})
          </summary>
          <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
            {entries.map((c) => (
              <li key={c.source}>
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="hover:text-text hover:underline">
                  {c.title}
                </a>{" "}
                · {c.author} · {c.license}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  );
}
