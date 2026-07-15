const STAR_COUNT = 12;
const STAR_RADIUS = 12.5;
const CENTER = 18;

interface EuStarsProps {
  className?: string;
}

export default function EuStars({ className = "h-6 w-6" }: EuStarsProps) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      {Array.from({ length: STAR_COUNT }).map((_, i) => {
        const angle = (i / STAR_COUNT) * 2 * Math.PI - Math.PI / 2;
        // Rounded to avoid SSR/client floating-point mismatches (hydration errors)
        // from tiny last-bit differences in Math.cos/Math.sin across engines.
        const x = Math.round((CENTER + STAR_RADIUS * Math.cos(angle)) * 1000) / 1000;
        const y = Math.round((CENTER + STAR_RADIUS * Math.sin(angle)) * 1000) / 1000;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="7"
            fill="#FFD700"
            textAnchor="middle"
            dominantBaseline="central"
          >
            ★
          </text>
        );
      })}
    </svg>
  );
}
