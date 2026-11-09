"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/**
 * Mała wyszukiwarka tablicy w nagłówku podstron. Dostaje samą listę kodów,
 * a nie `@/data/powiaty`, bo te dane z ciekawostkami ważą setki kilobajtów.
 */
export default function PlateSearch({ kody }: { kody: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [nieznany, setNieznany] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    // "KR ABC12" -> KR, "GDA1234" -> GDA: kod kończy się na spacji albo przed pierwszą cyfrą.
    const litery = value.trim().toUpperCase().split(/\s+/)[0].match(/^[A-Z]+/)?.[0] ?? "";
    const kod = [litery.slice(0, 3), litery.slice(0, 2)].find((k) => kody.includes(k));
    if (!kod) {
      setNieznany(litery || value.trim());
      return;
    }
    setNieznany(null);
    setValue("");
    router.push(`/tablica/${kod}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative shrink-0">
      <div className="flex h-11 w-40 items-stretch overflow-hidden rounded-md border-2 border-black bg-white focus-within:ring-2 focus-within:ring-accent sm:w-48">
        <div aria-hidden="true" className="flex w-5 shrink-0 items-end justify-center bg-[#003399] pb-1">
          <span className="text-[8px] font-bold text-white">PL</span>
        </div>
        {/* text-base celowo: poniżej 16 px iOS powiększa stronę przy fokusie. */}
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={9}
          placeholder="np. GDA"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            setNieznany(null);
          }}
          aria-label="Początek tablicy rejestracyjnej"
          className="min-w-0 flex-1 bg-transparent px-2 font-mono text-base font-bold tracking-wider text-black outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-500"
        />
        <button
          type="submit"
          aria-label="Sprawdź tablicę"
          className="grid w-9 shrink-0 place-items-center text-zinc-700 hover:text-accent"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>
      <p
        role="status"
        className={
          nieznany
            ? "neu-raised absolute top-full right-0 z-20 mt-2 w-56 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-zinc-700"
            : "sr-only"
        }
      >
        {nieznany && (
          <>
            Nie ma kodu <span className="font-mono font-bold">{nieznany}</span>. Sprawdź{" "}
            <Link href="/tablica" className="link-accent">
              listę kodów
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
