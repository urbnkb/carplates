import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Nonce-based CSP would require opting every page into dynamic rendering
// (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md),
// which isn't worth it for this fully static, no-backend app. `unsafe-inline`
// on script-src is required for Next's own inline RSC/hydration payloads.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

// `experimental.viewTransition` zniknęło w Next 16.3 — <ViewTransition> z Reacta
// działa w App Routerze bez żadnej konfiguracji
// (node_modules/next/dist/docs/01-app/02-guides/view-transitions.md).
// Flaga została tylko usunięta; przejścia na stronie głównej zostają.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
};

export default nextConfig;
