import { site } from "@/lib/site";

export const dynamic = "force-static";

/** ads.txt de AdSense, generado a partir de NEXT_PUBLIC_ADSENSE_CLIENT. */
export function GET() {
  const pub = site.ads.client.replace(/^ca-/, "");
  if (!pub) return new Response("Not found", { status: 404 });
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
