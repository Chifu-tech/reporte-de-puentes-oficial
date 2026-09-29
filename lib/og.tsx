import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const COLORS = {
  verde: "#35815e",
  amarillo: "#a8761c",
  rojo: "#c15b4c",
  gris: "#8a857b",
};

export function sevColor(minutes: number | null): string {
  if (minutes === null) return COLORS.gris;
  if (minutes <= 20) return COLORS.verde;
  if (minutes <= 44) return COLORS.amarillo;
  return COLORS.rojo;
}

/** Tarjeta para compartir: título, subtítulo y filas de "nombre — minutos". */
export function ogCard({
  eyebrow,
  title,
  subtitle,
  rows,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  rows: { label: string; minutes: number | null; note?: string }[];
}) {
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
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#2f6b5e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            RP
          </div>
          <div style={{ fontSize: 26, color: "#211f1a", fontWeight: 600, display: "flex" }}>
            <span>Reporte de&nbsp;</span>
            <span style={{ color: "#2f6b5e" }}>Puentes</span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 20,
              fontWeight: 700,
              color: "#2f6b5e",
              border: "2px solid #2f6b5e55",
              borderRadius: 999,
              padding: "6px 18px",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: title.length > 34 ? 56 : 68, fontWeight: 700, color: "#211f1a", letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#5c5850" }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          {rows.slice(0, 4).map((r) => (
            <div
              key={r.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                background: "#ffffff",
                border: "2px solid #e7e2d8",
                borderRadius: 20,
                padding: "18px 22px",
              }}
            >
              <div style={{ fontSize: 22, color: "#5c5850", display: "flex" }}>{r.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 64, fontWeight: 700, color: sevColor(r.minutes) }}>
                  {r.minutes === null ? "—" : r.minutes >= 60 ? `${Math.floor(r.minutes / 60)}h${r.minutes % 60 ? ` ${r.minutes % 60}m` : ""}` : r.minutes}
                </span>
                {r.minutes !== null && r.minutes < 60 && <span style={{ fontSize: 26, color: "#5c5850" }}>min</span>}
              </div>
              {r.note && <div style={{ fontSize: 18, color: "#8a857b", display: "flex" }}>{r.note}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
