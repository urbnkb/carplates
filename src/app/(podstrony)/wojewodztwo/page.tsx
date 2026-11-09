import Breadcrumbs from "@/components/Breadcrumbs";
import { TabelaWojewodztw } from "@/components/Tabele";
import { pageMetadata } from "@/lib/metadata";

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
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="page-title">Województwa i litery tablic</h1>
        <p className="lead-text">
          Pierwsza litera polskiej tablicy rejestracyjnej oznacza województwo. Wybierz województwo,
          żeby zobaczyć jego powiaty i kody tablic.
        </p>
      </header>

      <div className="w-full max-w-2xl">
        <TabelaWojewodztw />
      </div>
    </>
  );
}
