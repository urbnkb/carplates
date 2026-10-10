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
    // Ujemny: kompas siedzi nad nagłówkiem, więc dryfuje w górę, od tekstu.
    scrollFactor: -0.11,
    swayAmplitude: 6,
    tiltAmplitude: 9,
    phase: 2.7,
    floatDelay: 1.1,
    floatDuration: 4.8,
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

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector<HTMLElement>("[data-hero-header]");

    if (reduceMotion) {
      refs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotate(${ACCENTS[i].baseRotate}deg)`;
      });
      return;
    }

    // Sama arytmetyka — ani jednego odczytu layoutu. Pozycja scrolla przychodzi
    // argumentem, bo ścieżka dotykowa woła to raz dla y = 0.
    function apply(y: number) {
      for (let i = 0; i < ACCENTS.length; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const cfg = ACCENTS[i];
        const sway = Math.sin(y / 90 + cfg.phase) * cfg.swayAmplitude;
        const tilt = cfg.baseRotate + Math.sin(y / 130 + cfg.phase) * cfg.tiltAmplitude;
        const drift = y * cfg.scrollFactor;
        el.style.transform = `translate(${sway}px, ${drift}px) rotate(${tilt}deg)`;
      }
    }

    // Na dotyku scroll nie steruje niczym. Na iOS strona przewija się na wątku
    // kompozytora, a scroll i requestAnimationFrame chodzą na głównym i docierają
    // z opóźnieniem względem tego, co użytkownik już widzi — ikonki wloką się za
    // stroną niezależnie od tego, jak tani jest handler. To opóźnienie, nie koszt,
    // więc jedyne skuteczne wyjście to nie mieć tu JS-u w ogóle. Zostaje unoszenie
    // z CSS, które chodzi na kompozytorze i o scrollu nic nie wie.
    //
    // apply(0), a nie samo rotate: ikonki mają zostać dokładnie tam, gdzie siedzą
    // dziś na górze strony, z kołysaniem i przechyłem policzonym dla y = 0.
    //
    // Warunek jest sumą dwóch pytań, bo samo `pointer: coarse` zostawiłoby na
    // ścieżce JS urządzenia raportujące `pointer: none` — a te też nie są myszą.
    // Mysz odpowiada `hover: hover` i `pointer: fine`, więc parallax zostaje tam,
    // gdzie działał dobrze.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      apply(0);
      return;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply(window.scrollY);
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

    // Transform siada od razu — bez tego ikonki mają jedną klatkę bez
    // transformu i widocznie podskakują przy wczytaniu.
    apply(window.scrollY);

    // Poza kadrem nie ma po co liczyć niczego: strona główna jest długa,
    // a bez tego każde przewinięcie przy mapie czy stopce płaciło pełny koszt.
    const visibility = header
      ? new IntersectionObserver(
          ([entry]) => {
            listen(entry.isIntersecting);
            if (entry.isIntersecting) apply(window.scrollY);
          },
          { rootMargin: "200px" },
        )
      : null;
    if (visibility && header) visibility.observe(header);
    else listen(true);

    return () => {
      listen(false);
      visibility?.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true">
      {ACCENTS.map((accent, i) => (
        <div key={i} className={`pointer-events-none absolute block ${accent.position}`}>
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
