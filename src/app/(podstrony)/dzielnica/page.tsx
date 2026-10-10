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
      <header className="text-center">
        <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Dzielnice Warszawy
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-600">
          Warszawa to jedyny powiat w Polsce, w którym kod tablicy wskazuje dzielnicę. Kody WW i WX
          są współdzielone przez kilka dzielnic naraz.
        </p>
      </header>

      <DzielniceGrid />
    </>
  );
}
