export type CameraSource =
  | { type: "hls"; src: string; label: string }
  | { type: "youtube"; src: string; label: string }
  | { type: "iframe"; src: string; label: string }
  /** Foto fija que se refresca cada minuto (p. ej. cámaras de la Ciudad de Laredo). */
  | { type: "image"; src: string; label: string };

export interface Crossing {
  slug: string;
  portNumber: string;
  name: string;
  nameUs: string;
  citySlug: string;
  mapsQuery: string;
  coords?: { lat: number; lng: number };
  pedestrianOnly?: boolean;
  /** Apodos locales con los que la gente lo busca, el más usado primero. */
  aliases?: string[];
  description: string;
  facts: string[];
  cameras?: CameraSource[];
}

export interface City {
  slug: string;
  name: string;
  state: string;
  nameUs: string;
  stateUs: string;
  priority: number;
  /** Cómo le dice la gente al cruce: "garita" en BC y Sonora, "puente" en el resto. */
  term: "puente" | "garita";
  tz: string;
  description: string;
}

export const cities: City[] = [
  {
    slug: "ciudad-juarez",
    name: "Ciudad Juárez",
    state: "Chihuahua",
    nameUs: "El Paso",
    stateUs: "Texas",
    priority: 1,
    term: "puente",
    tz: "America/Ciudad_Juarez",
    description:
      "Ciudad Juárez y El Paso forman el mayor binomio fronterizo de México y Estados Unidos, con cuatro cruces internacionales: el Puente Libre (Córdova de las Américas), el Paso del Norte (Puente Santa Fe), el Stanton (Puente Lerdo) y el Zaragoza (Ysleta). Cada puente conecta con una zona distinta de El Paso, así que elegir bien puede ahorrarte más de una hora de fila. Aquí consultas las líneas en vivo, carriles abiertos y cámaras de cada garita.",
  },
  {
    slug: "tijuana",
    name: "Tijuana",
    state: "Baja California",
    nameUs: "San Diego",
    stateUs: "California",
    priority: 2,
    term: "garita",
    tz: "America/Tijuana",
    description:
      "Tijuana–San Diego es el cruce fronterizo más transitado del mundo. San Ysidro, Otay Mesa y el CBX concentran millones de cruces al año; conocer el tiempo de espera y la mejor hora para cruzar marca la diferencia entre 20 minutos y más de dos horas de línea.",
  },
  {
    slug: "reynosa",
    name: "Reynosa",
    state: "Tamaulipas",
    nameUs: "McAllen y Hidalgo",
    stateUs: "Texas",
    priority: 3,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "Reynosa conecta con el Valle de Texas a través de los puentes Hidalgo, Pharr, Anzaldúas y Donna. Es la puerta de entrada al corredor McAllen–Edinburg, muy usada por trabajadores transfronterizos y shoppers; consulta aquí las líneas en vivo de cada garita.",
  },
  {
    slug: "nuevo-laredo",
    name: "Nuevo Laredo",
    state: "Tamaulipas",
    nameUs: "Laredo",
    stateUs: "Texas",
    priority: 4,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "Nuevo Laredo y Laredo, Texas son el puerto terrestre más importante de comercio entre México y Estados Unidos. El Puente Uno (Puerta de las Américas), el Puente Dos (Juárez–Lincoln) y el Puente Colombia mueven tráfico de pasajeros y carga; revisa los tiempos de espera antes de salir de casa.",
  },
  {
    slug: "mexicali",
    name: "Mexicali",
    state: "Baja California",
    nameUs: "Calexico",
    stateUs: "California",
    priority: 5,
    term: "garita",
    tz: "America/Tijuana",
    description:
      "Mexicali cruza a Calexico, California por dos garitas: la Garita Nuevo Mexicali o Mexicali 2 (Calexico Este, para la I-8 y Arizona) y la Garita Centro (Calexico Oeste, del centro al centro). Al oeste del Valle, Los Algodones (Andrade) es el cruce famoso por clínicas dentales y ópticas. Consulta aquí las líneas en vivo.",
  },
  {
    slug: "nogales",
    name: "Nogales",
    state: "Sonora",
    nameUs: "Nogales",
    stateUs: "Arizona",
    priority: 6,
    term: "garita",
    tz: "America/Hermosillo",
    description:
      "Nogales, Sonora conecta con Arizona por la garita DeConcini (del centro al centro), la garita Mariposa (rápido acceso a la I-19 hacia Tucson) y la pequeña garita peatonal Morley. La línea puede cambiar radicalmente entre uno y otro; compara los tiempos en vivo aquí.",
  },
  {
    slug: "matamoros",
    name: "Matamoros",
    state: "Tamaulipas",
    nameUs: "Brownsville",
    stateUs: "Texas",
    priority: 7,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "Matamoros cruza a Brownsville, Texas por el Puente Nuevo (Gateway), el Puente Viejo (B&M) y el de Los Tomates (Veterans), además del puente Los Indios (Libre Comercio) hacia Harlingen. Consulta las líneas en vivo y elige la garita con menor espera antes de salir.",
  },
  {
    slug: "piedras-negras",
    name: "Piedras Negras",
    state: "Coahuila",
    nameUs: "Eagle Pass",
    stateUs: "Texas",
    priority: 8,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "Piedras Negras conecta con Eagle Pass, Texas mediante dos puentes internacionales: el Puente Uno (en el centro) y el Puente Dos, conocido como Camino Real. Consulta aquí los tiempos de espera en vivo de ambas garitas.",
  },
  {
    slug: "san-luis-rio-colorado",
    name: "San Luis Río Colorado",
    state: "Sonora",
    nameUs: "San Luis",
    stateUs: "Arizona",
    priority: 10,
    term: "garita",
    tz: "America/Hermosillo",
    description:
      "San Luis Río Colorado cruza a San Luis y Yuma, Arizona por la garita San Luis I, uno de los pasos más activos de la frontera de Sonora. Aquí consultas la línea en vivo, carriles abiertos y horarios de la garita.",
  },
  {
    slug: "san-jeronimo",
    name: "San Jerónimo",
    state: "Chihuahua",
    nameUs: "Santa Teresa",
    stateUs: "Nuevo México",
    priority: 11,
    term: "puente",
    tz: "America/Ciudad_Juarez",
    description:
      "El puente Santa Teresa une San Jerónimo, Chihuahua con Santa Teresa, Nuevo México. Es la alternativa occidental a los puentes de Juárez–El Paso, ideal si viajas hacia el oeste de El Paso o hacia Las Cruces. Consulta aquí su línea en vivo.",
  },
  {
    slug: "guadalupe",
    name: "Guadalupe",
    state: "Chihuahua",
    nameUs: "Tornillo",
    stateUs: "Texas",
    priority: 12,
    term: "puente",
    tz: "America/Ciudad_Juarez",
    description:
      "El puente Marcelino Serna (Tornillo–Guadalupe) conecta el valle agrícola de Guadalupe, Chihuahua con Tornillo, Texas, al este de El Paso. Un cruce tranquilo con líneas cortas la mayoría del día.",
  },
  {
    slug: "tecate",
    name: "Tecate",
    state: "Baja California",
    nameUs: "Tecate",
    stateUs: "California",
    priority: 13,
    term: "garita",
    tz: "America/Tijuana",
    description:
      "La garita de Tecate une las dos Tecate, México y California. Es la alternativa tranquila a San Ysidro y Otay para quien viaja entre Mexicali y el este del condado de San Diego.",
  },
  {
    slug: "nuevo-progreso",
    name: "Nuevo Progreso",
    state: "Tamaulipas",
    nameUs: "Progreso",
    stateUs: "Texas",
    priority: 14,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "El puente Progreso une Nuevo Progreso, Tamaulipas (municipio de Río Bravo) con Progreso, Texas. Es uno de los cruces favoritos del Valle de Texas para visitantes y winter texans; consulta su línea en vivo aquí.",
  },
  {
    slug: "ciudad-miguel-aleman",
    name: "Ciudad Miguel Alemán",
    state: "Tamaulipas",
    nameUs: "Roma",
    stateUs: "Texas",
    priority: 15,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "El puente Roma–Ciudad Miguel Alemán conecta el noroeste de Tamaulipas con Roma, Texas. Un cruce de tamaño medio que suele tener líneas cortas. Consulta aquí su tiempo de espera en vivo.",
  },
  {
    slug: "camargo",
    name: "Camargo",
    state: "Tamaulipas",
    nameUs: "Río Grande City",
    stateUs: "Texas",
    priority: 16,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "El puente Río Grande City–Camargo conecta Camargo, Tamaulipas con Río Grande City, Texas. Consulta aquí el horario y la línea en vivo de esta garita del Valle de Texas.",
  },
  {
    slug: "agua-prieta",
    name: "Agua Prieta",
    state: "Sonora",
    nameUs: "Douglas",
    stateUs: "Arizona",
    priority: 17,
    term: "garita",
    tz: "America/Hermosillo",
    description:
      "La garita de Agua Prieta (puerto Douglas) une Agua Prieta, Sonora con Douglas, Arizona. Es la opción al oriente de Sonora para cruzar hacia el sur de Arizona y Nuevo México.",
  },
  {
    slug: "palomas",
    name: "Palomas",
    state: "Chihuahua",
    nameUs: "Columbus",
    stateUs: "Nuevo México",
    priority: 18,
    term: "garita",
    tz: "America/Ciudad_Juarez",
    description:
      "La garita de Palomas (puerto Columbus) une Palomas, Chihuahua con Columbus, Nuevo México. Famoso por el turismo de compras y servicios del lado mexicano, es un cruce pequeño con líneas cortas casi siempre.",
  },
  {
    slug: "ojinaga",
    name: "Ojinaga",
    state: "Chihuahua",
    nameUs: "Presidio",
    stateUs: "Texas",
    priority: 19,
    term: "puente",
    tz: "America/Chihuahua",
    description:
      "El puente Presidio–Ojinaga conecta Ojinaga, Chihuahua con Presidio, Texas, en el cruce de la región de Big Bend. Un puente tranquilo, ideal si viajas entre Chihuahua y el oeste de Texas.",
  },
  {
    slug: "ciudad-acuna",
    name: "Ciudad Acuña",
    state: "Coahuila",
    nameUs: "Del Río",
    stateUs: "Texas",
    priority: 9,
    term: "puente",
    tz: "America/Matamoros",
    description:
      "Ciudad Acuña, Coahuila cruza a Del Río, Texas por el Puente Internacional Acuña–Del Río, abierto las 24 horas. Es el paso obligado entre el norte de Coahuila y la ruta hacia San Antonio por la US-90 y la US-277. Aquí consultas la fila en vivo, los carriles abiertos y la mejor hora para cruzar.",
  },
  {
    slug: "naco",
    name: "Naco",
    state: "Sonora",
    nameUs: "Naco",
    stateUs: "Arizona",
    priority: 20,
    term: "garita",
    tz: "America/Hermosillo",
    description:
      "Naco, Sonora y Naco, Arizona comparten nombre y una garita pequeña entre Agua Prieta y Nogales, a unos minutos de Bisbee y Sierra Vista. Suele tener líneas cortas; consulta aquí el tiempo de espera en vivo antes de salir.",
  },
  {
    slug: "sonoyta",
    name: "Sonoyta",
    state: "Sonora",
    nameUs: "Lukeville",
    stateUs: "Arizona",
    priority: 21,
    term: "garita",
    tz: "America/Hermosillo",
    description:
      "La garita Sonoyta–Lukeville es la puerta de Arizona hacia Puerto Peñasco (Rocky Point): por aquí cruzan los visitantes de Phoenix y Tucson rumbo a la playa. En fines de semana largos y vacaciones la línea de regreso a Estados Unidos crece mucho; revisa el tiempo en vivo y el horario antes de salir.",
  },
  {
    slug: "el-porvenir",
    name: "El Porvenir",
    state: "Chihuahua",
    nameUs: "Fort Hancock",
    stateUs: "Texas",
    priority: 22,
    term: "puente",
    tz: "America/Ciudad_Juarez",
    description:
      "El puente El Porvenir–Fort Hancock une el Valle de Juárez con Fort Hancock, Texas, unos 80 km al sureste de El Paso. Es un cruce rural pequeño, con horario diurno y líneas cortas la mayor parte del día.",
  },
];

const ZOOCAMS = "https://zoocams.elpasozoo.org";

export const crossings: Crossing[] = [
  // ─── Ciudad Juárez ───
  {
    slug: "puente-libre",
    portNumber: "240201",
    name: "Puente Libre",
    aliases: ["Puente Córdova de las Américas", "Puente de las Américas", "BOTA"],
    nameUs: "Bridge of the Americas (BOTA)",
    citySlug: "ciudad-juarez",
    mapsQuery: "Bridge of the Americas Port of Entry El Paso TX",
    coords: { lat: 31.7553, lng: -106.4512 },
    description:
      "El Puente Libre (Bridge of the Americas) está en El Chamizal y une la avenida Abraham Lincoln de Ciudad Juárez con la I-110 de El Paso, Texas. Es el puente más céntrico y por eso suele cargar las líneas más largas de la ciudad, especialmente en horas pico de la mañana. Cuenta con carriles normales, Ready Lane y cruce peatonal. Abre 24 horas, los 7 días de la semana.",
    facts: [
      "Une Av. Abraham Lincoln (Cd. Juárez) con la I-110 (El Paso)",
      "Abierto 24 horas, los 7 días de la semana",
      "Carriles normales, Ready Lane y peatonal",
    ],
    cameras: [
      { type: "youtube", src: "mp3RS0y77tY", label: "Garita norte (El Paso)" },
      { type: "youtube", src: "CZM5TpXLzE8", label: "Garita sur (Juárez)" },
      { type: "youtube", src: "Y3OESQEXBlI", label: "Fila en la Av. Rafael Pérez Serna (Fideicomiso de Puentes)" },
    ],
  },
  {
    slug: "paso-del-norte",
    portNumber: "240202",
    name: "Paso del Norte",
    aliases: ["Puente Santa Fe", "Puente Centro"],
    nameUs: "Paso Del Norte Bridge",
    citySlug: "ciudad-juarez",
    mapsQuery: "Paso Del Norte International Bridge El Paso TX",
    coords: { lat: 31.7568, lng: -106.4867 },
    description:
      "El Puente Paso del Norte une el centro de Ciudad Juárez (avenida Juárez) con el centro de El Paso. Su tránsito hacia Estados Unidos es directo al downtown, lo que lo hace muy popular entre peatones y personas que trabajan del lado texano. El regreso a Juárez se hace por el Puente Stanton. Abre 24 horas y ofrece carriles normales, Ready Lane, SENTRI y cruce peatonal.",
    facts: [
      "Del centro de Juárez al centro de El Paso",
      "Abierto 24 horas; el regreso a México es por el Puente Stanton",
      "Carriles normales, Ready Lane, SENTRI y peatonal",
    ],
    cameras: [
      { type: "iframe", src: "https://camstreamer.com/embed/tRbi7yHcfP1Q0MHaZwXCfd3ymXHZV8QYuulTvofn", label: "Garita sur (Juárez)" },
      { type: "hls", src: `${ZOOCAMS}/bridgepdn1.m3u8`, label: "Garita norte (El Paso)" },
      { type: "hls", src: `${ZOOCAMS}/bridgesantafe3.m3u8`, label: "Línea peatonal" },
      { type: "youtube", src: "0Pg3S6s76IE", label: "Vista norte (Fideicomiso de Puentes)" },
      { type: "youtube", src: "IcvugJWPXz8", label: "Vista sur (Fideicomiso de Puentes)" },
    ],
  },
  {
    slug: "puente-stanton",
    portNumber: "240204",
    name: "Puente Stanton",
    aliases: ["Puente Lerdo", "Línea Express Lerdo"],
    nameUs: "Stanton Street Bridge",
    citySlug: "ciudad-juarez",
    mapsQuery: "Stanton Street Bridge El Paso TX",
    coords: { lat: 31.7599, lng: -106.4935 },
    pedestrianOnly: true,
    description:
      "El Puente Stanton es el hermano peatonal del Paso del Norte: une la avenida Lerdo de Tejada de Ciudad Juárez con la calle Stanton de El Paso. Hacia Estados Unidos se cruza a pie o en auto; hacia México regresa el tráfico vehicular que subió por el Paso del Norte. Su línea peatonal suele ser de las más rápidas del centro. Horario: 6:00 a.m. a medianoche.",
    facts: [
      "Une Av. Lerdo (Juárez) con la calle Stanton (El Paso)",
      "Horario: 6:00 a.m. – 12:00 a.m.",
      "Alternativa peatonal del centro con líneas cortas",
    ],
    cameras: [
      { type: "iframe", src: "https://camstreamer.com/embed/iEHyfOkiGPdnvCO4RYCLZTiFJGGk8InzjI3bXEx4", label: "Puente Lerdo (norte)" },
      { type: "iframe", src: "https://camstreamer.com/embed/iEKDRVOUybuFhtdKJKdRlaILyhMCSyrkEc8b0WgB", label: "Puente Lerdo (sur)" },
      { type: "hls", src: `${ZOOCAMS}/BridgeStanton3.m3u8`, label: "Línea hacia Juárez" },
      { type: "youtube", src: "RVXhhbkBGbI", label: "Fila del Puente Lerdo (Fideicomiso de Puentes)" },
    ],
  },
  {
    slug: "puente-zaragoza",
    portNumber: "240203",
    name: "Puente Zaragoza",
    aliases: ["Puente Ysleta", "Zaragoza–Ysleta"],
    nameUs: "Ysleta–Zaragoza International Bridge",
    citySlug: "ciudad-juarez",
    mapsQuery: "Zaragoza International Bridge Ysleta El Paso TX",
    coords: { lat: 31.6712, lng: -106.3398 },
    description:
      "El Puente Zaragoza (Ysleta) está en el oriente de Ciudad Juárez: une la avenida Waterfill con la autopista Zaragoza de El Paso y la I-10. Es el favorito de quienes viven en el este de la ciudad o viajan hacia el este de El Paso, y suele ser el más rápido cuando el Puente Libre se satura. Abre 24 horas con carriles normales, Ready Lane, SENTRI y cruce peatonal.",
    facts: [
      "Une Av. Waterfill (oriente de Juárez) con la I-10 (El Paso)",
      "Abierto 24 horas, los 7 días de la semana",
      "Carriles normales, Ready Lane, SENTRI y peatonal",
    ],
    cameras: [
      { type: "hls", src: `${ZOOCAMS}/BridgeZaragoza1.m3u8`, label: "Garita (vista 1)" },
      { type: "hls", src: `${ZOOCAMS}/BridgeZaragoza2.m3u8`, label: "Garita (vista 2)" },
      { type: "hls", src: `${ZOOCAMS}/BridgeZaragoza3.m3u8`, label: "Línea hacia Juárez" },
      { type: "youtube", src: "KX-bm-Lhy3w", label: "Vista norte (Fideicomiso de Puentes)" },
      { type: "youtube", src: "GC5RY3zipa4", label: "Vista sur (Fideicomiso de Puentes)" },
      { type: "youtube", src: "ZZFgkly8XyE", label: "Fila en la Av. Waterfill" },
    ],
  },

  // ─── San Jerónimo, Guadalupe y El Porvenir (Valle de Juárez) ───
  {
    slug: "puente-santa-teresa",
    portNumber: "240801",
    name: "Puente Santa Teresa",
    aliases: ["Puente San Jerónimo", "Garita San Jerónimo–Santa Teresa", "Puerto Santa Teresa"],
    nameUs: "Santa Teresa Port of Entry",
    citySlug: "san-jeronimo",
    mapsQuery: "Santa Teresa Port of Entry Santa Teresa NM",
    coords: { lat: 31.7853, lng: -106.68 },
    description:
      "El cruce Santa Teresa une San Jerónimo, en el poniente de Ciudad Juárez, con Santa Teresa, Nuevo México. Es la alternativa occidental a los puentes del centro de Juárez: conviene si vas hacia el oeste de El Paso, Las Cruces o la I-10 rumbo a Arizona, y suele tener líneas más cortas que el Puente Libre o el Paso del Norte. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Une San Jerónimo (Chihuahua) con Santa Teresa (Nuevo México)",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Carriles normales, Ready Lane y cruce peatonal",
    ],
  },
  {
    slug: "puente-tornillo",
    portNumber: "240401",
    name: "Puente Tornillo–Guadalupe",
    aliases: ["Puente Marcelino Serna", "Puente Guadalupe–Tornillo", "Puente Tornillo"],
    nameUs: "Marcelino Serna Port of Entry (Tornillo)",
    citySlug: "guadalupe",
    mapsQuery: "Marcelino Serna Port of Entry Tornillo TX",
    coords: { lat: 31.4348, lng: -106.1424 },
    description:
      "El puerto Marcelino Serna —abierto en 2016 y nombrado en honor del veterano más condecorado de Texas en la Primera Guerra Mundial—, que todos llaman Puente Tornillo, une Guadalupe, en el Valle de Juárez, con Tornillo, Texas, al sureste de El Paso. Es un cruce moderno y tranquilo: si vives en el oriente de Juárez o vas hacia el este de Texas por la I-10, puede ahorrarte la fila del Zaragoza. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Une Guadalupe D.B. (Chihuahua) con Tornillo (Texas)",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Alternativa al Puente Zaragoza hacia la I-10",
    ],
    cameras: [
      { type: "youtube", src: "8u-hBawdG8c", label: "Vista norte (Fideicomiso de Puentes)" },
      { type: "youtube", src: "0gT7jvaLCkg", label: "Vista sur (Fideicomiso de Puentes)" },
    ],
  },
  {
    slug: "puente-fort-hancock",
    portNumber: "l24501",
    name: "Puente El Porvenir–Fort Hancock",
    aliases: ["Puente Fort Hancock", "Puente El Porvenir"],
    nameUs: "Fort Hancock Port of Entry",
    citySlug: "el-porvenir",
    mapsQuery: "Fort Hancock Port of Entry Fort Hancock TX",
    coords: { lat: 31.2747, lng: -105.8535 },
    description:
      "El puente El Porvenir–Fort Hancock conecta el poblado de El Porvenir, en el Valle de Juárez, con Fort Hancock, Texas, a unos 80 km de El Paso. Es un cruce rural de dos carriles con horario diurno y líneas normalmente cortas. Horario: 6:00 a.m. a 6:00 p.m.",
    facts: [
      "Une El Porvenir (Chihuahua) con Fort Hancock (Texas)",
      "Horario: 6:00 a.m. – 6:00 p.m.",
      "Cruce rural, vehicular y peatonal",
    ],
  },

  // ─── Tijuana ───
  {
    slug: "san-ysidro",
    portNumber: "250401",
    name: "Garita San Ysidro",
    aliases: ["Línea de San Ysidro", "Puerta México"],
    nameUs: "San Ysidro Port of Entry",
    citySlug: "tijuana",
    mapsQuery: "San Ysidro Port of Entry San Diego CA",
    coords: { lat: 32.5437, lng: -117.0295 },
    description:
      "San Ysidro es el cruce fronterizo más transitado del hemisferio occidental: conecta la Zona Centro y Vía Rápida de Tijuana con la I-5 hacia San Diego. Cuenta con carriles normales, Ready Lane y SENTRI. La línea puede pasar de 20 minutos a más de dos horas entre la madrugada y la hora pico, así que conviene revisar el tiempo en vivo antes de salir.",
    facts: [
      "El cruce fronterizo más transitado del mundo",
      "Abierto 24 horas; conecta con la I-5 hacia San Diego",
      "Carriles normales, Ready Lane y SENTRI",
    ],
  },
  {
    slug: "pedwest-el-chaparral",
    portNumber: "250407",
    name: "Garita El Chaparral (PedWest)",
    aliases: ["PedWest", "El Chaparral", "San Ysidro peatonal oeste"],
    nameUs: "San Ysidro PedWest",
    citySlug: "tijuana",
    mapsQuery: "San Ysidro PedWest Pedestrian Crossing",
    coords: { lat: 32.5424, lng: -117.036 },
    pedestrianOnly: true,
    description:
      "PedWest es el cruce peatonal del lado oeste de San Ysidro; en Tijuana se entra por la zona de El Chaparral. Es la alternativa a la línea peatonal principal (PedEast) y en muchas mañanas avanza más rápido. Está junto a Las Americas Outlets, al final de Virginia Avenue. Tiene horario reducido —según CBP, de 6:00 a.m. a 2:00 p.m., entre semana—, así que revisa si está abierto antes de ir.",
    facts: [
      "Cruce exclusivamente peatonal del lado oeste de San Ysidro",
      "Horario según CBP: 6:00 a.m. – 2:00 p.m., de lunes a viernes",
      "Línea normal y Ready Lane peatonal",
    ],
  },
  {
    slug: "cbx",
    portNumber: "250409",
    name: "Cross Border Xpress (CBX)",
    aliases: ["CBX", "Puente del aeropuerto"],
    nameUs: "Cross Border Xpress",
    citySlug: "tijuana",
    mapsQuery: "Cross Border Xpress Tijuana",
    coords: { lat: 32.5483, lng: -116.9742 },
    pedestrianOnly: true,
    description:
      "El Cross Border Xpress (CBX) es un puente peatonal privado que conecta Tijuana directamente con la terminal del Aeropuerto Internacional de Tijuana por el lado de San Diego. Es exclusivo para peatones con boleto de avión y su línea suele moverse rápido. Abre 24 horas, todos los días.",
    facts: [
      "Puente peatonal directo al aeropuerto de Tijuana",
      "Exclusivo para pasajeros con boleto de avión",
      "Abierto 24 horas, todos los días",
    ],
  },
  {
    slug: "otay-mesa",
    portNumber: "250601",
    name: "Garita de Otay",
    aliases: ["Línea de Otay", "Otay Mesa"],
    nameUs: "Otay Mesa Port of Entry",
    citySlug: "tijuana",
    mapsQuery: "Otay Mesa Port of Entry San Diego CA",
    coords: { lat: 32.5519, lng: -116.9383 },
    description:
      "La garita de Otay (Otay Mesa) conecta la zona este de Tijuana (vía Otay) con Otay Mesa, California y la SR-905 hacia la I-805 e I-15. Es la alternativa a San Ysidro cuando la línea del centro se alarga, y da acceso rápido al este del condado de San Diego. Abre 24 horas con carriles normales, Ready Lane y SENTRI.",
    facts: [
      "Une la zona Otay de Tijuana con la SR-905 (San Diego)",
      "Abierto 24 horas, los 7 días de la semana",
      "Alternativa a San Ysidro con acceso al este del condado",
    ],
  },

  // ─── Tecate ───
  {
    slug: "puente-tecate",
    portNumber: "250501",
    name: "Garita de Tecate",
    aliases: ["Línea de Tecate"],
    nameUs: "Tecate Port of Entry",
    citySlug: "tecate",
    mapsQuery: "Tecate Port of Entry Tecate CA",
    coords: { lat: 32.5765, lng: -116.6263 },
    description:
      "La garita de Tecate une las ciudades gemelas de Tecate, Baja California y Tecate, California. Es un cruce pequeño y tranquilo, ideal si viajas entre Mexicali y el este del condado de San Diego sin pasar por la línea de San Ysidro u Otay. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Une Tecate, B.C. con Tecate, California",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Cruce tranquilo, lejos del tráfico de San Ysidro",
    ],
  },

  // ─── Mexicali ───
  {
    slug: "calexico-oeste",
    portNumber: "250302",
    name: "Garita Centro (Calexico Oeste)",
    aliases: ["Garita Centro", "Garita vieja", "Calexico West"],
    nameUs: "Calexico West Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Calexico West Port of Entry Calexico CA",
    coords: { lat: 32.6658, lng: -115.4988 },
    description:
      "La Garita Centro (Calexico Oeste) une el centro de Mexicali con el centro de Calexico, California. Es el cruce peatonal más activo de la zona: miles de personas cruzan diariamente a pie para trabajar o estudiar del lado estadounidense. Abre 24 horas, todos los días.",
    facts: [
      "Del centro de Mexicali al centro de Calexico, California",
      "Abierto 24 horas, todos los días",
      "Muy usado por peatones que trabajan en Calexico y El Centro",
    ],
  },
  {
    slug: "calexico-este",
    portNumber: "250301",
    name: "Garita Nuevo Mexicali (Calexico Este)",
    aliases: ["Garita Nuevo Mexicali", "Mexicali 2", "Garita Nueva", "Calexico East"],
    nameUs: "Calexico East Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Calexico East Port of Entry Calexico CA",
    coords: { lat: 32.6736, lng: -115.3767 },
    description:
      "La Garita Nuevo Mexicali (Calexico Este, también llamada Mexicali 2) está al oriente de la mancha urbana y conecta la carretera a San Luis Río Colorado con la I-8 hacia Yuma y Arizona. Es la mejor opción para tráfico vehicular de paso y para quienes siguen camino al este, evitando el congestionado cruce del centro. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Conecta con la I-8 hacia Yuma y Arizona",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Ideal para tráfico de paso, lejos del centro",
    ],
  },
  {
    slug: "los-algodones",
    portNumber: "250201",
    name: "Garita Los Algodones",
    aliases: ["Garita Andrade", "Algodones"],
    nameUs: "Andrade Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Andrade Port of Entry Andrade CA",
    coords: { lat: 32.7194, lng: -114.7219 },
    description:
      "La garita Los Algodones (Andrade) conecta el pueblo de Los Algodones, Baja California —famoso por sus clínicas dentales, ópticas y farmacias— con Andrade, California, al oeste de Yuma. Recibe cada invierno a miles de visitantes estadounidenses y canadienses. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Cruce famoso por servicios dentales, ópticas y farmacias",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "A 15 minutos de Yuma, Arizona",
    ],
  },

  // ─── San Luis Río Colorado ───
  {
    slug: "puente-san-luis",
    portNumber: "260801",
    name: "Garita San Luis I",
    aliases: ["Garita San Luis", "Línea de San Luis"],
    nameUs: "San Luis I Port of Entry",
    citySlug: "san-luis-rio-colorado",
    mapsQuery: "San Luis Port of Entry San Luis AZ",
    coords: { lat: 32.4967, lng: -114.7822 },
    description:
      "La garita San Luis I une San Luis Río Colorado, Sonora con San Luis, Arizona, a media hora de Yuma. Es uno de los cruces más activos de la frontera de Sonora, con fuerte tráfico de trabajadores y visitantes. Abre 24 horas, todos los días, con carriles normales, Ready Lane y peatonal.",
    facts: [
      "Une San Luis Río Colorado (Sonora) con Yuma, Arizona",
      "Abierto 24 horas, todos los días",
      "Carriles normales, Ready Lane y peatonal",
    ],
  },

  // ─── Nogales ───
  {
    slug: "puente-mariposa",
    portNumber: "260402",
    name: "Garita Mariposa",
    aliases: ["Línea Mariposa"],
    nameUs: "Mariposa Port of Entry",
    citySlug: "nogales",
    mapsQuery: "Mariposa Port of Entry Nogales AZ",
    coords: { lat: 31.334, lng: -110.9839 },
    description:
      "La garita Mariposa está al oeste de Nogales, Sonora y conecta directamente con la I-19 hacia Tucson y Phoenix. Es el cruce vehicular más rápido de la zona cuando el DeConcini del centro se satura. Horario: 6:00 a.m. a 10:00 p.m., con carriles vehiculares y cruce peatonal.",
    facts: [
      "Conecta con la I-19 hacia Tucson y Phoenix",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "El favorito del tráfico vehicular de Nogales",
    ],
  },
  {
    slug: "puente-deconcini",
    portNumber: "260401",
    name: "Garita DeConcini",
    aliases: ["Línea DeConcini"],
    nameUs: "DeConcini Port of Entry",
    citySlug: "nogales",
    mapsQuery: "DeConcini Port of Entry Nogales AZ",
    coords: { lat: 31.331, lng: -110.9396 },
    description:
      "La garita DeConcini une los centros de Nogales, Sonora y Nogales, Arizona. Su cercanía al centro lo hace el preferido de peatones y de quien busca el downtown de ambos lados. Abre 24 horas con carriles normales, Ready Lane, SENTRI y peatonal.",
    facts: [
      "De centro a centro: Nogales, Sonora ↔ Nogales, Arizona",
      "Abierto 24 horas, todos los días",
      "Carriles normales, Ready Lane, SENTRI y peatonal",
    ],
  },
  {
    slug: "puerto-morley",
    portNumber: "260403",
    name: "Garita Morley",
    aliases: ["Puerta Morley", "Morley Gate"],
    nameUs: "Morley Gate",
    citySlug: "nogales",
    mapsQuery: "Morley Gate Nogales AZ",
    coords: { lat: 31.3298, lng: -110.938 },
    pedestrianOnly: true,
    description:
      "La garita Morley es un cruce exclusivamente peatonal a unas cuadras del DeConcini, en Nogales, Arizona. Lo usan sobre todo vecinos que cruzan a pie al centro. Tiene horario corto —de 10:00 a.m. a 6:00 p.m.— y línea generalmente corta.",
    facts: [
      "Cruce exclusivamente peatonal",
      "Horario: 10:00 a.m. – 6:00 p.m.",
      "A unas cuadras del DeConcini",
    ],
  },

  // ─── Agua Prieta ───
  {
    slug: "puerto-douglas",
    portNumber: "260101",
    name: "Garita Agua Prieta–Douglas",
    aliases: ["Garita de Agua Prieta", "Puerto Douglas"],
    nameUs: "Raul Hector Castro Port of Entry",
    citySlug: "agua-prieta",
    mapsQuery: "Douglas Port of Entry Douglas AZ",
    coords: { lat: 31.3508, lng: -109.553 },
    description:
      "La garita de Agua Prieta (puerto Douglas) une Agua Prieta, Sonora con Douglas, Arizona. Es el cruce principal del noreste de Sonora hacia el sur de Arizona y la ruta a Nuevo México. Abre 24 horas con carriles normales, SENTRI y peatonal.",
    facts: [
      "Une Agua Prieta (Sonora) con Douglas (Arizona)",
      "Abierto 24 horas, todos los días",
      "Ruta hacia el sur de Arizona y Nuevo México",
    ],
    cameras: [
      { type: "youtube", src: "w6QFIcvVQMs", label: "Av. 7 e Internacional, lado este (K Multimedios)" },
      { type: "youtube", src: "qq2Ubuel0cw", label: "Av. 7 e Internacional, lado oeste (K Multimedios)" },
    ],
  },

  // ─── Naco ───
  {
    slug: "garita-naco",
    portNumber: "260301",
    name: "Garita Naco",
    aliases: ["Garita de Naco", "Puerto Naco"],
    nameUs: "Naco Port of Entry",
    citySlug: "naco",
    mapsQuery: "Naco Port of Entry Naco AZ",
    coords: { lat: 31.3344, lng: -109.948 },
    description:
      "La garita de Naco une Naco, Sonora con Naco, Arizona, a 15 minutos de Bisbee. Es un cruce pequeño, vehicular y peatonal, con líneas cortas casi siempre; buena alternativa a Agua Prieta si vas hacia Sierra Vista o Tucson por la carretera 92.",
    facts: [
      "Une Naco (Sonora) con Naco (Arizona)",
      "Horario según CBP: 6:00 a.m. – 10:00 p.m.",
      "Después de las 10 p.m. hay que cruzar por Douglas (Agua Prieta)",
    ],
  },

  // ─── Sonoyta ───
  {
    slug: "garita-sonoyta",
    portNumber: "260201",
    name: "Garita Sonoyta–Lukeville",
    aliases: ["Garita de Sonoyta", "Garita Lukeville", "Garita de Puerto Peñasco"],
    nameUs: "Lukeville Port of Entry",
    citySlug: "sonoyta",
    mapsQuery: "Lukeville Port of Entry Lukeville AZ",
    coords: { lat: 31.8804, lng: -112.8169 },
    description:
      "La garita Sonoyta–Lukeville es el cruce hacia Puerto Peñasco (Rocky Point) desde Arizona. En fines de semana largos, Semana Santa y verano la línea de regreso a Estados Unidos puede crecer varias horas. Cierra de noche —horario según CBP: 6:00 a.m. a 8:00 p.m.—, así que planea el regreso con tiempo.",
    facts: [
      "La ruta de Arizona a Puerto Peñasco",
      "Horario según CBP: 6:00 a.m. – 8:00 p.m.",
      "Carriles normales, SENTRI, Ready Lane y peatonal",
    ],
  },

  // ─── Palomas ───
  {
    slug: "puerto-columbus",
    portNumber: "240601",
    name: "Garita Palomas–Columbus",
    aliases: ["Puerto Columbus", "Garita de Palomas"],
    nameUs: "Columbus Port of Entry",
    citySlug: "palomas",
    mapsQuery: "Columbus Port of Entry Columbus NM",
    coords: { lat: 31.826, lng: -107.638 },
    description:
      "La garita de Palomas (puerto Columbus) une Palomas, Chihuahua con Columbus, Nuevo México. Es un cruce pequeño y tranquilo, muy usado por visitantes de Nuevo México que buscan los servicios y el turismo gastronómico del lado mexicano. Abre 24 horas.",
    facts: [
      "Une Palomas (Chihuahua) con Columbus (Nuevo México)",
      "Abierto 24 horas, todos los días",
      "Cruce pequeño con líneas cortas casi siempre",
    ],
  },

  // ─── Piedras Negras ───
  {
    slug: "puente-eagle-pass-1",
    portNumber: "230301",
    name: "Puente Uno Piedras Negras",
    aliases: ["Puente 1", "Puente Internacional I", "Eagle Pass Bridge I"],
    nameUs: "Eagle Pass Bridge I",
    citySlug: "piedras-negras",
    mapsQuery: "Eagle Pass International Bridge I Eagle Pass TX",
    coords: { lat: 28.7665, lng: -100.504 },
    description:
      "El Puente Uno (Puente Internacional I) une el centro de Piedras Negras, Coahuila con Eagle Pass, Texas. Es el cruce clásico del centro de ambas ciudades, apto para vehículos y peatones. Horario: 7:00 a.m. a 11:00 p.m.",
    facts: [
      "Del centro de Piedras Negras al centro de Eagle Pass",
      "Horario: 7:00 a.m. – 11:00 p.m.",
      "Cruce vehicular y peatonal",
    ],
    cameras: [
      { type: "iframe", src: "https://www.youtube.com/embed/live_stream?channel=UC6W5ttEi1SXwjT4dAlSpSMQ", label: "Fila del Puente 1 (Municipio de Piedras Negras)" },
      { type: "iframe", src: "https://g1.ipcamlive.com/player/player.php?alias=bridge1trafficplaza", label: "Plaza de cobro (Ciudad de Eagle Pass)" },
      { type: "iframe", src: "https://g1.ipcamlive.com/player/player.php?alias=bridge1platform", label: "Plataforma (Ciudad de Eagle Pass)" },
    ],
  },
  {
    slug: "puente-eagle-pass-2",
    portNumber: "230302",
    name: "Puente Dos Piedras Negras (Camino Real)",
    aliases: ["Puente 2", "Puente Camino Real", "Puente Internacional II"],
    nameUs: "Eagle Pass Bridge II",
    citySlug: "piedras-negras",
    mapsQuery: "Eagle Pass International Bridge II Eagle Pass TX",
    coords: { lat: 28.759, lng: -100.523 },
    description:
      "El Puente Dos, conocido como Camino Real, está al oeste de Piedras Negras y conecta con la FM 1021 de Eagle Pass, con acceso rápido a la US-57 hacia San Antonio. Al estar fuera del centro, suele tener mejores tiempos que el Puente Uno. Abre 24 horas.",
    facts: [
      "Ruta rápida hacia San Antonio por la US-57",
      "Abierto 24 horas, todos los días",
      "Alternativa al congestionado Puente Uno del centro",
    ],
    cameras: [
      { type: "iframe", src: "https://www.youtube.com/embed/live_stream?channel=UCD12HC-FqOwAEzEi0cKxYZQ", label: "Puente 2 (Municipio de Piedras Negras)" },
      { type: "iframe", src: "https://g1.ipcamlive.com/player/player.php?alias=67231a475ead1", label: "Puente 2, vista 1 (Ciudad de Eagle Pass)" },
      { type: "iframe", src: "https://g1.ipcamlive.com/player/player.php?alias=639ba5d96b3f6", label: "Puente 2, vista 2 (Ciudad de Eagle Pass)" },
    ],
  },

  // ─── Ciudad Acuña ───
  {
    slug: "puente-acuna-del-rio",
    portNumber: "230201",
    name: "Puente Acuña–Del Río",
    aliases: ["Puente Acuña", "Puente Internacional Acuña", "Puente Del Río"],
    nameUs: "Del Rio International Bridge",
    citySlug: "ciudad-acuna",
    mapsQuery: "Del Rio International Bridge Del Rio TX",
    coords: { lat: 29.3344, lng: -100.9191 },
    description:
      "El Puente Internacional Acuña–Del Río une Ciudad Acuña, Coahuila con Del Río, Texas. Es el único cruce de la ciudad, abierto las 24 horas, con carriles normales, SENTRI y Ready Lane. Del lado texano conecta con la US-90 y la US-277 hacia San Antonio, y con la Base Aérea Laughlin.",
    facts: [
      "Une Ciudad Acuña (Coahuila) con Del Río (Texas)",
      "Abierto 24 horas, todos los días",
      "Carriles normales, SENTRI y Ready Lane",
    ],
  },

  // ─── Nuevo Laredo ───
  {
    slug: "puente-laredo-1",
    portNumber: "230401",
    name: "Puente Uno (Puerta de las Américas)",
    aliases: ["Puente 1", "Puente Internacional 1", "Gateway to the Americas"],
    nameUs: "Gateway to the Americas Bridge (Laredo Bridge I)",
    citySlug: "nuevo-laredo",
    mapsQuery: "Laredo Convent Street Port of Entry Laredo TX",
    coords: { lat: 27.516, lng: -99.502 },
    description:
      "El Puente Uno (Puerta de las Américas) une la avenida Guerrero, en el centro de Nuevo Laredo, con la Convent Street del downtown de Laredo, Texas. Es el cruce más céntrico, el preferido para ir de compras al centro y a los outlets, y el principal cruce peatonal de la ciudad. Abre 24 horas.",
    facts: [
      "Del centro de Nuevo Laredo al downtown de Laredo",
      "Abierto 24 horas, todos los días",
      "Cruce peatonal principal de Nuevo Laredo",
    ],
    cameras: [
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge1US.jpg", label: "Hacia Estados Unidos (Ciudad de Laredo)" },
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge1MEX.jpg", label: "Hacia México (Ciudad de Laredo)" },
    ],
  },
  {
    slug: "puente-laredo-2",
    portNumber: "230402",
    name: "Puente Dos (Juárez–Lincoln)",
    aliases: ["Puente 2", "Puente Internacional 2", "Juárez–Lincoln"],
    nameUs: "Juárez–Lincoln Bridge (Laredo Bridge II)",
    citySlug: "nuevo-laredo",
    mapsQuery: "Laredo Bridge II Laredo TX",
    coords: { lat: 27.548, lng: -99.52 },
    description:
      "El Puente Dos (Juárez–Lincoln) está a unas cuadras al oriente del Puente Uno y desemboca directamente en la I-35 de Laredo, Texas. Es exclusivamente vehicular y tiene más carriles que el Puente Uno, por lo que suele mover mejor el tráfico de autos en horas pico. Abre 24 horas.",
    facts: [
      "Desemboca directo en la I-35 hacia San Antonio",
      "Abierto 24 horas, todos los días",
      "Solo vehicular: el cruce a pie es por el Puente Uno",
    ],
    cameras: [
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge2US.jpg", label: "Hacia Estados Unidos (Ciudad de Laredo)" },
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge2MEX.jpg", label: "Hacia México (Ciudad de Laredo)" },
    ],
  },
  {
    slug: "puente-colombia",
    portNumber: "230403",
    name: "Puente Colombia (Solidaridad)",
    aliases: ["Puente 3", "Puente Solidaridad", "Colombia–Solidaridad"],
    nameUs: "Colombia–Solidarity International Bridge",
    citySlug: "nuevo-laredo",
    mapsQuery: "Colombia Solidarity International Bridge Laredo TX",
    coords: { lat: 27.695, lng: -99.263 },
    description:
      "El puente Colombia (Solidaridad) cruza el Río Bravo al norte de Nuevo Laredo, conectando el municipio de Colombia, Nuevo León con Texas. Es la mejor opción si vienes de Monterrey o de la carretera 85, pues evitas cruzar la ciudad. Horario: 8:00 a.m. a medianoche.",
    facts: [
      "Ideal si vienes de Monterrey por la carretera 85",
      "Horario: 8:00 a.m. – 12:00 a.m.",
      "Evita el tráfico urbano de Nuevo Laredo",
    ],
    cameras: [
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge3US.jpg", label: "Hacia Estados Unidos (Ciudad de Laredo)" },
      { type: "image", src: "https://www.openlaredo.com/bridge/BridgeWebCamStills/bridge3MEX.jpg", label: "Hacia México (Ciudad de Laredo)" },
      { type: "iframe", src: "https://rtsp.me/embed/94RBHiAa/", label: "Casetas del puente (puentecolombia.mx)" },
    ],
  },

  // ─── Reynosa ───
  {
    slug: "puente-hidalgo",
    portNumber: "230501",
    name: "Puente Reynosa–Hidalgo",
    aliases: ["Puente Hidalgo", "Puente Internacional Hidalgo"],
    nameUs: "Hidalgo International Bridge",
    citySlug: "reynosa",
    mapsQuery: "Hidalgo International Bridge Hidalgo TX",
    coords: { lat: 26.093, lng: -98.275 },
    description:
      "El puente Hidalgo une el centro de Reynosa con Hidalgo, Texas, a 10 minutos de McAllen. Es el cruce clásico del Valle de Texas: directo a la Expressway 83 y al corazón comercial de McAllen. Abre 24 horas con carriles normales, Ready Lane, SENTRI y peatonal.",
    facts: [
      "Del centro de Reynosa a McAllen en 10-15 minutos",
      "Abierto 24 horas, todos los días",
      "Carriles normales, Ready Lane, SENTRI y peatonal",
    ],
  },
  {
    slug: "puente-pharr",
    portNumber: "230502",
    name: "Puente Reynosa–Pharr",
    aliases: ["Puente Pharr", "Nuevo Amanecer"],
    nameUs: "Pharr International Bridge",
    citySlug: "reynosa",
    mapsQuery: "Pharr International Bridge Pharr TX",
    coords: { lat: 26.175, lng: -98.183 },
    description:
      "El puente Pharr está al este de Reynosa y conecta con Pharr, Texas, con acceso directo a la I-2 y la ruta hacia Harlingen y el este del Valle. Sus líneas vehiculares suelen ser más cortas que las del centro. Horario: 6:00 a.m. a medianoche.",
    facts: [
      "Acceso directo a la I-2 y el este del Valle de Texas",
      "Horario: 6:00 a.m. – 12:00 a.m.",
      "Líneas generalmente más cortas que el Hidalgo",
    ],
    cameras: [
      { type: "youtube", src: "Ziz1pk9wnDA", label: "BridgeCam (Ciudad de Pharr)" },
    ],
  },
  {
    slug: "puente-anzalduas",
    portNumber: "230503",
    name: "Puente Anzaldúas",
    aliases: ["Anzalduas", "Puente Mission"],
    nameUs: "Anzalduas International Bridge",
    citySlug: "reynosa",
    mapsQuery: "Anzalduas International Bridge Mission TX",
    coords: { lat: 26.139, lng: -98.332 },
    description:
      "El puente Anzaldúas conecta el oeste de Reynosa con Mission, Texas. Es un cruce moderno que suele tener líneas cortas, ideal si tu destino es McAllen, Mission o el oeste del Valle. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Cruce moderno hacia Mission y el oeste del Valle",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Uno de los puentes más nuevos de la frontera",
    ],
  },
  {
    slug: "puente-donna",
    portNumber: "230902",
    name: "Puente Río Bravo–Donna",
    aliases: ["Puente Donna", "Donna–Río Bravo"],
    nameUs: "Donna International Bridge",
    citySlug: "reynosa",
    mapsQuery: "Donna International Bridge Donna TX",
    coords: { lat: 26.165, lng: -98.035 },
    description:
      "El puente Donna cruza al oriente de la región, uniendo el municipio de Río Bravo (junto a Reynosa) con Donna, Texas. Es el cruce con las líneas más cortas del área de Reynosa en la mayoría de los horarios. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Une Río Bravo (Tamaulipas) con Donna, Texas",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Las líneas más cortas de la zona Reynosa",
    ],
  },

  // ─── Nuevo Progreso ───
  {
    slug: "puente-progreso",
    portNumber: "230901",
    name: "Puente Nuevo Progreso",
    aliases: ["Puente Progreso", "Progreso–Nuevo Progreso"],
    nameUs: "Progreso International Bridge",
    citySlug: "nuevo-progreso",
    mapsQuery: "Progreso International Bridge Progreso TX",
    coords: { lat: 26.082, lng: -97.957 },
    description:
      "El puente Progreso une el pueblo de Nuevo Progreso, Tamaulipas con Progreso, Texas. Es el cruce favorito de los winter texans del Valle por sus farmacias, restaurantes y dentistas a pasos de la garita. Abre 24 horas y tiene línea peatonal activa todo el día.",
    facts: [
      "El cruce favorito de los winter texans del Valle",
      "Abierto 24 horas, todos los días",
      "Farmacias, restaurantes y dentistas a pasos del puente",
    ],
  },

  // ─── Ciudad Miguel Alemán ───
  {
    slug: "puente-roma",
    portNumber: "231001",
    name: "Puente Roma–Miguel Alemán",
    aliases: ["Puente Roma", "Puente Miguel Alemán"],
    nameUs: "Roma International Bridge",
    citySlug: "ciudad-miguel-aleman",
    mapsQuery: "Roma International Bridge Roma TX",
    coords: { lat: 26.403, lng: -99.014 },
    description:
      "El puente Roma une Ciudad Miguel Alemán, Tamaulipas con Roma, Texas, sobre el histórico Río Bravo. Es la puerta natural entre el noroeste de Tamaulipas y el condado de Starr. Abre 24 horas.",
    facts: [
      "Une Ciudad Miguel Alemán con Roma, Texas",
      "Abierto 24 horas, todos los días",
      "Puerta al condado de Starr y la US-83",
    ],
  },

  // ─── Camargo ───
  {
    slug: "puente-camargo",
    portNumber: "230701",
    name: "Puente Camargo–Río Grande City",
    aliases: ["Puente Camargo", "Puente Río Grande City"],
    nameUs: "Rio Grande City International Bridge",
    citySlug: "camargo",
    mapsQuery: "Rio Grande City International Bridge Rio Grande City TX",
    coords: { lat: 26.378, lng: -99.003 },
    description:
      "El puente de Camargo conecta Ciudad Camargo, Tamaulipas con Río Grande City, Texas. Un cruce mediano, sin las aglomeraciones de los puentes grandes del Valle. Horario: 7:00 a.m. a 11:00 p.m.",
    facts: [
      "Une Camargo (Tamaulipas) con Río Grande City (Texas)",
      "Horario: 7:00 a.m. – 11:00 p.m.",
      "Cruce tranquilo del Valle de Texas",
    ],
  },

  // ─── Matamoros ───
  {
    slug: "puente-gateway",
    portNumber: "535504",
    name: "Puente Nuevo (Gateway)",
    aliases: ["Puente Nuevo", "Puerta México", "Gateway"],
    nameUs: "Gateway International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Gateway International Bridge Brownsville TX",
    coords: { lat: 25.901, lng: -97.434 },
    description:
      "El Puente Nuevo (Gateway) une el centro de Matamoros con el centro de Brownsville, Texas. Es el cruce peatonal más importante de la región: miles de personas cruzan a pie diariamente. Abre 24 horas con carriles normales, Ready Lane y peatonal.",
    facts: [
      "Del centro de Matamoros al centro de Brownsville",
      "Abierto 24 horas, todos los días",
      "El cruce peatonal más importante de la región",
    ],
    cameras: [
      { type: "iframe", src: "https://g3.ipcamlive.com/player/player.php?alias=61af904e45b24", label: "Puente Nuevo (COMTODO)" },
    ],
  },
  {
    slug: "puente-bm",
    portNumber: "535501",
    name: "Puente Viejo (B&M)",
    aliases: ["Puente Viejo", "B&M"],
    nameUs: "B&M International Bridge",
    citySlug: "matamoros",
    mapsQuery: "B&M International Bridge Brownsville TX",
    coords: { lat: 25.899, lng: -97.425 },
    description:
      "El Puente Viejo (B&M) está en el centro de Matamoros, a unas cuadras del Puente Nuevo, y cruza hacia el centro de Brownsville. Histórico y compacto, es una alternativa al Gateway con líneas generalmente cortas. Abre 24 horas.",
    facts: [
      "Cruce histórico del centro de Matamoros",
      "Abierto 24 horas, todos los días",
      "Alternativa tranquila al puente Gateway",
    ],
    cameras: [
      { type: "iframe", src: "https://g3.ipcamlive.com/player/player.php?alias=5df59f3827371", label: "Puente Viejo (COMTODO)" },
    ],
  },
  {
    slug: "puente-veterans",
    portNumber: "535502",
    name: "Puente Los Tomates (Veterans)",
    aliases: ["Los Tomates", "Puente Veterans", "Puente Ignacio Zaragoza"],
    nameUs: "Veterans International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Veterans International Bridge Brownsville TX",
    coords: { lat: 25.92, lng: -97.409 },
    description:
      "El puente Veterans, conocido en Matamoros como Puente Los Tomates, es el cruce vehicular principal de la ciudad: conecta el este de la ciudad con Brownsville y la Expressway 77/83 hacia Harlingen y el norte del Valle. Abre de 6:00 a.m. a medianoche.",
    facts: [
      "El cruce vehicular principal de Matamoros",
      "Horario: 6:00 a.m. – 12:00 a.m.",
      "Acceso directo a la Expressway 77/83",
    ],
  },
  {
    slug: "puente-los-indios",
    portNumber: "535503",
    name: "Puente Los Indios (Libre Comercio)",
    aliases: ["Puente Libre Comercio", "Puente Lucio Blanco"],
    nameUs: "Los Indios International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Los Indios International Bridge Los Indios TX",
    coords: { lat: 25.983, lng: -97.741 },
    description:
      "El puente Los Indios (Libre Comercio) cruza al oeste de Matamoros, uniendo Lucio Blanco con Los Indios, Texas, camino a Harlingen y McAllen. Un cruce pequeño con líneas cortas la mayor parte del día. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Une la zona oeste de Matamoros con Harlingen",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Cruce pequeño con líneas cortas",
    ],
  },

  // ─── Ojinaga ───
  {
    slug: "puente-presidio",
    portNumber: "240301",
    name: "Puente Ojinaga–Presidio",
    aliases: ["Puente Presidio", "Puente Ojinaga"],
    nameUs: "Presidio Port of Entry",
    citySlug: "ojinaga",
    mapsQuery: "Presidio Port of Entry Presidio TX",
    coords: { lat: 29.561, lng: -104.369 },
    description:
      "El puente Presidio une Ojinaga, Chihuahua con Presidio, Texas, en plena región de Big Bend. Es el cruce directo entre Chihuahua y el oeste de Texas, con líneas cortas casi todo el año. Abre 24 horas.",
    facts: [
      "Une Ojinaga (Chihuahua) con Presidio (Texas)",
      "Abierto 24 horas, todos los días",
      "Puerta de entrada a la región de Big Bend",
    ],
  },
];

export const crossingsBySlug = new Map(crossings.map((c) => [c.slug, c]));
export const citiesBySlug = new Map(cities.map((c) => [c.slug, c]));

export function crossingsForCity(citySlug: string): Crossing[] {
  return crossings.filter((c) => c.citySlug === citySlug);
}

export function cityOf(crossing: Crossing): City {
  return citiesBySlug.get(crossing.citySlug)!;
}

export const sortedCities = [...cities].sort((a, b) => a.priority - b.priority);
