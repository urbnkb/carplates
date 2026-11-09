import { powiaty } from "@/data/powiaty";
import { pageMetadata } from "@/lib/metadata";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SekcjeWojewodztw, SpisWojewodztw, TabelaPowiatow } from "@/components/Tabele";

export const metadata = pageMetadata({
  title: "Powiaty w Polsce i ich kody tablic rejestracyjnych",
  description: `Lista ${powiaty.length} polskich powiatów i miast na prawach powiatu z kodami tablic rejestracyjnych, podzielona na 16 województw.`,
  path: "/powiat",
});

export default function PowiatIndexPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Powiaty", path: "/powiat" }]} />
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="page-title">Powiaty i ich kody tablic</h1>
        <p className="lead-text">
          W Polsce jest {powiaty.length} powiatów, w tym miasta na prawach powiatu. Każdy ma
          przypisany co najmniej jeden kod tablicy rejestracyjnej.
        </p>
      </header>

      <SpisWojewodztw />
      <SekcjeWojewodztw tresc={(w) => <TabelaPowiatow powiaty={w.powiaty} />} />
    </>
  );
}
