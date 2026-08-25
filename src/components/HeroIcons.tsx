"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface IconPath {
  d: string;
  filled?: boolean;
}

interface Accent {
  paths: IconPath[];
  position: string;
  color: string;
  /** Krańce gradientu na obwolutce; jaśniejszy odcień idzie w lewy górny róg. */
  ringFrom: string;
  ringTo: string;
  /** Tint pod spodem kółka — odcień 50 tej samej barwy. Musi być nieprzezroczysty. */
  ringTint: string;
  size: string;
  baseRotate: number;
  scrollFactor: number;
  swayAmplitude: number;
  tiltAmplitude: number;
  phase: number;
  floatDelay: number;
  floatDuration: number;
  /** Treats the header text as a solid wall it can't drift into. */
  blockOnHeader?: boolean;
}

const WALL_BUFFER = 14;

/**
 * Granice ruchu ikonki względem nagłówka, który traktujemy jak ścianę.
 *
 * Wszystkie cztery liczby to RÓŻNICE między prostokątem ikonki a prostokątem
 * nagłówka. Oba elementy leżą w tym samym przewijanym przepływie, więc przy
 * scrollu przesuwają się identycznie i te różnice się nie zmieniają — dlatego
 * wolno je zmierzyć raz i używać w każdej klatce.
 *
 * To nie jest mikrooptymalizacja. Wcześniej pętla scrolla wołała
 * `getBoundingClientRect()` na nagłówku i na ikonce, przy czym ten drugi odczyt
 * następował po zapisaniu transformów wcześniejszych ikonek — czyli układ
 * zapis → odczyt → zapis, wymuszający synchroniczny reflow w każdej klatce.
 * Na stronie z mapą o 380 ścieżkach to był główny koszt przewijania na telefonie.
 */
interface WallLimits {
  /** Ikonka zachodzi na ścianę w poziomie, gdy dx mieści się między nimi. */
  dxMin: number;
  dxMax: number;
  /** Analogicznie w pionie; dyMin jest zarazem wartością, do której przycinamy. */
  dyMin: number;
  dyMax: number;
}

function measureWall(iconRect: DOMRect, wallRect: DOMRect): WallLimits {
  return {
    dxMin: wallRect.left - WALL_BUFFER - iconRect.right,
    dxMax: wallRect.right + WALL_BUFFER - iconRect.left,
    dyMin: wallRect.top - WALL_BUFFER - iconRect.bottom,
    dyMax: wallRect.bottom + WALL_BUFFER - iconRect.top,
  };
}

/** Przycina przesunięcie w pionie tak, żeby ikonka nie weszła w nagłówek. */
function clampToWall(limits: WallLimits, dx: number, dy: number) {
  const overlapsX = dx > limits.dxMin && dx < limits.dxMax;
  const overlapsY = dy > limits.dyMin && dy < limits.dyMax;

  if (overlapsX && overlapsY && dy > 0) {
    return Math.max(0, limits.dyMin);
  }
  return dy;
}

const CAR_PATHS: IconPath[] = [
  {
    d: "M4 16.5 5.2 12a2 2 0 0 1 1.9-1.4h9.8a2 2 0 0 1 1.9 1.4l1.2 4.5M4 16.5v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M4 16.5h16M7 13.5h.01M17 13.5h.01",
  },
];

const PIN_PATHS: IconPath[] = [
  {
    d: "M12 21s-6.5-5.2-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.8 12 21 12 21Zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
];

const FLAG_PATHS: IconPath[] = [
  { d: "M6 3v18" },
  { d: "M6 4.2 15 8 6 11.8Z", filled: true },
];

const SEARCH_PATHS: IconPath[] = [
  { d: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 17-4.35-4.35" },
];

const COMPASS_PATHS: IconPath[] = [
  { d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" },
  { d: "M12 7.2 14 12 12 16.8 10 12Z", filled: true },
];

const ACCENTS: Accent[] = [
  {
    paths: CAR_PATHS,
    position: "-top-6 -left-3 sm:-top-8 sm:-left-6 lg:-top-10 lg:-left-14",
    color: "text-blue-600",
    ringFrom: "#60a5fa",
    ringTo: "#2563eb",
    ringTint: "#eff6ff",
    size: "h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10",
    baseRotate: -14,
    scrollFactor: 0.08,
    swayAmplitude: 8,
    tiltAmplitude: 5,
    phase: 0,
    floatDelay: 0,
    floatDuration: 4.2,
  },
  {
    paths: FLAG_PATHS,
    position: "top-12 -left-4 sm:top-16 sm:-left-8 lg:top-20 lg:-left-24",
    color: "text-red-600",
    ringFrom: "#f87171",
    ringTo: "#dc2626",
    ringTint: "#fef2f2",
    size: "h-7 w-7 sm:h-8 sm:w-8",
    baseRotate: 9,
    scrollFactor: -0.05,
    swayAmplitude: 10,
    tiltAmplitude: 7,
    phase: 1.4,
    floatDelay: 0.6,
    floatDuration: 3.6,
  },
  {
    paths: COMPASS_PATHS,
    position: "-top-8 left-3 sm:-top-12 sm:left-5 lg:-top-20 lg:left-12",
    color: "text-sky-600",
    ringFrom: "#38bdf8",
    ringTo: "#0284c7",
    ringTint: "#f0f9ff",
    size: "h-6 w-6 sm:h-7 sm:w-7",
    baseRotate: -6,
    scrollFactor: 0.11,
    swayAmplitude: 6,
    tiltAmplitude: 9,
    phase: 2.7,
    floatDelay: 1.1,
    floatDuration: 4.8,
    blockOnHeader: true,
  },
  {
    paths: PIN_PATHS,
    position: "-top-3 -right-3 sm:-top-4 sm:-right-6 lg:-top-6 lg:-right-16",
    color: "text-emerald-700",
    ringFrom: "#34d399",
    ringTo: "#047857",
    ringTint: "#ecfdf5",
    size: "h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9",
    baseRotate: 12,
    scrollFactor: -0.07,
    swayAmplitude: 9,
    tiltAmplitude: 6,
    phase: 0.8,
    floatDelay: 1.6,
    floatDuration: 4,
  },
  {
    paths: SEARCH_PATHS,
    position: "top-14 -right-3 sm:top-16 sm:-right-5 lg:top-24 lg:-right-8",
    color: "text-amber-600",
    ringFrom: "#fbbf24",
    ringTo: "#d97706",
    ringTint: "#fffbeb",
    size: "h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11",
    baseRotate: -16,
    scrollFactor: 0.06,
    swayAmplitude: 11,
    tiltAmplitude: 5,
    phase: 2.1,
    floatDelay: 0.3,
    floatDuration: 5.2,
  },
];

export default function HeroIcons() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector<HTMLElement>("[data-hero-header]");

    if (reduceMotion) {
      refs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotate(${ACCENTS[i].baseRotate}deg)`;
      });
      return;
    }

    // Granice ściany per akcent, mierzone poza pętlą scrolla. null = akcent
    // nie zderza się z nagłówkiem i nie potrzebuje przycinania.
    const limits: (WallLimits | null)[] = ACCENTS.map(() => null);

    function measure() {
      if (!header) return;
      const wallRect = header.getBoundingClientRect();
      ACCENTS.forEach((cfg, i) => {
        const outerEl = outerRefs.current[i];
        limits[i] = cfg.blockOnHeader && outerEl ? measureWall(outerEl.getBoundingClientRect(), wallRect) : null;
      });
    }

    // Sama arytmetyka — ani jednego odczytu layoutu.
    function apply() {
      const y = window.scrollY;
      for (let i = 0; i < ACCENTS.length; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const cfg = ACCENTS[i];
        const sway = Math.sin(y / 90 + cfg.phase) * cfg.swayAmplitude;
        const tilt = cfg.baseRotate + Math.sin(y / 130 + cfg.phase) * cfg.tiltAmplitude;
        const lim = limits[i];
        let drift = y * cfg.scrollFactor;
        if (lim) drift = clampToWall(lim, sway, drift);
        el.style.transform = `translate(${sway}px, ${drift}px) rotate(${tilt}deg)`;
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    }

    let listening = false;
    function listen(on: boolean) {
      if (on === listening) return;
      listening = on;
      if (on) window.addEventListener("scroll", onScroll, { passive: true });
      else window.removeEventListener("scroll", onScroll);
    }

    function remeasure() {
      measure();
      apply();
    }

    const frame = requestAnimationFrame(remeasure);

    // Poza kadrem nie ma po co liczyć niczego: strona główna jest długa,
    // a bez tego każde przewinięcie przy mapie czy stopce płaciło pełny koszt.
    const visibility = header
      ? new IntersectionObserver(
          ([entry]) => {
            listen(entry.isIntersecting);
            if (entry.isIntersecting) apply();
          },
          { rootMargin: "200px" },
        )
      : null;
    if (visibility && header) visibility.observe(header);
    else listen(true);

    // Nagłówek przesuwa się przy podmianie fontu przez next/font i przy zmianie
    // trybu — ma wtedy inny tekst. Jedno i drugie widać jako zmianę rozmiaru.
    const headerSize = header ? new ResizeObserver(remeasure) : null;
    if (headerSize && header) headerSize.observe(header);

    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);

    return () => {
      cancelAnimationFrame(frame);
      listen(false);
      visibility?.disconnect();
      headerSize?.disconnect();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
    };
  }, []);

  return (
    <div aria-hidden="true">
      {ACCENTS.map((accent, i) => (
        <div
          key={i}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
          className={`pointer-events-none absolute block ${accent.position}`}
        >
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="animate-icon-float"
            style={{ animationDelay: `${accent.floatDelay}s`, animationDuration: `${accent.floatDuration}s` }}
          >
            <div
              className={`hero-accent neu-raised-sm shrink-0 rounded-full ${accent.color} ${accent.size}`}
              style={
                {
                  "--accent-ring-from": accent.ringFrom,
                  "--accent-ring-to": accent.ringTo,
                  "--accent-ring-tint": accent.ringTint,
                } as CSSProperties
              }
            >
              <div className="hero-accent-face flex h-full w-full items-center justify-center rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-1/2 w-1/2"
                >
                  {accent.paths.map((p, j) => (
                    <path key={j} d={p.d} fill={p.filled ? "currentColor" : "none"} stroke={p.filled ? "none" : "currentColor"} />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
