import Link from "next/link";
import type { Metadata } from "next";
import { capitalize } from "@/lib/format";
import { powiaty } from "@/data/powiaty";
import { powiatSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Wszystkie powiaty i ich kody tablic rejestracyjnych",
  description: "Pełna lista polskich powiatów wraz z przypisanymi kodami tablic rejestracyjnych.",
  alternates: { canonical: "/powiat" },
};

const sortedPowiaty = [...powiaty].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));

export default function PowiatIndexPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-14 sm:py-20">
        <Link href="/" className="self-start text-sm text-accent hover:underline">
          ← Powrót do wyszukiwarki
        </Link>

        <header className="text-center">
          <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Wszystkie powiaty
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-600">
            {sortedPowiaty.length} powiatów z przypisanymi kodami tablic rejestracyjnych.
          </p>
        </header>

        <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {sortedPowiaty.map((powiat) => (
            <li key={powiat.geoId}>
              <Link
                href={`/powiat/${powiatSlug(powiat)}`}
                className="text-sm text-accent hover:underline"
              >
                {capitalize(powiat.nazwa)}
              </Link>{" "}
              <span className="text-xs text-zinc-600">({powiat.kody.join(", ")})</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
