import Link from "next/link";
import { regionLabel } from "@/lib/dzielnice";
import { powiaty } from "@/data/powiaty";
import { pageMetadata } from "@/lib/metadata";
import { powiatSlug } from "@/lib/slug";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMetadata({
  title: "Wszystkie powiaty i ich kody tablic rejestracyjnych",
  description: "Pełna lista polskich powiatów wraz z przypisanymi kodami tablic rejestracyjnych.",
  path: "/powiat",
});

const sortedPowiaty = [...powiaty].sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));

export default function PowiatIndexPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Powiaty", path: "/powiat" }]} />
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
              {regionLabel(powiat)}
            </Link>{" "}
            <span className="text-xs text-zinc-600">({powiat.kody.join(", ")})</span>
          </li>
        ))}
      </ul>
    </>
  );
}
