import { cities, crossings, crossingsForCity, cityOf, type Crossing } from "./crossings";
import { fetchLiveCrossings, primaryLane, laneHasData } from "./cbp";
import { formatMinutes } from "./severity";

export interface AsistenteLink {
  label: string;
  href: string;
}

export interface AsistenteReply {
  reply: string;
  links?: AsistenteLink[];
  suggestions?: string[];
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9ñ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CROSSING_ALIASES: Record<string, string[]> = {
  "puente-libre": ["puente libre", "libre", "bota", "bridge of the americas", "de las americas"],
  "paso-del-norte": ["paso del norte", "pdn"],
  "puente-stanton": ["stanton", "lerdo"],
  "puente-zaragoza": ["zaragoza", "ysleta", "zaragoza ysleta"],
  "san-ysidro": ["san ysidro", "san isidro"],
  cbx: ["cbx", "cross border xpress", "cross border express", "aeropuerto de tijuana"],
  "otay-mesa": ["otay mesa", "otay"],
  "puente-tecate": ["tecate"],
  "calexico-oeste": ["calexico oeste", "calexico west", "puente nuevo"],
  "calexico-este": ["calexico este", "calexico east"],
  "los-algodones": ["algodones", "andrade"],
  "puente-san-luis": ["san luis 1", "san luis i", "puente san luis", "san luis rio colorado"],
  "puente-mariposa": ["mariposa"],
  "puente-deconcini": ["deconcini", "de concini"],
  "puerto-morley": ["morley"],
  "puerto-douglas": ["douglas"],
  "puerto-columbus": ["columbus", "palomas"],
  "puente-eagle-pass-1": ["eagle pass 1", "puente uno", "puente 1 eagle"],
  "puente-eagle-pass-2": ["eagle pass 2", "camino real", "puente dos", "puente 2 eagle"],
  "puente-laredo-1": ["laredo 1", "juarez lincoln", "puente uno laredo", "puente 1 laredo"],
  "puente-laredo-2": ["laredo 2", "convento", "puente 2 laredo", "puerto 2 laredo"],
  "puente-colombia": ["colombia", "solidaridad"],
  "puente-hidalgo": ["hidalgo"],
  "puente-pharr": ["pharr"],
  "puente-anzalduas": ["anzalduas", "anzaluas"],
  "puente-donna": ["donna", "rio bravo"],
  "puente-progreso": ["progreso"],
  "puente-roma": ["roma", "miguel aleman"],
  "puente-camargo": ["camargo"],
  "puente-gateway": ["gateway"],
  "puente-bm": ["b y m", "by m", "veteranos"],
  "puente-veterans": ["veterans", "libre matamoros", "puente libre de matamoros"],
  "puente-los-indios": ["los indios", "indios"],
  "puente-presidio": ["presidio", "ojinaga"],
};

const CITY_ALIASES: Record<string, string[]> = {
  "ciudad-juarez": ["ciudad juarez", "cd juarez", "juarez", "el paso"],
  tijuana: ["tijuana", "tj", "san diego"],
  reynosa: ["reynosa", "mcallen"],
  "nuevo-laredo": ["nuevo laredo", "laredo"],
  mexicali: ["mexicali", "calexico"],
  nogales: ["nogales"],
  matamoros: ["matamoros", "brownsville"],
  "piedras-negras": ["piedras negras", "eagle pass"],
  "san-luis-rio-colorado": ["san luis rio colorado", "slrc", "yuma"],
  "san-jeronimo": ["san jeronimo", "santa teresa"],
  guadalupe: ["guadalupe", "tornillo"],
  tecate: ["tecate"],
  "nuevo-progreso": ["nuevo progreso"],
  "ciudad-miguel-aleman": ["ciudad miguel aleman", "miguel aleman", "roma texas"],
  camargo: ["camargo", "rio grande city"],
  "agua-prieta": ["agua prieta"],
  palomas: ["palomas"],
  ojinaga: ["ojinaga", "presidio"],
};

function espera(n: number): string {
  return n >= 60 ? formatMinutes(n) : `${n} min`;
}

function longestMatch(msg: string, aliases: Record<string, string[]>): { key: string; alias: string } | null {
  let best: { key: string; alias: string } | null = null;
  for (const [key, list] of Object.entries(aliases)) {
    for (const alias of list) {
      if (msg.includes(alias) && (!best || alias.length > best.alias.length)) {
        best = { key, alias };
      }
    }
  }
  return best;
}

function describeCrossing(crossing: Crossing, live: Awaited<ReturnType<typeof fetchLiveCrossings>>): AsistenteReply {
  const l = live.get(crossing.slug);
  const city = cityOf(crossing);
  const auto = l ? primaryLane(l, "auto") : null;
  const ped = l ? primaryLane(l, "peaton") : null;
  const parts: string[] = [];

  if (auto && laneHasData(auto)) {
    if (auto.status.toLowerCase().includes("closed")) {
      parts.push("🚗 carriles cerrados");
    } else if (auto.delayMinutes !== null) {
      const lanes = auto.lanesOpen ? ` (${auto.lanesOpen} carriles abiertos)` : "";
      parts.push(`🚗 ${auto.delayMinutes} min${lanes}`);
    }
  }
  if (ped && laneHasData(ped)) {
    if (ped.status.toLowerCase().includes("closed")) {
      parts.push("🚶 cruce peatonal cerrado");
    } else if (ped.delayMinutes !== null) {
      parts.push(`🚶 ${ped.delayMinutes} min`);
    }
  }

  const reply =
    parts.length > 0
      ? `${crossing.name} (${city.name}):\n${parts.join(" · ")}\nHorario: ${l?.hours ?? "consulta el detalle"}.`
      : `${crossing.name}: sin reporte de CBP en este momento. Horario: ${l?.hours ?? "consulta el detalle"}.`;

  return { reply, links: [{ label: `Ver ${crossing.name} completo`, href: `/puente/${crossing.slug}` }] };
}

export async function askAsistente(message: string): Promise<AsistenteReply> {
  const msg = norm(message);

  const peaton = /\b(a pie|peatonal|peaton|caminando|caminar)\b/.test(msg);
  const wantsBest = /\b(mejor|conviene|recomiend|rapido|más rapido|mas rapido|cual .*puente|que puente|donde .*menos)\b/.test(msg);

  const crossingMatch = longestMatch(msg, CROSSING_ALIASES);
  const cityMatch = longestMatch(msg, CITY_ALIASES);
  const live = await fetchLiveCrossings();

  // 1. Puente específico (gana sobre ciudad)
  if (crossingMatch) {
    const crossing = crossings.find((c) => c.slug === crossingMatch.key);
    if (crossing) return describeCrossing(crossing, live);
  }

  // 2. Mejor puente de una ciudad
  if (wantsBest) {
    if (cityMatch) {
      const list = crossingsForCity(cityMatch.key);
      const scored = list
        .map((c) => {
          const lane = primaryLane(live.get(c.slug), peaton ? "peaton" : "auto");
          if (!lane || !laneHasData(lane) || lane.delayMinutes === null) return null;
          if (lane.status.toLowerCase().includes("closed")) return null;
          return { crossing: c, minutes: lane.delayMinutes };
        })
        .filter((x): x is { crossing: Crossing; minutes: number } => x !== null)
        .sort((a, b) => a.minutes - b.minutes);

      const city = cities.find((x) => x.slug === cityMatch.key)!;
      if (scored.length > 0) {
        const best = scored[0];
        const rest = scored
          .slice(1, 4)
          .map((s) => `• ${s.crossing.name}: ${espera(s.minutes)}`)
          .join("\n");
        return {
          reply: `Ahora mismo, en ${city.name} ${peaton ? "a pie" : "en coche"} te conviene el ${best.crossing.name}: ${espera(best.minutes)} de espera.${
            rest ? `\n\nLos demás:\n${rest}` : ""
          }`,
          links: [{ label: `Ver ${best.crossing.name}`, href: `/puente/${best.crossing.slug}` }],
        };
      }
      return {
        reply: `No tengo datos suficientes de los puentes de ${city.name} ahorita. Intenta de nuevo en unos minutos.`,
        links: [{ label: `Ver ${city.name}`, href: `/ciudad/${city.slug}` }],
      };
    }
    return {
      reply: "¿De qué ciudad? Puedo comparar los puentes de cualquier frontera.",
      suggestions: ["Mejor puente de Juárez", "Mejor puente de Tijuana", "Mejor de Reynosa a pie"],
    };
  }

  // 3. Ciudad → resumen de sus puentes
  if (cityMatch) {
    const city = cities.find((x) => x.slug === cityMatch.key)!;
    const list = crossingsForCity(city.slug);
    const lines = list
      .map((c) => {
        const lane = primaryLane(live.get(c.slug), peaton ? "peaton" : "auto");
        const min =
          lane && laneHasData(lane) && lane.delayMinutes !== null && !lane.status.toLowerCase().includes("closed")
            ? espera(lane.delayMinutes)
            : "sin datos";
        return `• ${c.name}: ${min}`;
      })
      .join("\n");
    return {
      reply: `Puentes de ${city.name} ${peaton ? "a pie" : "en coche"}:\n${lines}`,
      links: list.map((c) => ({ label: c.name, href: `/puente/${c.slug}` })),
    };
  }

  // 4. Saludo
  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|que tal|hi)\b/.test(msg)) {
    return {
      reply:
        "¡Hola! Pregúntame cuánto hay en cualquier puente o cuál te conviene. Por ejemplo:\n• «¿Cuánto hay en Zaragoza?»\n• «Mejor puente de Juárez»\n• «Tijuana a pie»",
    };
  }

  // 5. Fallback
  return {
    reply:
      "No entendí, pero puedo ayudarte así:\n• Dime un puente: «¿cuánto hay en Zaragoza?»\n• O una ciudad: «Reynosa»\n• O pide el mejor: «mejor puente de Tijuana»",
    suggestions: ["¿Cuánto hay en Zaragoza?", "Mejor puente de Juárez", "Tijuana a pie"],
  };
}
