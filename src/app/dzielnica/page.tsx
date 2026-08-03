import Link from "next/link";
import type { Metadata } from "next";
import { dzielnice } from "@/data/dzielnice";
import { dzielnicaSlug } from "@/lib/dzielnice";

export const metadata: Metadata = {
  title: "Dzielnice Warszawy i ich kody tablic",
  description:
    "18 dzielnic Warszawy wraz z kodami tablic rejestracyjnych (WA–WY). Sprawdź, z której dzielnicy pochodzi rejestracja.",
  alternates: { canonical: "/dzielnica" },
};

export default function DzielnicaIndexPage() {
  const posortowane = [...dzielnice].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-14 sm:py-20">
        <Link href="/" className="self-start text-sm text-accent hover:underline">
          ← Powrót do wyszukiwarki
        </Link>

        <header className="text-center">
          <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Dzielnice Warszawy
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-600">
            Warszawa to jedyny powiat w Polsce, w którym kod tablicy wskazuje dzielnicę. Kody WW i WX
            są współdzielone przez kilka dzielnic naraz.
          </p>
        </header>

        <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {posortowane.map((d) => (
            <li key={d.geoId}>
              <Link
                href={`/dzielnica/${dzielnicaSlug(d)}`}
                className="text-sm text-accent hover:underline"
              >
                {d.nazwa}
              </Link>{" "}
              <span className="font-mono text-xs text-zinc-600">{d.kod}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
