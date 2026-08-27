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

Wyjątkiem od tej reguły są latające ikonki wokół nagłówka na stronie głównej (`HeroIcons`). Nie są częścią karty, tylko dekoracją obok niej, w skali 24–44 px — a w tej skali 2 px pierścienia czyta się jako sygnatura akcentu, nie jako obrys panelu. Bez koloru kółka gubiły się w białym tle, najbardziej na telefonie. Każde dostaje więc obwolutkę w kolorze swojego glifu: gradient od odcienia 400 do tego samego, którym pomalowana jest ikonka, a wypełnienie schodzi od bieli do odcienia 50 tej samej barwy, żeby kółko nie było płaską plamą. Odcień 50 to górna granica, jaką tu przyjmujemy: mocniejszy tint przestaje czytać się jako biel i łamie zasadę „co wypukłe, jest białe”.

Przepis siedzi w `@utility hero-accent` i `hero-accent-face` w `globals.css` — to jedyny gradient w serwisie. Pierścień jest zwykłym `padding: 2px` wrappera z gradientem w tle, a kółko w środku to osobny element z własnym wypełnieniem; ten sam układ co krawędź karty w `ProductWindow`. Same kolory są przy akcentach (`ringFrom`/`ringTo`/`ringTint` w tablicy `ACCENTS`), bo to część konfiguracji ikonki obok jej pozycji i rozmiaru. Tint musi być nieprzezroczysty, inaczej prześwituje przez niego pierścień spod spodu, i nie liczymy go przez `color-mix` — Lightning CSS dokłada wtedy fallback bez `color-mix`, w którym dół kółka zalewa pełny kolor akcentu. Cień zostaje wspólny (`neu-raised-sm`) — kolorowej poświaty ikonki nie dostają, bo szłaby pod prąd ścinaniu cieni do hairline'u. Kontrast WCAG nie jest tu progiem: cały blok ma `aria-hidden="true"` i nie niesie treści.

Pierwsza wersja rysowała pierścień dwiema warstwami tła o różnym `background-clip` (`padding-box` na wypełnieniu, `border-box` na obrysie, `border` przezroczysty) i to był błąd, który przeszedł przez weryfikację: iOS Safari nie honoruje `background-clip` per warstwa w skrócie `background`, więc wypełnienie zamalowywało pierścień i na telefonie zostawało samo białe kółko. Chromium renderował to poprawnie, więc różnicy nie dało się złapać inaczej niż na urządzeniu. Stąd zasada na przyszłość: w tym projekcie nie opieramy wyglądu na `background-clip` per warstwa.

Ruch ikonek liczy `HeroIcons` w pętli scrolla i obowiązuje tam jedna zasada: **żadnych odczytów layoutu**. Pierwsza wersja wołała `getBoundingClientRect()` w każdej klatce — na nagłówku i na kompasie, przy czym ten drugi odczyt następował po zapisaniu transformów wcześniejszych ikonek, czyli w układzie zapis → odczyt → zapis wymuszającym synchroniczny reflow. Przy mapie o 380 ścieżkach w DOM-ie to był główny koszt przewijania na telefonie. Kompas zderza się z nagłówkiem jak ze ścianą, ale ta kolizja potrzebuje tylko *różnic* między prostokątem ikonki a prostokątem nagłówka — a że oba elementy przesuwają się przy scrollu identycznie, różnice są niezmiennikami. Mierzymy je więc raz (`measureWall`) i przeliczamy dopiero przy zmianie rozmiaru: przez `resize`, `orientationchange` oraz `ResizeObserver` na nagłówku, który łapie podmianę fontu i zmianę trybu. Dodatkowo `IntersectionObserver` odpina nasłuch scrolla, gdy hero zjedzie z ekranu — bez tego przewijanie mapy czy stopki płaciło pełny koszt animacji, której nie widać.

To jednak nie wystarczyło i warto wiedzieć dlaczego, zanim ktoś zacznie optymalizować ten handler po raz kolejny: **na iOS problemem nie jest koszt, tylko opóźnienie**. Strona przewija się tam na wątku kompozytora, a `scroll` i `requestAnimationFrame` chodzą na głównym i docierają już po tym, jak użytkownik zobaczył nową pozycję strony. Ikonki wloką się więc za treścią o klatkę lub więcej niezależnie od tego, jak tani jest handler — a po wyrzuceniu odczytów layoutu jest on już praktycznie pusty. Dlatego na urządzeniach bez myszy (`hover: none` lub `pointer: coarse`) scroll w ogóle nie steruje ikonkami: dostają jednorazowo transform policzony dla `y = 0` i zostaje samo unoszenie z CSS, które chodzi na kompozytorze. W trakcie przewijania nie wykonuje się tam ani jedna linijka JS, więc nie ma czego opóźniać. Parallax żyje dalej tam, gdzie działał dobrze — na wskaźniku precyzyjnym. Warunek jest sumą dwóch pytań, bo samo `pointer: coarse` zostawiłoby na ścieżce JS urządzenia raportujące `pointer: none`.

Cienie są celowo krótkie: o wrażeniu ciężkości decyduje **promień rozmycia**, nie alfa. Próba odchudzenia samą alfą została przeprowadzona i była na ekranie nie do wychwycenia — cień pozostawał tą samą szeroką chmurą, tylko bledszą. Obecne wartości to przesunięcia 1–2 px i rozmycia 2–6 px; zasięg przyciemnienia przy krawędzi karty wynosi ok. 6 px. Jeżeli cienie mają być mocniejsze lub słabsze, zaczynaj od promienia.

Mapy (`PolandMap`, `WarszawaDzielniceMap`) mają wspólny wygląd w `src/lib/mapStyle.ts` — kolory SVG nie mogą iść przez tokeny Tailwinda, więc siedzą tam, a nie w `globals.css`. Wyjątkiem jest tło ramki: to zwykły element HTML, więc bierze `--color-sea` przez klasę `bg-sea`. Powiaty są białe i to właśnie różnica względem tego tokenu rysuje sylwetkę kraju — przy zmianie jednego przelicz drugi.

Granice powiatów rysowane są z `vector-effect="non-scaling-stroke"` i to nie jest ozdobnik. Bez tego `strokeWidth` jest skalowany razem z viewBoxem (800 jednostek), więc na telefonie o szerokości ~370 px grubość 0,4 schodziła do 0,18 px i cała mapa zlewała się w plamę. Z `non-scaling-stroke` wartość oznacza piksele CSS na każdej szerokości ekranu. Kształty mapy dostają `tabIndex={-1}`. `react-simple-maps` ustawia domyślnie `0`, przez co mapa Polski wstawiała **380 przystanków klawisza Tab** — przejście z pola tablicy do stopki wymagało przeklikania wszystkich powiatów. W zamian użytkownik klawiatury nie dostawał nic, bo dymek z nazwą pokazuje się na `onPointerEnter` (tylko mysz) i na kliknięciu, więc sam fokus przesuwał jedynie podświetlenie. Mapa jako całość ma `role="img"` i `aria-label`, więc czytnik ekranu dalej ją zapowiada. Zmierzone na stronie głównej: 389 przystanków Tab przed zmianą, 9 po.

Podświetlony kształt wyróżnia się wypełnieniem i grubszym konturem — ale kontur jest w tym samym szarym co zwykłe granice, bo poza wypełnieniem nie wprowadzamy drugiego koloru, i z tego samego powodu podświetlenie nie ma żadnego `filter`. Towarzyszą temu dwie rzeczy, które wyglądają na detal, a bez których podświetlenie się rozpada: `paint-order: stroke fill`, bo stroke w SVG jest wyśrodkowany na ścieżce i przy grubości 2 px zjada całe wypełnienie małego powiatu (zmierzone na Wałbrzychu: z 238 niebieskich pikseli zostawały 3), oraz przestawienie kształtu na koniec listy (`highlightedLast`), bo SVG rysuje w kolejności dokumentu i sąsiad zamalowałby mu grubszą krawędź.

Rozróżnienie dwóch światów aplikacji — tablicy i powiatu — niesie wypełniony kolorem segment przełącznika trybu (`ModeToggle`): niebieski dla tablic, zielony dla powiatów i dzielnic. Sama karta jest neutralna.

Serwis ma jeden motyw jasny — nie ma przełącznika trybu ciemnego. Kontrast tekstu jest weryfikowany względem WCAG AA; przy zmianie kolorów trzeba to sprawdzić ponownie, bo część odcieni Tailwinda (`blue-600`, `amber-600`, `zinc-500`) nie przechodzi progu na jasnym tle.

## Źródła danych i atrybucja

- **Kody tablic → powiat → województwo** (`src/data/powiaty.ts`): transkrybowane programowo z [Wikiźródeł — „Polskie tablice rejestracyjne"](https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne), zweryfikowane krzyżowo z listą 380 powiatów z pliku granic oraz z [Wikipedią — „Tablice rejestracyjne w Polsce"](https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce) dla przypadków brzegowych. Dwa kody (powiat nidzicki, powiat lidzbarski), których zabrakło w tabeli źródłowej, zostały potwierdzone bezpośrednio w infoboksach stron tych powiatów na Wikipedii.
- **Granice powiatów** (`public/data/powiaty-boundaries.json`): [ppatrzyk/polska-geojson](https://github.com/ppatrzyk/polska-geojson) (licencja MIT).
- **Granice dzielnic Warszawy** (`public/data/warszawa-dzielnice-boundaries.json`): [OpenStreetMap](https://www.openstreetmap.org) (licencja [ODbL](https://opendatacommons.org/licenses/odbl/)), relacje administracyjne `admin_level=9` pobrane przez Overpass API i uproszczone narzędziem [mapshaper](https://github.com/mbloch/mapshaper).
- **Kod tablicy → dzielnica Warszawy** (`src/data/dzielnice.ts`): tag `vehicle_plate_code` na tych samych relacjach OpenStreetMap, potwierdzony krzyżowo z niezależnymi źródłami motoryzacyjnymi ([wyborkierowcow.pl](https://www.wyborkierowcow.pl/warszawskie-rejestracje-tablice-rejestracyjne-warszawa/), [motoryzacja.interia.pl](https://motoryzacja.interia.pl/porady/news-z-jakiej-dzielnicy-warszawy-jestes-tajemnica-tablicy-rejestr,nId,20356160)) — w przeciwieństwie do reszty danych w projekcie, to mapowanie nie ma potwierdzenia w Wikiźródłach/Wikipedii.
- **Ciekawostki o dzielnicach Warszawy** (`src/data/dzielnice.ts`): po trzy fakty dla każdej z 18 dzielnic, zebrane z serwisów dzielnicowych m.st. Warszawy (`um.warszawa.pl`), polskiej Wikipedii oraz portali historycznych (m.in. [dzieje.pl](https://dzieje.pl), [metro.waw.pl](https://www.metro.waw.pl)), z krzyżową weryfikacją dat, liczb i nazw obiektów w co najmniej dwóch niezależnych źródłach. W przeciwieństwie do ciekawostek powiatowych, zbieranych z bezpośredniej lektury stron Wikipedii, te powstały na podstawie wyszukiwania — fakty niepotwierdzone krzyżowo zostały pominięte, a nie uzupełnione domysłem. Zgodnie z zasadą projektu „nie zmyślaj" żaden fakt nie jest wygenerowany bez źródła.
- **Ciekawostki**: sprawdzone, konkretne fakty dla wszystkich 380 powiatów (`factsVerified: true`), zebrane głównie z polskiej Wikipedii (strony powiatów i miast będących ich siedzibami), z krzyżową weryfikacją dla wątpliwych szczegółów. Zgodnie z zasadą projektu „nie zmyślaj" — żaden fakt nie jest wygenerowany bez źródła.

## Linkowanie wewnętrzne

Stopka (`src/components/SiteFooter.tsx`) siedzi w `layout.tsx`, więc jest na każdej stronie, i to nie jest decyzja estetyczna. Prerenderowany HTML strony głównej nie zawierał wcześniej **ani jednego** odnośnika do treści — linki do powiatów pojawiały się dopiero po wpisaniu tablicy, czyli w kodzie, którego Googlebot nie wykonuje. Jedyną drogą wyszukiwarki do 833 podstron była sitemapa, a ta jest tylko listą i nie przekazuje sygnału ważności. Efekt: blisko 300 adresów ze statusem „wykryta — obecnie niezindeksowana" w Search Console.

Trzy linki w stopce wystarczają, bo listy już istnieją: `/powiat` prowadzi do 380 stron, `/tablica` do 425, `/dzielnica` do 18. Googlebot dochodzi do dowolnej podstrony w dwóch skokach, a z każdej podstrony wraca do huba. Jeżeli będziesz przebudowywać layout, sprawdź licznik odnośników w zbudowanym HTML (`grep -o 'href="/[a-z]' .next/server/app/index.html | wc -l`) — powinien być większy od zera.

## Search Console

Dwa wpisy z raportu indeksowania mają w repozytorium ślad, bo obie decyzje łatwo cofnąć przez pomyłkę.

**Grafika Open Graph nie jest stroną.** Trasa `/opengraph-image` jest wskazywana przez `og:image` na każdej podstronie, więc Googlebot na nią trafia, ocenia jak kandydata na stronę i odrzuca — w Search Console wychodziła jako „zeskanowana, ale jeszcze nie zindeksowana". Dostaje więc nagłówek `X-Robots-Tag: noindex` z `next.config.ts`. Świadomie nie ma dla niej `Disallow` w `robots.ts`: zablokowany adres nie zostałby pobrany, więc Google nigdy nie zobaczyłby samego `noindex`, a Twitterbot respektuje robots.txt, więc karta na X straciłaby obrazek. Adres nadal ma się pobierać — ma tylko nie trafiać do indeksu.

**„Strona zawiera przekierowanie" dla wariantów http i www to nie jest usterka.** Kanoniczny jest goły apex (`SITE_URL` w `src/lib/site.ts`), a `http://skadrejestracja.com/`, `http://www.skadrejestracja.com/` i `https://www.skadrejestracja.com/` mają na niego przekierowywać i będą to robić zawsze. Klikanie „weryfikuj poprawkę" dla tego raportu kończy się niepowodzeniem z definicji — w kodzie nie ma tu nic do zrobienia.

Trzecia rzecz wyszła przy okazji i nie widać jej w żadnym raporcie: **scalanie metadanych w Next jest płytkie**. Podstrona, która ustawi własny `title` i `description`, ale nie ustawi bloku `openGraph`, dziedziczy z `layout.tsx` cały blok rodzica — razem z `og:url`. Wszystkie 827 podstron miały więc w podglądzie udostępniania tytuł, opis i adres strony głównej, sprzeczne z ich własnym `canonical`. Stąd `pageMetadata` w `src/lib/metadata.ts`: jedno miejsce, które z tytułu, opisu i ścieżki składa komplet `canonical` + `openGraph` + `twitter`. Blok trzeba podawać w całości (`type`, `locale`, `siteName`, obrazek), bo nadpisuje rodzica — a obrazek jest tu najłatwiejszy do zgubienia: konwencja plikowa `opengraph-image.tsx` dokłada `og:image` tylko do metadanych z layoutu, więc pierwsza wersja tej zmiany zbudowała 827 podstron bez `og:image` (złapane na zbudowanym HTML-u, przed wdrożeniem). Dlatego adres i wymiary siedzą w `src/lib/og.ts`, wspólnym dla helpera i samej trasy obrazka. Sufiks tytułu (`| Skąd ta rejestracja?`) helper dokleja ręcznie, bo `title.template` z layoutu działa tylko na `<title>` i nie dotyczy `openGraph.title`.

Przy zmianie metadanych sprawdzaj to na zbudowanym HTML-u, nie w kodzie — rozjazd widać dopiero po scaleniu: `grep -o '<meta property="og:url"[^>]*>' .next/server/app/powiat/augustowski.html` ma pokazywać adres tej podstrony, a nie strony głównej.

## Znane ograniczenia

- Działa tylko dla Polski — selektor kraju jest przygotowany pod rozszerzenie, ale nie ma jeszcze logiki dla innych krajów.
- Tryb odwrotny nie zna miast będących siedzibami powiatów ziemskich, jeśli miasto samo nie jest osobnym powiatem grodzkim (np. „Mińsk Mazowiecki" nie trafi „powiatu mińskiego") — dane nie zawierają pola „siedziba", a dopisywanie takiego mapowania na podstawie zgadywania nazw byłoby sprzeczne z zasadą projektu, by nie zmyślać danych.
- Kilka par powiatów ziemskich ma identyczną nazwę w różnych województwach (np. dwa „powiat brzeski"). Tryb odwrotny nie zgaduje wtedy, o który chodzi — pokazuje obie opcje do wyboru z podpowiedzi.
- Kody WW i WX są współdzielone — odpowiednio przez trzy dzielnice (Rembertów, Wilanów, Włochy) i dwie (Wesoła, Żoliborz). Sama tablica nie wskazuje więc jednej dzielnicy i aplikacja nigdzie nie udaje, że jest inaczej: wymienia wszystkie możliwe zamiast wybierać którąkolwiek.
