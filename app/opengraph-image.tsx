import { ImageResponse } from "next/og";

export const alt = "Reporte de Puentes Oficial — Tiempos de espera en puentes México–Estados Unidos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf8f4",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2f6b5e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            RP
          </div>
          <div style={{ fontSize: 30, color: "#211f1a", fontWeight: 600, display: "flex" }}>
            <span>Reporte de&nbsp;</span>
            <span style={{ color: "#2f6b5e" }}>Puentes</span>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#2f6b5e",
              border: "2px solid #2f6b5e55",
              borderRadius: 999,
              padding: "4px 14px",
              letterSpacing: 3,
            }}
          >
            OFICIAL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#211f1a", letterSpacing: -2 }}>
            ¿Cuál cruce te conviene hoy?
          </div>
          <div style={{ fontSize: 32, color: "#5c5850" }}>
            Tiempos de espera en vivo · En coche o a pie · Frontera México–Estados Unidos
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 90 }}>
          {[38, 62, 30, 74, 46, 58, 26, 66, 40, 30, 52, 34, 60, 28, 44, 56, 36, 70, 32, 48].map(
            (h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: h,
                  borderRadius: 6,
                  background: h > 60 ? "#c15b4c" : h > 44 ? "#a8761c" : "#35815e",
                }}
              />
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
