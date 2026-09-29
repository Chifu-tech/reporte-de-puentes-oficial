"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";

interface ChatLink {
  label: string;
  href: string;
}

interface Msg {
  role: "user" | "bot";
  text: string;
  links?: ChatLink[];
}

const STARTERS = ["¿Cuánto hay en Zaragoza?", "Mejor puente de Juárez", "Tijuana a pie"];

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5c0 4.14-4.03 7.5-9 7.5-1.02 0-2-.14-2.9-.4L4 21l1.4-4.1C3.9 15.6 3 13.65 3 11.5 3 7.36 7.03 4 12 4s9 3.36 9 7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Asistente() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    track("asistente_pregunta", { texto: msg.slice(0, 100) });
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.ok ? data.reply : "Hubo un problema, intenta de nuevo.",
          links: data.links,
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Sin conexión. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir asistente de cruces"
          className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-sage text-white shadow-[0_4px_16px_rgba(47,107,94,0.4)] transition-transform hover:scale-105 active:scale-95"
          style={{ height: 52, width: 52 }}
        >
          <ChatIcon />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Asistente de cruces"
          className="fixed inset-x-3 bottom-3 z-50 flex h-[min(72vh,540px)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl sm:inset-x-auto sm:right-4 sm:w-[380px]"
        >
          <div className="flex items-center justify-between bg-sage px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <div>
                <p className="text-[14px] font-semibold leading-tight">Asistente de cruces</p>
                <p className="text-[11px] text-white/75">Pregunta cuánto hay en cualquier puente</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
              className="rounded-full px-2 py-1 text-lg leading-none text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3.5">
            {messages.length === 0 && (
              <div>
                <p className="mb-3 text-[13px] leading-relaxed text-ink-soft">
                  ¡Hola! Pregúntame por cualquier puente o ciudad de la frontera. Por ejemplo:
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-sage/30 bg-sage-soft px-3 py-1.5 text-[12.5px] font-medium text-sage-ink transition-colors hover:bg-sage/15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-sage text-white"
                      : "rounded-bl-md bg-bone text-ink ring-1 ring-line-soft"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-sage-ink ring-1 ring-sage/25 hover:bg-sage-soft"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-bone px-4 py-3 text-sage-ink ring-1 ring-line-soft">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sage [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line-soft p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Cuánto hay en…?"
              aria-label="Escribe tu pregunta"
              className="flex-1 rounded-full border border-line bg-bone px-4 py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-sage focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-white transition-opacity disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
