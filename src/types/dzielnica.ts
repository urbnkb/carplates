export interface Dzielnica {
  /** id z pliku granic (public/data/warszawa-dzielnice-boundaries.json) */
  geoId: number;
  nazwa: string;
  /** kod tablicy Warszawy — współdzielony przez kilka dzielnic dla WW i WX */
  kod: string;
  /**
   * Zwykle trzy fakty, tak jak dla powiatów. Lista bywa krótsza lub pusta —
   * zgodnie z zasadą projektu „nie zmyślaj" wolimy nie pokazać nic, niż
   * dopisać fakt bez źródła.
   */
  ciekawostki: readonly string[];
  factsVerified: boolean;
}
