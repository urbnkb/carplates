import { ImageResponse } from "next/og";

export const alt = "Skąd ta rejestracja? — rozpoznawanie powiatu po tablicy rejestracyjnej";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            height: 110,
            width: 460,
            borderRadius: 14,
            border: "6px solid #000000",
            overflow: "hidden",
            // Odpowiednik utility neu-raised z globals.css — trzymamy te same
            // wartości, żeby grafika OG nie rozjechała się ze stroną.
            boxShadow: "8px 8px 20px rgba(148,163,184,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 60,
              background: "#003399",
            }}
          />
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: 4,
              whiteSpace: "nowrap",
              color: "#000000",
            }}
          >
            PL 12345
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#27272a",
            letterSpacing: -1,
          }}
        >
          Skąd ta rejestracja?
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#52525b" }}>
          Rozpoznawanie powiatu po tablicy rejestracyjnej
        </div>
      </div>
    ),
    { ...size },
  );
}
