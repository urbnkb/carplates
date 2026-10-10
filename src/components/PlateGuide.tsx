import Link from "next/link";
import { powiaty } from "@/data/powiaty";
import { getAllKody } from "@/lib/kody";

const LINK = "font-medium text-accent hover:underline";

/**
 * Widoczny tekst pod wyszukiwarką — strona główna była samym formularzem
 * i nie miała czego zacytować ani wyszukiwarce, ani asystentom AI. Każde
 * zdanie jest sprawdzone na src/data (zasada projektu: nie zmyślaj).
 */
export default function PlateGuide() {
  return (
    <section className="flex w-full max-w-xl flex-col gap-5">
      <h2 className="text-2xl font-bold text-zinc-900">Jak czytać polską tablicę rejestracyjną</h2>

      <div>
        <h3 className="font-semibold text-zinc-900">Co oznaczają litery na tablicy?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Pierwsza litera oznacza województwo: W to mazowieckie, K małopolskie. Kilka województw
          ma dwie litery, na przykład dolnośląskie D i V. Następna litera albo dwie wskazują
          powiat. Kod dwuliterowy ma zwykle miasto na prawach powiatu, a trzyliterowy powiat
          ziemski. Zdarzają się wyjątki: powiat poznański ma kod PZ, a Sopot GSP.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">Ile jest kodów tablic?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          W serwisie jest{" "}
          <Link href="/tablica" className={LINK}>
            {getAllKody().length} kodów
          </Link>{" "}
          przypisanych do{" "}
          <Link href="/powiat" className={LINK}>
            {powiaty.length} powiatów
          </Link>
          . Część powiatów ma więcej niż jeden kod.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">Czy po tablicy można rozpoznać dzielnicę Warszawy?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Tak. Każdy z{" "}
          <Link href="/dzielnica" className={LINK}>
            15 kodów Warszawy
          </Link>{" "}
          wskazuje dzielnicę: WA to Białołęka, WE Mokotów, WI Śródmieście. Tylko WW i WX dzielą
          się między kilka dzielnic. WW mają Rembertów, Wilanów i Włochy, a WX Wesoła i Żoliborz.
          Pozostałe kody na W należą do innych powiatów mazowieckich.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">Skąd pochodzą dane?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Kody tablic pochodzą z Wikiźródeł i Wikipedii, a granice powiatów i dzielnic z otwartych
          zbiorów danych. Pełną listę źródeł i licencji znajdziesz na stronie{" "}
          <Link href="/o-projekcie" className={LINK}>
            O projekcie
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
