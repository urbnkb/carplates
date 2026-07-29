export interface Dzielnica {
  /** id z pliku granic (public/data/warszawa-dzielnice-boundaries.json) */
  geoId: number;
  nazwa: string;
  /** kod tablicy Warszawy — współdzielony przez kilka dzielnic dla WW i WX */
  kod: string;
}
