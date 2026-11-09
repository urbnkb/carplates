import Breadcrumbs from "@/components/Breadcrumbs";
import { DzielniceGrid } from "@/components/DzielniceLinks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Dzielnice Warszawy i ich kody tablic",
  description:
    "18 dzielnic Warszawy wraz z kodami tablic rejestracyjnych (WA–WY). Sprawdź, z której dzielnicy pochodzi rejestracja.",
  path: "/dzielnica",
});

export default function DzielnicaIndexPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Dzielnice Warszawy", path: "/dzielnica" }]} />
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="page-title">Dzielnice Warszawy i ich kody tablic</h1>
        <p className="lead-text">
          Warszawa to jedyny powiat w Polsce, w którym kod tablicy wskazuje dzielnicę. Kody WW i WX
          są współdzielone przez kilka dzielnic naraz.
        </p>
      </header>

      <DzielniceGrid />
    </>
  );
}
