# Reporte de Puentes Oficial — reportedepuentesoficial.mx

** Producción: https://reportedepuentes-mx.vercel.app (URL temporal hasta conectar el dominio propio)

Tiempos de espera en vivo de todos los puentes fronterizos entre México y Estados Unidos: minutos de espera, carriles abiertos, cruce peatonal, cámaras en vivo (Ciudad Juárez) y la mejor hora para cruzar según promedios históricos.

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Turso (SQLite) · Vercel · GitHub Actions

## Estado actual del despliegue

- ✅ Repo: `Chifu-tech/reporte-de-puentes-oficial` (**público** — Actions gratis ilimitadas)
- ✅ Vercel: proyecto `reportedepuentes-mx` (equipo *Chifu / chifu-master-projects*), **auto-deploy conectado** en cada push a `main`
- ✅ Turso: BD `puentes` creada y conectada (env vars en Vercel)
- ✅ Captura cada 15 min: **n8n de Pablo** (workflow `Reporte de Puentes — Captura Histórica`) — **verificado en producción, corriendo solo desde las 17:45 UTC del 29/sep/2026**
- ✅ Guard anti-duplicados en `/api/cron/snapshot` (múltiples schedulers seguros)
- ✅ launchd de la Mac: **removido** (solo fue puente durante la transición)
- ⚠️ El schedule de GitHub Actions quedó registrado pero NO dispara (billing de la cuenta). No depende de él: si revive, el guard evita dobles capturas.

### Scheduler permanente: n8n ✓ (operando)

El workflow corre en el n8n de Pablo: Schedule cada 15 min → POST al endpoint con el CRON_SECRET.
El JSON para reimportarlo (si se necesita) está en `~/Desktop/n8n-reporte-de-puentes-captura.json` — **no subirlo al repo** (contiene el secreto).

### ⏳ ÚNICO PENDIENTE: comprar el dominio

**`reportedepuentesoficial.mx`** (~$350 MXN/año) — compra planeada para el **sábado**. Verificado disponible en NIC.mx y .com en Verisign al 29/sep/2026.

Cuando esté comprado, conectarlo (10 min):
1. En Vercel: proyecto `reportedepuentes-mx` → Settings → Domains → agregar `reportedepuentesoficial.mx` (+ `www` con redirect)
2. En el registrar: apuntar los registros DNS que Vercel indique
3. Actualizar `NEXT_PUBLIC_SITE_URL` en Vercel a `https://reportedepuentesoficial.mx` y redeploy
4. Enviar `https://reportedepuentesoficial.mx/sitemap.xml` en Google Search Console

Nota: mientras no haya dominio propio, la URL pública es https://reportedepuentes-mx.vercel.app (las URLs de deployment exigen login SSO del equipo Vercel; el dominio propio no).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Sin configurar nada, la base de datos usa un archivo local (`local.db`) para los snapshots históricos.

Para llenar datos de prueba localmente:

```bash
curl -X POST http://localhost:3000/api/cron/snapshot
```

## Variables de entorno

Copia `.env.example` a `.env.local` y llena lo que necesites:

| Variable | Requerida | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí (prod) | URL canónica del sitio (sitemap, OG, JSON-LD) |
| `TURSO_DATABASE_URL` | Sí (prod) | URL de la BD Turso (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Sí (prod) | Token de acceso a Turso |
| `CRON_SECRET` | Sí (prod) | Secreto compartido GitHub Actions ↔ Vercel para `/api/cron/snapshot` |
| `NEXT_PUBLIC_GA_ID` | No | ID de medición de Google Analytics 4 (`G-XXXX`). Vacío = GA apagado |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | No | `ca-pub-XXXX` de AdSense. Con solo ponerlo se cargan el script, la meta `google-adsense-account` y `/ads.txt` (verificación del sitio) |
| `NEXT_PUBLIC_ADS_ENABLED` | No | `true` enciende además los bloques manuales `AdSlot` |

## Despliegue a producción (una sola vez)

### 1. GitHub

1. Crea un repo (ej. `reporte-de-puentes-oficial`) y sube este código.
2. En **Settings → Secrets and variables → Actions**:
   - Secret `CRON_SECRET` = salida de `openssl rand -hex 24`
   - Variable `SITE_URL` = `https://reportedepuentesoficial.mx`

### 2. Turso (base de datos histórica, free tier)

```bash
turso auth login                    # abrirá el navegador (una sola vez)
turso db create puentes
turso db show puentes --url         # → TURSO_DATABASE_URL
turso db tokens create puentes      # → TURSO_AUTH_TOKEN
```

Luego en Vercel (Settings → Environment Variables del proyecto `reportedepuentes-mx`) agrega `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` en Production y haz redeploy. Con eso, el cron de GitHub Actions empieza a llenar el historial solo.

### 3. Vercel

1. Cuenta gratis en vercel.com → **Add New Project** → importa el repo de GitHub.
2. Environment Variables (Production + Preview): las 4 de arriba.
3. Deploy. Verifica `https://<proyecto>.vercel.app`.
4. **Settings → Domains** → agrega `reportedepuentesoficial.mx` y sigue las instrucciones de DNS (apunta el `A`/`CNAME` en tu registrar según Vercel indique). Agrega también `www.reportedepuentesoficial.mx` con redirect.

### 4. Dominio

Compra `reportedepuentesoficial.mx` (verificado disponible en NIC.mx al momento de la planificación) y `reporte-de-puentes-oficial.com` si quieres proteger la marca (~$350 MXN/año el .mx). Conéctalo en Vercel (paso 3.4).

### 5. Google Search Console (SEO)

1. Ve a search.google.com/search-console → agrega la propiedad `reportedepuentesoficial.mx`.
2. Verifica por registro DNS (Vercel también ofrece verificación automática en el dashboard de integraciones).
3. Envía `https://reportedepuentesoficial.mx/sitemap.xml`.
4. Pide indexación de la home.

### 6. Cron de captura histórica

El workflow `.github/workflows/snapshot.yml` corre cada 15 min ya configurado. Solo necesita los secrets del paso 1. Verifícalo en la pestaña **Actions** del repo tras el primer despliegue (puedes dispararlo manualmente con *Run workflow* para probarlo).

## Arquitectura

```
app/
├── page.tsx                        # Home: toggle coche/peatón + tarjetas por ciudad
├── ciudad/[slug]/                  # 22 páginas por ciudad fronteriza (+ imagen OG en vivo)
├── puente/[slug]/                  # 41 páginas por puente/garita (SEO principal, + imagen OG en vivo)
├── mejor-hora-para-cruzar/[slug]/  # Promedios históricos por ciudad…
│   └── [puente]/                   # …y por puente, día por día
├── horarios-puentes-internacionales/ # Horario oficial CBP de cada cruce
├── camaras-en-vivo/                # Hub de cámaras públicas
├── guias/[slug]/                   # Guías evergreen (SENTRI, Ready Lane, I-94…) — contenido en lib/guias.ts
├── ads.txt/route.ts                # ads.txt de AdSense desde NEXT_PUBLIC_ADSENSE_CLIENT
├── api/waittimes/route.ts          # API pública JSON (caché 5 min)
├── api/cron/snapshot/route.ts      # Captura histórica (protegida con CRON_SECRET)
├── sitemap.ts · robots.ts · manifest.ts
components/                         # Board (cliente), cámaras HLS, gráficas SVG, AdSlot
lib/
├── crossings.ts                    # Catálogo: ciudades (term puente/garita), cruces, apodos, cámaras
├── seo.ts                          # Títulos/descripciones con vocabulario local y minutos en vivo
├── guias.ts                        # Contenido de las guías (con fuentes oficiales)
├── cbp.ts                          # Fetch + normalización de la API de U.S. CBP
├── db.ts                           # Turso/libsql: snapshots y agregaciones
└── board.ts                        # Datos de la home
.github/workflows/snapshot.yml      # Cron cada 15 min
```

- **Fuente de datos**: [bwt.cbp.gov/api/waittimes](https://bwt.cbp.gov/api/waittimes) (pública, sin key, actualización ~cada hora por puerto).
- **Cámaras**: streams públicos HLS de la Ciudad de El Paso (`zoocams.elpasozoo.org`), embeds de CamStreamer (Fideicomiso de Puentes Fronterizos de Chihuahua) y lives de YouTube. Son de terceros y pueden caer; cada cámara tiene fallback visual.
- **Semáforo**: verde ≤ 20 min · amarillo 21–44 min · rojo ≥ 45 min · gris cerrado/sin datos.

## Analítica y SEO

- **GA4**: `NEXT_PUBLIC_GA_ID`. Eventos propios: `buscar` (qué escriben en el buscador), `cambiar_modo`, `ver_camara`, `asistente_pregunta`, `compartir`. Los clics de salida (Google Maps) los mide la medición mejorada de GA4.
- **Vocabulario local**: cada ciudad tiene `term` (`garita` en BC/Sonora, `puente` en el resto) y cada cruce `aliases` (Santa Fe, Lerdo, El Chaparral, Puente Viejo…). Los títulos, H1, FAQ y el buscador los usan: agrega apodos nuevos ahí.
- **Títulos con minutos en vivo** (`lib/seo.ts`), FAQ dinámico por puente y ciudad, imagen OG en vivo para compartir en WhatsApp/Facebook.

## Monetización

`AdSlot` ya está en home, puentes, ciudades, mejor hora, horarios, cámaras y guías, **apagado por defecto**.

1. Con el dominio propio ya conectado, pon `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX` en Vercel y redeploy: carga el script, la meta de verificación y `/ads.txt`.
2. En AdSense → Sitios, agrega el dominio y pide revisión (no acepta subdominios `vercel.app`).
3. Al aprobar: activa Auto ads desde el panel, **o** pon `NEXT_PUBLIC_ADS_ENABLED=true` y reemplaza los `slot="..."` de `AdSlot` por los IDs reales de tus bloques.
4. Para visitantes de la UE/Reino Unido/Suiza, activa el mensaje de consentimiento en AdSense → Privacidad y mensajes.

## Mantenimiento

- `npm run build` — build de producción (corre antes de cada deploy, Vercel lo hace solo).
- `npm run lint` — ESLint.
- Si CBP cambia su API, todo el parsing vive en `lib/cbp.ts`; si un puerto cambia de ID, está en `lib/crossings.ts`.
