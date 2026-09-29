# Reporte de Puentes Oficial — reportedepuentesoficial.mx

Tiempos de espera en vivo de todos los puentes fronterizos entre México y Estados Unidos: minutos de espera, carriles abiertos, cruce peatonal, cámaras en vivo (Ciudad Juárez) y la mejor hora para cruzar según promedios históricos.

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Turso (SQLite) · Vercel · GitHub Actions

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
| `NEXT_PUBLIC_ADS_ENABLED` | No | `true` activa AdSense (dejar apagado hasta fase de monetización) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | No | `ca-pub-XXXX` de tu cuenta de AdSense |

## Despliegue a producción (una sola vez)

### 1. GitHub

1. Crea un repo (ej. `reporte-de-puentes-oficial`) y sube este código.
2. En **Settings → Secrets and variables → Actions**:
   - Secret `CRON_SECRET` = salida de `openssl rand -hex 24`
   - Variable `SITE_URL` = `https://reportedepuentesoficial.mx`

### 2. Turso (base de datos histórica, free tier)

```bash
brew install tursodatabase/tap/turso   # o instala desde https://turso.tech
turso auth signup
turso db create reporte-de-puentes-oficial
turso db show reporte-de-puentes-oficial --url     # → TURSO_DATABASE_URL
turso db tokens create reporte-de-puentes-oficial  # → TURSO_AUTH_TOKEN
```

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
├── ciudad/[slug]/                  # 18 páginas por ciudad fronteriza
├── puente/[slug]/                  # 34 páginas por puente (SEO principal)
├── mejor-hora-para-cruzar/[slug]/  # Promedios históricos por hora y día
├── api/waittimes/route.ts          # API pública JSON (caché 5 min)
├── api/cron/snapshot/route.ts      # Captura histórica (protegida con CRON_SECRET)
├── sitemap.ts · robots.ts · manifest.ts
components/                         # Board (cliente), cámaras HLS, gráficas SVG, AdSlot
lib/
├── crossings.ts                    # Catálogo: ciudades, puentes, cámaras, copy SEO
├── cbp.ts                          # Fetch + normalización de la API de U.S. CBP
├── db.ts                           # Turso/libsql: snapshots y agregaciones
└── board.ts                        # Datos de la home
.github/workflows/snapshot.yml      # Cron cada 15 min
```

- **Fuente de datos**: [bwt.cbp.gov/api/waittimes](https://bwt.cbp.gov/api/waittimes) (pública, sin key, actualización ~cada hora por puerto).
- **Cámaras**: streams públicos HLS de la Ciudad de El Paso (`zoocams.elpasozoo.org`), embeds de CamStreamer (Fideicomiso de Puentes Fronterizos de Chihuahua) y lives de YouTube. Son de terceros y pueden caer; cada cámara tiene fallback visual.
- **Semáforo**: verde ≤ 20 min · amarillo 21–44 min · rojo ≥ 45 min · gris cerrado/sin datos.

## Monetización (fase 2)

El sitio ya tiene el componente `AdSlot` integrado en el layout (home, páginas de puente, ciudad y mejor hora), **desactivado por defecto**. Cuando haya tráfico (~500 visitantes/día):

1. Aplica a Google AdSense con el sitio ya indexado (política de privacidad y páginas de contacto/nosotros ya existen).
2. Al aprobar, pon `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX` y `NEXT_PUBLIC_ADS_ENABLED=true` en Vercel.
3. Reemplaza los `slot="..."` de los componentes `AdSlot` por los IDs reales de tus bloques de anuncios.

## Mantenimiento

- `npm run build` — build de producción (corre antes de cada deploy, Vercel lo hace solo).
- `npm run lint` — ESLint.
- Si CBP cambia su API, todo el parsing vive en `lib/cbp.ts`; si un puerto cambia de ID, está en `lib/crossings.ts`.
