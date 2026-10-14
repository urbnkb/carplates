import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { liczebnik } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { wojewodztwa } from "@/lib/wojewodztwa";

export const metadata = pageMetadata({
  title: "Województwa i litery tablic rejestracyjnych",
  description:
    "Litery tablic rejestracyjnych wszystkich 16 województw, od B (podlaskie) do Z (zachodniopomorskie). Powiaty i kody tablic w każdym województwie.",
  path: "/wojewodztwo",
});

export default function WojewodztwoIndexPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Województwa", path: "/wojewodztwo" }]} />
      <header className="text-center">
        <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Województwa
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-600">
          Pierwsza litera polskiej tablicy rejestracyjnej oznacza województwo. Wybierz województwo,
          żeby zobaczyć jego powiaty i kody tablic.
        </p>
      </header>

      <ul className="w-full gap-x-6 sm:columns-2">
        {wojewodztwa.map(({ nazwa, slug, litery, powiaty, kody }) => (
          <li key={slug} className="flex break-inside-avoid gap-3 py-1 text-sm">
            <span className="w-10 shrink-0 font-semibold text-zinc-900">{litery.join(", ")}</span>
            <span>
              <Link href={`/wojewodztwo/${slug}`} className="text-accent hover:underline">
                {nazwa}
              </Link>{" "}
              <span className="text-xs whitespace-nowrap text-zinc-600">
                ({liczebnik(powiaty.length, { one: "powiat", few: "powiaty", many: "powiatów" })},{" "}
                {liczebnik(kody.length, { one: "kod", few: "kody", many: "kodów" })})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
