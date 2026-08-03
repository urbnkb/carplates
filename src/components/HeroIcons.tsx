"use client";

import { useEffect, useRef } from "react";

interface IconPath {
  d: string;
  filled?: boolean;
}

interface Accent {
  paths: IconPath[];
  position: string;
  color: string;
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

/** Clamps a movement so the icon's box can't cross into the header's box (like hitting a wall). */
function clampToWall(iconRect: DOMRect, dx: number, dy: number, wallRect: DOMRect) {
  const left = iconRect.left + dx;
  const right = iconRect.right + dx;
  const top = iconRect.top + dy;
  const bottom = iconRect.bottom + dy;

  const overlapsX = right > wallRect.left - WALL_BUFFER && left < wallRect.right + WALL_BUFFER;
  const overlapsY = bottom > wallRect.top - WALL_BUFFER && top < wallRect.bottom + WALL_BUFFER;

  if (overlapsX && overlapsY && dy > 0) {
    const maxBottom = wallRect.top - WALL_BUFFER;
    if (bottom > maxBottom) {
      dy = Math.max(0, maxBottom - iconRect.bottom);
    }
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

    function apply() {
      const y = window.scrollY;
      const wallRect = header?.getBoundingClientRect();
      refs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = ACCENTS[i];
        if (reduceMotion) {
          el.style.transform = `rotate(${cfg.baseRotate}deg)`;
          return;
        }
        let drift = y * cfg.scrollFactor;
        const sway = Math.sin(y / 90 + cfg.phase) * cfg.swayAmplitude;
        const tilt = cfg.baseRotate + Math.sin(y / 130 + cfg.phase) * cfg.tiltAmplitude;

        if (cfg.blockOnHeader && wallRect) {
          const outerEl = outerRefs.current[i];
          if (outerEl) {
            drift = clampToWall(outerEl.getBoundingClientRect(), sway, drift, wallRect);
          }
        }

        el.style.transform = `translate(${sway}px, ${drift}px) rotate(${tilt}deg)`;
      });
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

    apply();
    if (!reduceMotion) window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
              className={`neu-raised-sm flex shrink-0 items-center justify-center rounded-full bg-surface ${accent.color} ${accent.size}`}
            >
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
      ))}
    </div>
  );
}
