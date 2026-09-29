"use client";

import { useEffect, useRef, useState } from "react";
import type { CameraSource } from "@/lib/crossings";

function HlsPlayer({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (cancelled) return;
          if (Hls.isSupported()) {
            const inst = new Hls({ enableWorker: true, lowLatencyMode: false });
            inst.loadSource(src);
            inst.attachMedia(video);
            inst.on(Hls.Events.ERROR, (_e, data) => {
              if (data.fatal) {
                setFailed(true);
                inst.destroy();
              }
            });
            hls = inst;
          } else {
            setFailed(true);
          }
        })
        .catch(() => setFailed(true));
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  if (failed) return <CameraFallback label={label} />;

  return (
    <video
      ref={videoRef}
      controls
      muted
      playsInline
      autoPlay
      aria-label={`Cámara en vivo: ${label}`}
      className="aspect-video w-full rounded-xl bg-ink object-cover"
    />
  );
}

function CameraFallback({ label }: { label: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-xl border border-line-soft bg-bone text-center">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span className="text-xs text-ink-faint">Cámara no disponible en este momento</span>
    </div>
  );
}

export default function CameraPlayer({ camera }: { camera: CameraSource }) {
  const [started, setStarted] = useState(camera.type !== "hls");

  if (camera.type === "hls") {
    return (
      <figure>
        {started ? (
          <HlsPlayer src={camera.src} label={camera.label} />
        ) : (
          <button
            onClick={() => setStarted(true)}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-line bg-sage-soft transition-colors hover:bg-sage/15"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-white" aria-hidden>
              ▶
            </span>
            <span className="text-[13px] font-semibold text-sage-ink">Ver cámara: {camera.label}</span>
          </button>
        )}
        <figcaption className="mt-1.5 text-center text-[11.5px] text-ink-faint">{camera.label}</figcaption>
      </figure>
    );
  }

  if (camera.type === "youtube") {
    return (
      <figure>
        <iframe
          src={`https://www.youtube.com/embed/${camera.src}?mute=1&rel=0`}
          title={`Cámara en vivo: ${camera.label}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full rounded-xl border border-line-soft"
        />
        <figcaption className="mt-1.5 text-center text-[11.5px] text-ink-faint">{camera.label}</figcaption>
      </figure>
    );
  }

  return (
    <figure>
      <iframe
        src={camera.src}
        title={`Cámara en vivo: ${camera.label}`}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-xl border border-line-soft"
      />
      <figcaption className="mt-1.5 text-center text-[11.5px] text-ink-faint">{camera.label}</figcaption>
    </figure>
  );
}
