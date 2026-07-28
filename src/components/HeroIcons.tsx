const CAR_PATH =
  "M4 16.5 5.2 12a2 2 0 0 1 1.9-1.4h9.8a2 2 0 0 1 1.9 1.4l1.2 4.5M4 16.5v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M4 16.5h16M7 13.5h.01M17 13.5h.01";

const PIN_PATH =
  "M12 21s-6.5-5.2-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.8 12 21 12 21Zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z";

interface AccentProps {
  path: string;
  className: string;
}

function Accent({ path, className }: AccentProps) {
  return (
    <div
      className={`pointer-events-none absolute hidden h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-sm lg:flex dark:bg-zinc-900 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d={path} />
      </svg>
    </div>
  );
}

export default function HeroIcons() {
  return (
    <div aria-hidden="true">
      <Accent
        path={CAR_PATH}
        className="-left-16 top-1 -rotate-6 border-blue-500 text-blue-600 dark:text-blue-400"
      />
      <Accent
        path={PIN_PATH}
        className="-right-16 top-1 rotate-6 border-emerald-600 text-emerald-700 dark:text-emerald-400"
      />
    </div>
  );
}
