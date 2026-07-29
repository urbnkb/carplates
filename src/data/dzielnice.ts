import type { Dzielnica } from "@/types/dzielnica";

/**
 * Kod tablicy przypisany każdej dzielnicy pochodzi z tagu `vehicle_plate_code`
 * na relacjach administracyjnych Warszawy w OpenStreetMap (potwierdzone
 * krzyżowo z niezależnymi źródłami motoryzacyjnymi — patrz README.md).
 */
export const dzielnice: Dzielnica[] = [
  { geoId: 1, nazwa: "Białołęka", kod: "WA" },
  { geoId: 2, nazwa: "Bemowo", kod: "WB" },
  { geoId: 3, nazwa: "Bielany", kod: "WD" },
  { geoId: 4, nazwa: "Mokotów", kod: "WE" },
  { geoId: 5, nazwa: "Praga-Południe", kod: "WF" },
  { geoId: 6, nazwa: "Praga-Północ", kod: "WH" },
  { geoId: 7, nazwa: "Śródmieście", kod: "WI" },
  { geoId: 8, nazwa: "Targówek", kod: "WJ" },
  { geoId: 9, nazwa: "Ursus", kod: "WK" },
  { geoId: 10, nazwa: "Ursynów", kod: "WN" },
  { geoId: 11, nazwa: "Wawer", kod: "WT" },
  { geoId: 12, nazwa: "Ochota", kod: "WU" },
  { geoId: 13, nazwa: "Rembertów", kod: "WW" },
  { geoId: 14, nazwa: "Wilanów", kod: "WW" },
  { geoId: 15, nazwa: "Włochy", kod: "WW" },
  { geoId: 16, nazwa: "Wesoła", kod: "WX" },
  { geoId: 17, nazwa: "Żoliborz", kod: "WX" },
  { geoId: 18, nazwa: "Wola", kod: "WY" },
];
