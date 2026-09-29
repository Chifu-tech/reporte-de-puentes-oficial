import { NextResponse } from "next/server";
import { fetchLiveCrossings } from "@/lib/cbp";
import { crossings } from "@/lib/crossings";

export const revalidate = 300;

export async function GET() {
  try {
    const live = await fetchLiveCrossings();
    const data = crossings.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameUs: c.nameUs,
      city: c.citySlug,
      portNumber: c.portNumber,
      hours: live.get(c.slug)?.hours ?? null,
      portStatus: live.get(c.slug)?.portStatus ?? null,
      lanes: live.get(c.slug)?.lanes ?? null,
    }));
    return NextResponse.json(
      { ok: true, source: "U.S. Customs and Border Protection", updatedAt: new Date().toISOString(), crossings: data },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error desconocido" },
      { status: 502 }
    );
  }
}
