import Link from "next/link";
import { powiaty } from "@/data/powiaty";
import { andList } from "@/lib/format";
import { getAllKody } from "@/lib/kody";

const LINK = "font-medium text-accent hover:underline";

// Litery województw liczone z danych, żeby lista nie rozjechała się z kodami powiatów.
const literyByWoj = new Map<string, Set<string>>();
for (const { wojewodztwo, kody } of powiaty) {
  const litery = literyByWoj.get(wojewodztwo) ?? new Set<string>();
  for (const kod of kody) litery.add(kod[0]);
  literyByWoj.set(wojewodztwo, litery);
}
const literyWojewodztw = [...literyByWoj]
  .map(([wojewodztwo, litery]) => ({ wojewodztwo, litery: [...litery].sort() }))
  .sort((a, b) => a.litery[0].localeCompare(b.litery[0]));

const dwieLitery = literyWojewodztw
  .filter((w) => w.litery.length > 1)
  .map((w) => w.wojewodztwo)
  .sort((a, b) => a.localeCompare(b, "pl"));
const kody2 = getAllKody().filter(({ kod }) => kod.length === 2).length;
const kody3 = getAllKody().filter(({ kod }) => kod.length === 3).length;

function KodLink({ kod }: { kod: string }) {
  return (
    <Link href={`/tablica/${kod}`} className={LINK}>
      {kod}
    </Link>
  );
}

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
        <h3 className="font-semibold text-zinc-900">Co oznaczają litery na tablicy rejestracyjnej?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Pierwsze dwa albo trzy znaki tablicy to kod powiatu, w którym ją wydano. Pierwsza litera
          kodu oznacza województwo, a kolejne powiat. Na przykład <KodLink kod="KR" /> to Kraków,
          a <KodLink kod="KRA" /> powiat krakowski. Oba zaczynają się na K, bo Kraków i powiat
          krakowski leżą w małopolskim.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">Jakie litery mają województwa?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Jedną literę ma {literyWojewodztw.length - dwieLitery.length} województw, a dwie:{" "}
          {andList.format(dwieLitery)}.
        </p>
        <dl className="mt-2 gap-x-6 text-sm sm:columns-2">
          {literyWojewodztw.map(({ wojewodztwo, litery }) => (
            <div key={wojewodztwo} className="flex break-inside-avoid gap-3 border-b border-edge py-1">
              <dt className="w-10 shrink-0 font-semibold text-zinc-900">{litery.join(", ")}</dt>
              <dd className="text-zinc-600">{wojewodztwo}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900">Czym różni się kod dwuliterowy od trzyliterowego?</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Dwie litery ma zwykle miasto na prawach powiatu, a trzy powiat ziemski. Od tej reguły
          jest 14 wyjątków. Dwuliterowy kod ma 9 powiatów ziemskich: garwoliński{" "}
          <KodLink kod="WG" />, legionowski <KodLink kod="WL" />, miński <KodLink kod="WM" />,
          wołomiński <KodLink kod="WV" />, warszawski zachodni <KodLink kod="WZ" />, brzeski
          w opolskim <KodLink kod="OB" />, kędzierzyńsko-kozielski <KodLink kod="OK" />,
          pilski <KodLink kod="PP" /> i poznański <KodLink kod="PZ" />. Trzyliterowy kod ma
          5 miast: Sopot <KodLink kod="GSP" />, Świnoujście <KodLink kod="ZSW" />,
          Jastrzębie-Zdrój <KodLink kod="SJZ" />, Piekary Śląskie <KodLink kod="SPI" /> i
          Żory <KodLink kod="SZO" />.
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
          : {kody2} dwuliterowe i {kody3} trzyliterowe. Część powiatów ma więcej niż jeden kod,
          na przykład Kraków ma KR i KK.
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
