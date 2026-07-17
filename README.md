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

## Źródła danych i atrybucja

- **Kody tablic → powiat → województwo** (`src/data/powiaty.ts`): transkrybowane programowo z [Wikiźródeł — „Polskie tablice rejestracyjne"](https://pl.wikisource.org/wiki/Polskie_tablice_rejestracyjne), zweryfikowane krzyżowo z listą 380 powiatów z pliku granic oraz z [Wikipedią — „Tablice rejestracyjne w Polsce"](https://pl.wikipedia.org/wiki/Tablice_rejestracyjne_w_Polsce) dla przypadków brzegowych. Dwa kody (powiat nidzicki, powiat lidzbarski), których zabrakło w tabeli źródłowej, zostały potwierdzone bezpośrednio w infoboksach stron tych powiatów na Wikipedii.
- **Granice powiatów** (`public/data/powiaty-boundaries.json`): [ppatrzyk/polska-geojson](https://github.com/ppatrzyk/polska-geojson) (licencja MIT).
- **Ciekawostki**: sprawdzone, konkretne fakty dla wszystkich 380 powiatów (`factsVerified: true`), zebrane głównie z polskiej Wikipedii (strony powiatów i miast będących ich siedzibami), z krzyżową weryfikacją dla wątpliwych szczegółów. Zgodnie z zasadą projektu „nie zmyślaj" — żaden fakt nie jest wygenerowany bez źródła.

## Znane ograniczenia

- Działa tylko dla Polski — selektor kraju jest przygotowany pod rozszerzenie, ale nie ma jeszcze logiki dla innych krajów.
- Tryb odwrotny nie zna miast będących siedzibami powiatów ziemskich, jeśli miasto samo nie jest osobnym powiatem grodzkim (np. „Mińsk Mazowiecki" nie trafi „powiatu mińskiego") — dane nie zawierają pola „siedziba", a dopisywanie takiego mapowania na podstawie zgadywania nazw byłoby sprzeczne z zasadą projektu, by nie zmyślać danych.
- Kilka par powiatów ziemskich ma identyczną nazwę w różnych województwach (np. dwa „powiat brzeski"). Tryb odwrotny nie zgaduje wtedy, o który chodzi — pokazuje obie opcje do wyboru z podpowiedzi.
