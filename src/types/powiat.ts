export type Wojewodztwo =
  | "dolnośląskie"
  | "kujawsko-pomorskie"
  | "lubelskie"
  | "lubuskie"
  | "łódzkie"
  | "małopolskie"
  | "mazowieckie"
  | "opolskie"
  | "podkarpackie"
  | "podlaskie"
  | "pomorskie"
  | "śląskie"
  | "świętokrzyskie"
  | "warmińsko-mazurskie"
  | "wielkopolskie"
  | "zachodniopomorskie";

export interface Powiat {
  /** id z pliku granic (public/data/powiaty-boundaries.json), używane do podświetlenia na mapie */
  geoId: number;
  /** pełna nazwa w formie "powiat X", zgodna z properties.nazwa w pliku granic */
  nazwa: string;
  wojewodztwo: Wojewodztwo;
  /** wszystkie prefiksy tablic rejestracyjnych przypisane do tego powiatu */
  kody: string[];
  ciekawostki: [string, string, string];
  /** false = ciekawostki to placeholder "do uzupełnienia", nie zweryfikowane fakty */
  factsVerified: boolean;
}

export interface MatchResult {
  powiat: Powiat;
  matchedCode: string;
}

export interface Suggestion {
  code: string;
  powiat: Powiat;
}
