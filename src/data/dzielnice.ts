import type { Dzielnica } from "@/types/dzielnica";

/**
 * Kod tablicy przypisany każdej dzielnicy pochodzi z tagu `vehicle_plate_code`
 * na relacjach administracyjnych Warszawy w OpenStreetMap (potwierdzone
 * krzyżowo z niezależnymi źródłami motoryzacyjnymi — patrz README.md).
 *
 * Ciekawostki: patrz README.md, sekcja „Źródła danych i atrybucja".
 */
export const dzielnice: Dzielnica[] = [
  { geoId: 1, nazwa: "Białołęka", kod: "WA", ciekawostki: [], factsVerified: false },
  { geoId: 2, nazwa: "Bemowo", kod: "WB", ciekawostki: [], factsVerified: false },
  { geoId: 3, nazwa: "Bielany", kod: "WD", ciekawostki: [], factsVerified: false },
  { geoId: 4, nazwa: "Mokotów", kod: "WE", ciekawostki: [], factsVerified: false },
  { geoId: 5, nazwa: "Praga-Południe", kod: "WF", ciekawostki: [], factsVerified: false },
  { geoId: 6, nazwa: "Praga-Północ", kod: "WH", ciekawostki: [], factsVerified: false },
  { geoId: 7, nazwa: "Śródmieście", kod: "WI", ciekawostki: [], factsVerified: false },
  { geoId: 8, nazwa: "Targówek", kod: "WJ", ciekawostki: [], factsVerified: false },
  { geoId: 9, nazwa: "Ursus", kod: "WK", ciekawostki: [], factsVerified: false },
  { geoId: 10, nazwa: "Ursynów", kod: "WN", ciekawostki: [], factsVerified: false },
  { geoId: 11, nazwa: "Wawer", kod: "WT", ciekawostki: [], factsVerified: false },
  { geoId: 12, nazwa: "Ochota", kod: "WU", ciekawostki: [], factsVerified: false },
  { geoId: 13, nazwa: "Rembertów", kod: "WW", ciekawostki: [], factsVerified: false },
  { geoId: 14, nazwa: "Wilanów", kod: "WW", ciekawostki: [], factsVerified: false },
  { geoId: 15, nazwa: "Włochy", kod: "WW", ciekawostki: [], factsVerified: false },
  { geoId: 16, nazwa: "Wesoła", kod: "WX", ciekawostki: [], factsVerified: false },
  { geoId: 17, nazwa: "Żoliborz", kod: "WX", ciekawostki: [], factsVerified: false },
  { geoId: 18, nazwa: "Wola", kod: "WY", ciekawostki: [], factsVerified: false },
];
