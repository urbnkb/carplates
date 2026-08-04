# Skąd ta tablica?

Projekt edukacyjny: wpisujesz początkowe znaki polskiej tablicy rejestracyjnej — bezpośrednio na jej wizualnej imitacji — a aplikacja metodą **longest-prefix-match** rozpoznaje powiat, z którego pochodzi pojazd, pokazuje województwo, trzy ciekawostki o tym powiecie oraz podświetla go na mapie Polski.

Zero kluczy API, zero zewnętrznych serwisów mapowych wymagających autoryzacji — wszystkie dane (kody tablic, granice powiatów) są statyczne i trzymane w repozytorium.

## Funkcjonalność

- Wybór kraju (na start: tylko Polska — selektor przygotowany pod rozszerzenie).
- Wizualna imitacja tablicy rejestracyjnej (biały prostokąt, niebieski pasek euro z gwiazdkami i „PL") — piszesz **bezpośrednio na tablicy**.
- Podpowiedzi kodów: podczas pisania widoczne jest do 5 kodów (alfabetycznie) pasujących do wpisanego prefiksu, każdy klikalny.
- Rozpoznawanie powiatu metodą longest-prefix-match — dłuższy, bardziej precyzyjny kod (np. `WSI` → powiat siedlecki) zawsze poprawnie przesłania krótszy (np. `WS` → miasto Siedlce), a wpis niepasujący do żadnego realnego kodu (np. `WSP`) pokazuje jawny brak dopasowania zamiast zgadywać.
- Nazwa powiatu, województwo i trzy ciekawostki o powiecie.
- Mapa Polski (SVG, renderowana lokalnie) z podświetlonym, rozpoznanym powiatem.
- Powiat Warszawa (15 kodów tablic) ma dodatkowo mapę 18 dzielnic: po wpisaniu w trybie tablicy kodu należącego do Warszawy mapa Polski przełącza się na mapę dzielnic z podświetleniem tej konkretnej dzielnicy (lub kilku — kody WW i WX są współdzielone przez kilka dzielnic).
- **Nazwa dzielnicy w treści**: dla kodów warszawskich aplikacja podaje wprost, o którą dzielnicę chodzi — w karcie wyniku, w podpowiedziach, w indeksie kodów oraz w tytule, opisie i danych strukturalnych podstrony `/tablica/[kod]`. Dla kodów współdzielonych (WW, WX) wymieniane są wszystkie możliwe dzielnice wraz z informacją, że sama tablica ich nie rozróżnia.
- **Podstrony dzielnic** `/dzielnica/[slug]`: 18 statycznych stron z kodem tablicy, ciekawostkami i mapą podświetlającą tę jedną dzielnicę, plus indeks `/dzielnica`.
- Tryb odwrotny rozpoznaje także nazwy dzielnic Warszawy — wpisanie „Mokotów" pokazuje sam kod WE i podświetla tę dzielnicę na mapie, zamiast wyświetlać wszystkie 15 kodów stolicy.
- **Tryb odwrotny** (przełącznik w prawym górnym rogu): wpisujesz nazwę gminy, miasta lub powiatu — na osobnej makiecie nawiązującej do samorządów, a nie do tablicy — i widzisz kod(y) tablic tego powiatu w tej samej wizualnej formie co w trybie tablicy, razem z ciekawostkami i podświetleniem na mapie. Dopasowanie jest dokładne (bez zgadywania) i niewrażliwe na polskie znaki diakrytyczne oraz wielkość liter.

## Uruchomienie

Wymaga Node.js 20+.

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Stack technologiczny

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [react-simple-maps](https://www.react-simple-maps.io) — mapa SVG renderowana lokalnie z pliku granic w `public/data`, bez żadnego zewnętrznego serwisu mapowego

W `package.json` siedzi `overrides` na `d3-color: ^3.1.0`. To nie kosmetyka: `react-simple-maps` ciągnie przez `d3-zoom` starą wersję `d3-color` z podatnością na ReDoS (GHSA-36jr-mh4h-2g58), a paczka trafia do bundla klienta. Bez tego wpisu `npm audit` pokazuje wysoką podatność. Przy aktualizacji `react-simple-maps` sprawdź, czy override jest jeszcze potrzebny.

## Wygląd

Interfejs jest utrzymany w stylistyce **neomorficznej**, w wariancie jasnym: dominantą jest biel, a szarość pełni rolę cienia i wypełnienia wnęk. Obowiązuje jedna zasada — co wypukłe, jest białe; co wklęsłe (pola wejściowe, karty ciekawostek, tor przełącznika, ramka mapy), dostaje szare tło i cień wewnętrzny.

Fundament siedzi w `src/app/globals.css`: tokeny `--color-surface`, `--color-well`, `--color-edge`, `--color-sea` i akcenty w bloku `@theme`, plus cztery utility cieni (`neu-raised`, `neu-raised-sm`, `neu-sunken`, `neu-sunken-sm`) zdefiniowane przez `@utility`. Cienie są opisane w jednym miejscu — przy zmianie odcienia powierzchni trzeba przeliczyć je razem z nią, a także zaktualizować `viewport.themeColor` w `src/app/layout.tsx` i kolory w `src/app/opengraph-image.tsx`, które nie korzystają z tokenów.

Główną kartę (`ProductWindow`) obrysowuje szara krawędź o szerokości jednego piksela (`--color-edge`), która tylko domyka kształt; za wrażenie unoszenia się odpowiada cień z `neu-raised`. Gruba kolorowa ramka była testowana i okazała się za ciężka, podobnie jak wcześniejsze 3 px — przy hairline'owych cieniach każdy grubszy pasek zaczyna czytać się jako zwykły border.

Cienie są celowo krótkie: o wrażeniu ciężkości decyduje **promień rozmycia**, nie alfa. Próba odchudzenia samą alfą została przeprowadzona i była na ekranie nie do wychwycenia — cień pozostawał tą samą szeroką chmurą, tylko bledszą. Obecne wartości to przesunięcia 1–2 px i rozmycia 2–6 px; zasięg przyciemnienia przy krawędzi karty wynosi ok. 6 px. Jeżeli cienie mają być mocniejsze lub słabsze, zaczynaj od promienia.

Mapy (`PolandMap`, `WarszawaDzielniceMap`) mają wspólny wygląd w `src/lib/mapStyle.ts` — kolory SVG nie mogą iść przez tokeny Tailwinda, więc siedzą tam, a nie w `globals.css`. Wyjątkiem jest tło ramki: to zwykły element HTML, więc bierze `--color-sea` przez klasę `bg-sea`. Powiaty są białe i to właśnie różnica względem tego tokenu rysuje sylwetkę kraju — przy zmianie jednego przelicz drugi.

Granice powiatów rysowane są z `vector-effect="non-scaling-stroke"` i to nie jest ozdobnik. Bez tego `strokeWidth` jest skalowany razem z viewBoxem (800 jednostek), więc na telefonie o szerokości ~370 px grubość 0,4 schodziła do 0,18 px i cała mapa zlewała się w plamę. Z `non-scaling-stroke` wartość oznacza piksele CSS na każdej szerokości ekranu. Podświetlony kształt dostaje grubszy, ciemny kontur i poświatę oraz jest przestawiany na koniec listy (`highlightedLast`), bo SVG rysuje w kolejności dokumentu i sąsiad zamalowałby mu krawędź.

Rozróżnienie dwóch światów aplikacji — tablicy i powiatu — niesie wypełniony kolorem segment przełącznika trybu (`ModeToggle`): niebieski dla tablic, zielony dla powiatów i dzielnic. Sama karta jest neutralna.

Serwis ma jeden motyw jasny — nie ma przełącznika trybu ciemnego. Kontrast tekstu jest weryfikowany względem WCAG AA; przy zmianie kolorów trzeba to sprawdzić ponownie, bo część odcieni Tailwinda (`blue-600`, `amber-600`, `zinc-500`) nie przechodzi progu na jasnym tle.

## Źródła danych i atrybucja

- **Kody tablic → powiat → województwo** (`src/data/powiaty.ts`): transkrybowane programowo z [Wikiźródeł — „Polskie tablice rejestracyjne"](https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne), zweryfikowane krzyżowo z listą 380 powiatów z pliku granic oraz z [Wikipedią — „Tablice rejestracyjne w Polsce"](https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce) dla przypadków brzegowych. Dwa kody (powiat nidzicki, powiat lidzbarski), których zabrakło w tabeli źródłowej, zostały potwierdzone bezpośrednio w infoboksach stron tych powiatów na Wikipedii.
- **Granice powiatów** (`public/data/powiaty-boundaries.json`): [ppatrzyk/polska-geojson](https://github.com/ppatrzyk/polska-geojson) (licencja MIT).
- **Granice dzielnic Warszawy** (`public/data/warszawa-dzielnice-boundaries.json`): [OpenStreetMap](https://www.openstreetmap.org) (licencja [ODbL](https://opendatacommons.org/licenses/odbl/)), relacje administracyjne `admin_level=9` pobrane przez Overpass API i uproszczone narzędziem [mapshaper](https://github.com/mbloch/mapshaper).
- **Kod tablicy → dzielnica Warszawy** (`src/data/dzielnice.ts`): tag `vehicle_plate_code` na tych samych relacjach OpenStreetMap, potwierdzony krzyżowo z niezależnymi źródłami motoryzacyjnymi ([wyborkierowcow.pl](https://www.wyborkierowcow.pl/warszawskie-rejestracje-tablice-rejestracyjne-warszawa/), [motoryzacja.interia.pl](https://motoryzacja.interia.pl/porady/news-z-jakiej-dzielnicy-warszawy-jestes-tajemnica-tablicy-rejestr,nId,20356160)) — w przeciwieństwie do reszty danych w projekcie, to mapowanie nie ma potwierdzenia w Wikiźródłach/Wikipedii.
- **Ciekawostki o dzielnicach Warszawy** (`src/data/dzielnice.ts`): po trzy fakty dla każdej z 18 dzielnic, zebrane z serwisów dzielnicowych m.st. Warszawy (`um.warszawa.pl`), polskiej Wikipedii oraz portali historycznych (m.in. [dzieje.pl](https://dzieje.pl), [metro.waw.pl](https://www.metro.waw.pl)), z krzyżową weryfikacją dat, liczb i nazw obiektów w co najmniej dwóch niezależnych źródłach. W przeciwieństwie do ciekawostek powiatowych, zbieranych z bezpośredniej lektury stron Wikipedii, te powstały na podstawie wyszukiwania — fakty niepotwierdzone krzyżowo zostały pominięte, a nie uzupełnione domysłem. Zgodnie z zasadą projektu „nie zmyślaj" żaden fakt nie jest wygenerowany bez źródła.
- **Ciekawostki**: sprawdzone, konkretne fakty dla wszystkich 380 powiatów (`factsVerified: true`), zebrane głównie z polskiej Wikipedii (strony powiatów i miast będących ich siedzibami), z krzyżową weryfikacją dla wątpliwych szczegółów. Zgodnie z zasadą projektu „nie zmyślaj" — żaden fakt nie jest wygenerowany bez źródła.

## Znane ograniczenia

- Działa tylko dla Polski — selektor kraju jest przygotowany pod rozszerzenie, ale nie ma jeszcze logiki dla innych krajów.
- Tryb odwrotny nie zna miast będących siedzibami powiatów ziemskich, jeśli miasto samo nie jest osobnym powiatem grodzkim (np. „Mińsk Mazowiecki" nie trafi „powiatu mińskiego") — dane nie zawierają pola „siedziba", a dopisywanie takiego mapowania na podstawie zgadywania nazw byłoby sprzeczne z zasadą projektu, by nie zmyślać danych.
- Kilka par powiatów ziemskich ma identyczną nazwę w różnych województwach (np. dwa „powiat brzeski"). Tryb odwrotny nie zgaduje wtedy, o który chodzi — pokazuje obie opcje do wyboru z podpowiedzi.
- Kody WW i WX są współdzielone — odpowiednio przez trzy dzielnice (Rembertów, Wilanów, Włochy) i dwie (Wesoła, Żoliborz). Sama tablica nie wskazuje więc jednej dzielnicy i aplikacja nigdzie nie udaje, że jest inaczej: wymienia wszystkie możliwe zamiast wybierać którąkolwiek.
