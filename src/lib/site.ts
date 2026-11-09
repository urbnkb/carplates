export const SITE_URL = "https://skadrejestracja.com";
export const SITE_NAME = "Skąd ta rejestracja?";
export const WEBSITE_ID = `${SITE_URL}/#website`;

// ponytail: data wpisana ręcznie — podbij ją przy każdej zmianie danych lub treści stron.
export const DATA_UPDATED = { iso: "2026-11-09", label: "9 listopada 2026" } as const;

/**
 * Jedno źródło prawdy o grafice Open Graph. Trasę i wymiary trzeba podać jawnie
 * w metadanych każdej podstrony: konwencja plikowa `opengraph-image.tsx` dokłada
 * obrazek tylko do bloku `openGraph` z layoutu, a podstrona ustawiająca własny
 * blok nadpisuje go w całości — razem z obrazkiem.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "Skąd ta rejestracja? — rozpoznawanie powiatu po tablicy rejestracyjnej",
} as const;
