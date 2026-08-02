import Link from "next/link";
import type { Metadata } from "next";
import { regionLabel } from "@/lib/dzielnice";
import { getAllKody } from "@/lib/kody";

export const metadata: Metadata = {
  title: "Wszystkie kody tablic rejestracyjnych",
  description: "Pełna lista kodów polskich tablic rejestracyjnych wraz z przypisanymi powiatami.",
  alternates: { canonical: "/tablica" },
};

export default function TablicaIndexPage() {
  const allKody = getAllKody();

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-14 sm:py-20">
        <Link href="/" className="self-start text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← Powrót do wyszukiwarki
        </Link>

        <header className="text-center">
          <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Wszystkie kody tablic
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
            {allKody.length} kodów tablic rejestracyjnych wraz z przypisanymi powiatami.
          </p>
        </header>

        <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {allKody.map(({ kod, powiat }) => (
            <li key={kod}>
              <Link href={`/tablica/${kod}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                {kod}
              </Link>{" "}
              <span className="text-xs text-zinc-500 dark:text-zinc-500">— {regionLabel(powiat, kod)}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
