import Link from "next/link";
import { powiaty } from "@/data/powiaty";
import { getDzielniceForKod, warszawaPowiat } from "@/lib/dzielnice";
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
const kodyWarszawy = warszawaPowiat.kody.length;
const kodyJednejDzielnicy = warszawaPowiat.kody.filter((kod) => getDzielniceForKod(kod).length === 1).length;

/**
 * Kawałek odpowiedzi: tekst albo odnośnik. Z tych samych kawałków powstaje
 * widoczny akapit i tekst odpowiedzi w FAQPage, więc obie wersje nie mogą się
 * rozjechać (Google wymaga, żeby dane strukturalne zgadzały się z treścią).
 */
type Fragment = string | { href: string; text: string };

interface Pytanie {
  pytanie: string;
  odpowiedz: Fragment[];
  /** Pod akapitem stoi lista liter województw; w FAQPage dopisujemy ją tekstem. */
  zListaLiter?: boolean;
}

const kod = (k: string): Fragment => ({ href: `/tablica/${k}`, text: k });

/** "a X, b Y i c Z" z kawałków, jak `andList`, ale z odnośnikami. */
function wylicz(pozycje: Fragment[][]): Fragment[] {
  return pozycje.flatMap((p, i) => [i === 0 ? "" : i === pozycje.length - 1 ? " i " : ", ", ...p]);
}

const tekst = (fragmenty: Fragment[]) => fragmenty.map((f) => (typeof f === "string" ? f : f.text)).join("");

const listaLiterTekst = literyWojewodztw.map((w) => `${w.litery.join(", ")}: ${w.wojewodztwo}`).join("; ");

/**
 * Pierwsze zdanie każdej odpowiedzi musi nazywać temat (tablice rejestracyjne),
 * bo asystenci AI i fragmenty z odpowiedzią cytują je bez nagłówka. Każde
 * zdanie jest sprawdzone na src/data (zasada projektu: nie zmyślaj).
 */
const PYTANIA: Pytanie[] = [
  {
    pytanie: "Co oznaczają litery na tablicy rejestracyjnej?",
    odpowiedz: [
      "Pierwsze dwa albo trzy znaki tablicy rejestracyjnej to kod powiatu, w którym ją wydano. Pierwsza litera kodu oznacza województwo, a kolejne powiat. Na przykład ",
      kod("KR"),
      " to Kraków, a ",
      kod("KRA"),
      " powiat krakowski. Oba zaczynają się na K, bo Kraków i powiat krakowski leżą w małopolskim.",
    ],
  },
  {
    pytanie: "Jaka litera na tablicy rejestracyjnej oznacza województwo?",
    odpowiedz: [
      `Na polskich tablicach rejestracyjnych jedną literę ma ${literyWojewodztw.length - dwieLitery.length} województw, a dwie: ${andList.format(dwieLitery)}.`,
    ],
    zListaLiter: true,
  },
  {
    pytanie: "Czym różni się dwuliterowy kod tablicy od trzyliterowego?",
    odpowiedz: [
      "Dwuliterowy kod tablicy rejestracyjnej ma zwykle miasto na prawach powiatu, a trzyliterowy powiat ziemski. Od tej reguły jest 14 wyjątków. Dwuliterowy kod ma 9 powiatów ziemskich: ",
      ...wylicz([
        ["garwoliński ", kod("WG")],
        ["legionowski ", kod("WL")],
        ["miński ", kod("WM")],
        ["wołomiński ", kod("WV")],
        ["warszawski zachodni ", kod("WZ")],
        ["brzeski w opolskim ", kod("OB")],
        ["kędzierzyńsko-kozielski ", kod("OK")],
        ["pilski ", kod("PP")],
        ["poznański ", kod("PZ")],
      ]),
      ". Trzyliterowy kod ma 5 miast: ",
      ...wylicz([
        ["Sopot ", kod("GSP")],
        ["Świnoujście ", kod("ZSW")],
        ["Jastrzębie-Zdrój ", kod("SJZ")],
        ["Piekary Śląskie ", kod("SPI")],
        ["Żory ", kod("SZO")],
      ]),
      ".",
    ],
  },
  {
    pytanie: "Ile jest kodów tablic rejestracyjnych?",
    odpowiedz: [
      "W serwisie jest ",
      { href: "/tablica", text: `${getAllKody().length} kodów tablic rejestracyjnych` },
      " przypisanych do wszystkich ",
      { href: "/powiat", text: `${powiaty.length} powiatów` },
      ` w Polsce. ${kody2} kody mają dwie litery, a ${kody3} trzy. Część powiatów ma więcej niż jeden kod, na przykład Kraków ma `,
      kod("KR"),
      " i ",
      kod("KK"),
      ".",
    ],
  },
  {
    pytanie: "Czy po tablicy rejestracyjnej można rozpoznać dzielnicę Warszawy?",
    odpowiedz: [
      `Tak, ${kodyJednejDzielnicy} z `,
      { href: "/dzielnica", text: `${kodyWarszawy} warszawskich kodów tablic` },
      " wskazuje jedną dzielnicę: WA to Białołęka, WE Mokotów, WI Śródmieście. Kody WW i WX dzielą się między kilka dzielnic. WW mają Rembertów, Wilanów i Włochy, a WX Wesoła i Żoliborz. Pozostałe kody na W należą do innych powiatów mazowieckich.",
    ],
  },
  {
    pytanie: "Skąd pochodzą dane o kodach tablic?",
    odpowiedz: [
      "Kody tablic pochodzą z Wikiźródeł i Wikipedii, a granice powiatów i dzielnic z otwartych zbiorów danych. Pełną listę źródeł i licencji znajdziesz na stronie ",
      { href: "/o-projekcie", text: "O projekcie" },
      ".",
    ],
  },
];

/** FAQPage dla `@graph` strony głównej; treść z tych samych kawałków co widoczny tekst. */
export const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: PYTANIA.map(({ pytanie, odpowiedz, zListaLiter }) => ({
    "@type": "Question",
    name: pytanie,
    acceptedAnswer: {
      "@type": "Answer",
      text: zListaLiter ? `${tekst(odpowiedz)} ${listaLiterTekst}.` : tekst(odpowiedz),
    },
  })),
};

/**
 * Widoczny tekst pod wyszukiwarką. Strona główna była samym formularzem
 * i nie miała czego zacytować ani wyszukiwarce, ani asystentom AI.
 */
export default function PlateGuide() {
  return (
    <section className="flex w-full max-w-xl flex-col gap-5">
      <h2 className="text-2xl font-bold text-zinc-900">Jak czytać polską tablicę rejestracyjną</h2>

      {PYTANIA.map(({ pytanie, odpowiedz, zListaLiter }) => (
        <div key={pytanie}>
          <h3 className="font-semibold text-zinc-900">{pytanie}</h3>
          <p className="mt-1 text-sm text-zinc-600">
            {odpowiedz.map((f, i) =>
              typeof f === "string" ? (
                f
              ) : (
                <Link key={i} href={f.href} className={LINK}>
                  {f.text}
                </Link>
              ),
            )}
          </p>
          {zListaLiter && (
            <dl className="mt-2 gap-x-6 text-sm sm:columns-2">
              {literyWojewodztw.map(({ wojewodztwo, litery }) => (
                <div key={wojewodztwo} className="flex break-inside-avoid gap-3 border-b border-edge py-1">
                  <dt className="w-10 shrink-0 font-semibold text-zinc-900">{litery.join(", ")}</dt>
                  <dd className="text-zinc-600">{wojewodztwo}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </section>
  );
}
