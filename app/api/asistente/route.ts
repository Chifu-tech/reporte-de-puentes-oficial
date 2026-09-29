import { NextResponse } from "next/server";
import { askAsistente } from "@/lib/asistente";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string };
    const message = (body.message ?? "").slice(0, 300);
    if (!message.trim()) {
      return NextResponse.json({ ok: false, error: "Mensaje vacío" }, { status: 400 });
    }
    const reply = await askAsistente(message);
    return NextResponse.json({ ok: true, ...reply });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
