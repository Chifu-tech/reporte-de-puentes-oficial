export type CameraSource =
  | { type: "hls"; src: string; label: string }
  | { type: "youtube"; src: string; label: string }
  | { type: "iframe"; src: string; label: string };

export interface Crossing {
  slug: string;
  portNumber: string;
  name: string;
  nameUs: string;
  citySlug: string;
  mapsQuery: string;
  coords?: { lat: number; lng: number };
  pedestrianOnly?: boolean;
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
    tz: "America/Ciudad_Juarez",
    description:
      "Ciudad Juárez y El Paso forman el mayor binomio fronterizo de México y Estados Unidos, con cuatro cruces internacionales: Puente Libre, Paso del Norte, Stanton y Zaragoza. Cada puente conecta con una zona distinta de El Paso, así que elegir bien puede ahorrarte más de una hora de fila. Aquí consultas las líneas en vivo, carriles abiertos y cámaras de cada garita.",
  },
  {
    slug: "tijuana",
    name: "Tijuana",
    state: "Baja California",
    nameUs: "San Diego",
    stateUs: "California",
    priority: 2,
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
    tz: "America/Matamoros",
    description:
      "Nuevo Laredo y Laredo, Texas son el puerto terrestre más importante de comercio entre México y Estados Unidos. Los puentes Uno (Juárez–Lincoln), Dos y Colombia mueven tráfico de pasajeros y carga; revisa los tiempos de espera antes de salir de casa.",
  },
  {
    slug: "mexicali",
    name: "Mexicali",
    state: "Baja California",
    nameUs: "Calexico",
    stateUs: "California",
    priority: 5,
    tz: "America/Tijuana",
    description:
      "Mexicali cruza a Calexico, California por dos garitas: Calexico Este (para la I-8 y Arizona) y Calexico Oeste (del centro al centro). Al oeste del Valle, Los Algodones (Andrade) es el cruce famoso por clínicas dentales y ópticas. Consulta aquí las líneas en vivo.",
  },
  {
    slug: "nogales",
    name: "Nogales",
    state: "Sonora",
    nameUs: "Nogales",
    stateUs: "Arizona",
    priority: 6,
    tz: "America/Hermosillo",
    description:
      "Nogales, Sonora conecta con Arizona por el puente DeConcini (del centro al centro), Mariposa (rápido acceso a la I-19 hacia Tucson) y el pequeño puerto peatonal Morley. La línea puede cambiar radicalmente entre uno y otro; compara los tiempos en vivo aquí.",
  },
  {
    slug: "matamoros",
    name: "Matamoros",
    state: "Tamaulipas",
    nameUs: "Brownsville",
    stateUs: "Texas",
    priority: 7,
    tz: "America/Matamoros",
    description:
      "Matamoros cruza a Brownsville, Texas por los puentes Gateway, B&M y Veterans International, además del puente Los Indios hacia Harlingen. Consulta las líneas en vivo y elige la garita con menor espera antes de salir.",
  },
  {
    slug: "piedras-negras",
    name: "Piedras Negras",
    state: "Coahuila",
    nameUs: "Eagle Pass",
    stateUs: "Texas",
    priority: 8,
    tz: "America/Matamoros",
    description:
      "Piedras Negras conecta con Eagle Pass, Texas mediante dos puentes internacionales: el Puente Uno (peatonal y vehicular, en el centro) y el Puente Dos Camino Real. Consulta aquí los tiempos de espera en vivo de ambas garitas.",
  },
  {
    slug: "san-luis-rio-colorado",
    name: "San Luis Río Colorado",
    state: "Sonora",
    nameUs: "San Luis",
    stateUs: "Arizona",
    priority: 9,
    tz: "America/Hermosillo",
    description:
      "San Luis Río Colorado cruza a San Luis y Yuma, Arizona por el Puente San Luis I, uno de los pasos más activos de la frontera de Sonora. Aquí consultas la línea en vivo, carriles abiertos y horarios de la garita.",
  },
  {
    slug: "san-jeronimo",
    name: "San Jerónimo",
    state: "Chihuahua",
    nameUs: "Santa Teresa",
    stateUs: "Nuevo México",
    priority: 10,
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
    priority: 11,
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
    priority: 12,
    tz: "America/Tijuana",
    description:
      "El puente de Tecate une las dos Tecate, México y California. Es la alternativa tranquila a San Ysidro y Otay para quien viaja entre Mexicali y el este del condado de San Diego.",
  },
  {
    slug: "nuevo-progreso",
    name: "Nuevo Progreso",
    state: "Tamaulipas",
    nameUs: "Progreso",
    stateUs: "Texas",
    priority: 13,
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
    priority: 14,
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
    priority: 15,
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
    priority: 16,
    tz: "America/Hermosillo",
    description:
      "El puerto Douglas une Agua Prieta, Sonora con Douglas, Arizona. Es la opción al oriente de Sonora para cruzar hacia el sur de Arizona y Nuevo México.",
  },
  {
    slug: "palomas",
    name: "Palomas",
    state: "Chihuahua",
    nameUs: "Columbus",
    stateUs: "Nuevo México",
    priority: 17,
    tz: "America/Ciudad_Juarez",
    description:
      "El puerto Columbus une Palomas, Chihuahua con Columbus, Nuevo México. Famoso por el turismo de compras y servicios del lado mexicano, es un cruce pequeño con líneas cortas casi siempre.",
  },
  {
    slug: "ojinaga",
    name: "Ojinaga",
    state: "Chihuahua",
    nameUs: "Presidio",
    stateUs: "Texas",
    priority: 18,
    tz: "America/Chihuahua",
    description:
      "El puente Presidio–Ojinaga conecta Ojinaga, Chihuahua con Presidio, Texas, en el cruce de la región de Big Bend. Un puente tranquilo, ideal si viajas entre Chihuahua y el oeste de Texas.",
  },
];

const ZOOCAMS = "https://zoocams.elpasozoo.org";

export const crossings: Crossing[] = [
  // ─── Ciudad Juárez ───
  {
    slug: "puente-libre",
    portNumber: "240201",
    name: "Puente Libre",
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
    ],
  },
  {
    slug: "paso-del-norte",
    portNumber: "240202",
    name: "Paso del Norte",
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
    ],
  },
  {
    slug: "puente-stanton",
    portNumber: "240204",
    name: "Puente Stanton",
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
    ],
  },
  {
    slug: "puente-zaragoza",
    portNumber: "240203",
    name: "Puente Zaragoza",
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
    ],
  },

  // ─── Tijuana ───
  {
    slug: "san-ysidro",
    portNumber: "250401",
    name: "Puente San Ysidro",
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
    slug: "cbx",
    portNumber: "250409",
    name: "Cross Border Express (CBX)",
    nameUs: "Cross Border Xpress",
    citySlug: "tijuana",
    mapsQuery: "Cross Border Xpress Tijuana",
    coords: { lat: 32.5426, lng: -117.0358 },
    pedestrianOnly: true,
    description:
      "El CBX es un puente peatonal privado que conecta Tijuana directamente con la terminal del Aeropuerto Internacional de Tijuana por el lado de San Diego. Es exclusivo para peatones con boleto de avión y su línea suele moverse rápido. Abre 24 horas, todos los días.",
    facts: [
      "Puente peatonal directo al aeropuerto de Tijuana",
      "Exclusivo para pasajeros con boleto de avión",
      "Abierto 24 horas, todos los días",
    ],
  },
  {
    slug: "otay-mesa",
    portNumber: "250601",
    name: "Puente Otay Mesa",
    nameUs: "Otay Mesa Port of Entry",
    citySlug: "tijuana",
    mapsQuery: "Otay Mesa Port of Entry San Diego CA",
    coords: { lat: 32.5519, lng: -116.9383 },
    description:
      "El puente Otay Mesa conecta la zona este de Tijuana (vía Otay) con Otay Mesa, California y la SR-905 hacia la I-805 e I-15. Es la alternativa a San Ysidro cuando la línea del centro se alarga, y da acceso rápido al este del condado de San Diego. Abre 24 horas con carriles normales, Ready Lane y SENTRI.",
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
    name: "Puente Tecate",
    nameUs: "Tecate Port of Entry",
    citySlug: "tecate",
    mapsQuery: "Tecate Port of Entry Tecate CA",
    coords: { lat: 32.5765, lng: -116.6263 },
    description:
      "El puente de Tecate une las ciudades gemelas de Tecate, Baja California y Tecate, California. Es un cruce pequeño y tranquilo, ideal si viajas entre Mexicali y el este del condado de San Diego sin pasar por la línea de San Ysidro u Otay. Horario: 6:00 a.m. a 10:00 p.m.",
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
    name: "Puente Calexico Oeste",
    nameUs: "Calexico West Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Calexico West Port of Entry Calexico CA",
    coords: { lat: 32.6658, lng: -115.4988 },
    description:
      "El puente Calexico Oeste (o Puente Nuevo) une el centro de Mexicali con el centro de Calexico, California. Es el cruce peatonal más activo de la zona: miles de personas cruzan diariamente a pie para trabajar o estudiar del lado estadounidense. Abre 24 horas, todos los días.",
    facts: [
      "Del centro de Mexicali al centro de Calexico, California",
      "Abierto 24 horas, todos los días",
      "Muy usado por peatones que trabajan en Calexico y El Centro",
    ],
  },
  {
    slug: "calexico-este",
    portNumber: "250301",
    name: "Puente Calexico Este",
    nameUs: "Calexico East Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Calexico East Port of Entry Calexico CA",
    coords: { lat: 32.6736, lng: -115.3767 },
    description:
      "El puente Calexico Este está al oriente de la mancha urbana y conecta la carretera a San Luis Río Colorado con la I-8 hacia Yuma y Arizona. Es la mejor opción para tráfico vehicular de paso y para quienes siguen camino al este, evitando el congestionado cruce del centro. Horario: 6:00 a.m. a 10:00 p.m.",
    facts: [
      "Conecta con la I-8 hacia Yuma y Arizona",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "Ideal para tráfico de paso, lejos del centro",
    ],
  },
  {
    slug: "los-algodones",
    portNumber: "250201",
    name: "Puente Los Algodones",
    nameUs: "Andrade Port of Entry",
    citySlug: "mexicali",
    mapsQuery: "Andrade Port of Entry Andrade CA",
    coords: { lat: 32.7194, lng: -114.7219 },
    description:
      "El puente Los Algodones (Andrade) conecta el pueblo de Los Algodones, Baja California —famoso por sus clínicas dentales, ópticas y farmacias— con Andrade, California, al oeste de Yuma. Recibe cada invierno a miles de visitantes estadounidenses y canadienses. Horario: 6:00 a.m. a 10:00 p.m.",
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
    name: "Puente San Luis I",
    nameUs: "San Luis I Port of Entry",
    citySlug: "san-luis-rio-colorado",
    mapsQuery: "San Luis Port of Entry San Luis AZ",
    coords: { lat: 32.4967, lng: -114.7822 },
    description:
      "El Puente San Luis I une San Luis Río Colorado, Sonora con San Luis, Arizona, a media hora de Yuma. Es uno de los cruces más activos de la frontera de Sonora, con fuerte tráfico de trabajadores y visitantes. Abre 24 horas, todos los días, con carriles normales, Ready Lane y peatonal.",
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
    name: "Puente Mariposa",
    nameUs: "Mariposa Port of Entry",
    citySlug: "nogales",
    mapsQuery: "Mariposa Port of Entry Nogales AZ",
    coords: { lat: 31.334, lng: -110.9839 },
    description:
      "El puente Mariposa está al oeste de Nogales, Sonora y conecta directamente con la I-19 hacia Tucson y Phoenix. Es el cruce vehicular más rápido de la zona cuando el DeConcini del centro se satura. Horario: 6:00 a.m. a 10:00 p.m., con carriles normales, Ready Lane, SENTRI y peatonal.",
    facts: [
      "Conecta con la I-19 hacia Tucson y Phoenix",
      "Horario: 6:00 a.m. – 10:00 p.m.",
      "El favorito del tráfico vehicular de Nogales",
    ],
  },
  {
    slug: "puente-deconcini",
    portNumber: "260401",
    name: "Puente DeConcini",
    nameUs: "DeConcini Port of Entry",
    citySlug: "nogales",
    mapsQuery: "DeConcini Port of Entry Nogales AZ",
    coords: { lat: 31.331, lng: -110.9396 },
    description:
      "El puente DeConcini une los centros de Nogales, Sonora y Nogales, Arizona. Su cercanía al centro lo hace el preferido de peatones y de quien busca el downtown de ambos lados. Abre 24 horas con carriles normales, Ready Lane, SENTRI y peatonal.",
    facts: [
      "De centro a centro: Nogales, Sonora ↔ Nogales, Arizona",
      "Abierto 24 horas, todos los días",
      "Carriles normales, Ready Lane, SENTRI y peatonal",
    ],
  },
  {
    slug: "puerto-morley",
    portNumber: "260403",
    name: "Puerto Morley",
    nameUs: "Morley Gate",
    citySlug: "nogales",
    mapsQuery: "Morley Gate Nogales AZ",
    coords: { lat: 31.3298, lng: -110.938 },
    pedestrianOnly: true,
    description:
      "El puerto Morley es un cruce exclusivamente peatonal a unas cuadras del DeConcini, en Nogales, Arizona. Lo usan sobre todo vecinos que cruzan a pie al centro. Tiene horario corto —de 10:00 a.m. a 6:00 p.m.— y línea generalmente corta.",
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
    name: "Puerto Douglas",
    nameUs: "Raul Hector Castro Port of Entry",
    citySlug: "agua-prieta",
    mapsQuery: "Douglas Port of Entry Douglas AZ",
    coords: { lat: 31.3508, lng: -109.553 },
    description:
      "El puerto Douglas une Agua Prieta, Sonora con Douglas, Arizona. Es el cruce principal del noreste de Sonora hacia el sur de Arizona y la ruta a Nuevo México. Abre 24 horas con carriles normales, Ready Lane y peatonal.",
    facts: [
      "Une Agua Prieta (Sonora) con Douglas (Arizona)",
      "Abierto 24 horas, todos los días",
      "Ruta hacia el sur de Arizona y Nuevo México",
    ],
  },

  // ─── Palomas ───
  {
    slug: "puerto-columbus",
    portNumber: "240601",
    name: "Puerto Columbus–Palomas",
    nameUs: "Columbus Port of Entry",
    citySlug: "palomas",
    mapsQuery: "Columbus Port of Entry Columbus NM",
    coords: { lat: 31.826, lng: -107.638 },
    description:
      "El puerto Columbus une Palomas, Chihuahua con Columbus, Nuevo México. Es un cruce pequeño y tranquilo, muy usado por visitantes de Nuevo México que buscan los servicios y el turismo gastronómico del lado mexicano. Abre 24 horas.",
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
    name: "Puente Internacional I",
    nameUs: "Eagle Pass Bridge I",
    citySlug: "piedras-negras",
    mapsQuery: "Eagle Pass Camino Real International Bridge Eagle Pass TX",
    coords: { lat: 28.7665, lng: -100.504 },
    description:
      "El Puente Internacional Uno une el centro de Piedras Negras, Coahuila con Eagle Pass, Texas. Es el cruce clásico del centro de ambas ciudades, apto para vehículos y peatones. Horario: 7:00 a.m. a 11:00 p.m.",
    facts: [
      "Del centro de Piedras Negras al centro de Eagle Pass",
      "Horario: 7:00 a.m. – 11:00 p.m.",
      "Cruce vehicular y peatonal",
    ],
  },
  {
    slug: "puente-eagle-pass-2",
    portNumber: "230302",
    name: "Puente Internacional II (Camino Real)",
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
  },

  // ─── Nuevo Laredo ───
  {
    slug: "puente-laredo-1",
    portNumber: "230401",
    name: "Puente Uno (Juárez–Lincoln)",
    nameUs: "Laredo Bridge I",
    citySlug: "nuevo-laredo",
    mapsQuery: "Laredo Convent Street Port of Entry Laredo TX",
    coords: { lat: 27.516, lng: -99.502 },
    description:
      "El Puente Uno (Juárez–Lincoln) une el centro de Nuevo Laredo con el centro de Laredo, Texas, terminando en la Convent Street y la I-35. Es el cruce más céntrico y el preferido para ir al downtown y a los outlets. Abre 24 horas con carriles normales, Ready Lane, SENTRI y peatonal.",
    facts: [
      "Del centro de Nuevo Laredo al downtown de Laredo",
      "Abierto 24 horas, todos los días",
      "Acceso directo a la I-35 hacia San Antonio",
    ],
  },
  {
    slug: "puente-laredo-2",
    portNumber: "230402",
    name: "Puente Dos (Convento)",
    nameUs: "Laredo Bridge II",
    citySlug: "nuevo-laredo",
    mapsQuery: "Laredo Bridge II Laredo TX",
    coords: { lat: 27.548, lng: -99.52 },
    description:
      "El Puente Dos cruza al oriente del Puente Uno y conecta con la zona de comercio de Laredo, Texas. Con más carriles que el del centro, suele mover el tráfico más rápido en horas pico. Abre 24 horas.",
    facts: [
      "Más carriles que el Puente Uno",
      "Abierto 24 horas, todos los días",
      "Acceso a la zona comercial de Laredo",
    ],
  },
  {
    slug: "puente-colombia",
    portNumber: "230403",
    name: "Puente Colombia (Solidaridad)",
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
  },

  // ─── Reynosa ───
  {
    slug: "puente-hidalgo",
    portNumber: "230501",
    name: "Puente Hidalgo–Reynosa",
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
    name: "Puente Pharr–Reynosa",
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
  },
  {
    slug: "puente-anzalduas",
    portNumber: "230503",
    name: "Puente Anzaldúas",
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
    name: "Puente Donna–Río Bravo",
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
    name: "Puente Camargo",
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
    name: "Puente Gateway",
    nameUs: "Gateway International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Gateway International Bridge Brownsville TX",
    coords: { lat: 25.901, lng: -97.434 },
    description:
      "El puente Gateway une el centro de Matamoros con el centro de Brownsville, Texas. Es el cruce peatonal más importante de la región: miles de personas cruzan a pie diariamente. Abre 24 horas con carriles normales, Ready Lane y peatonal.",
    facts: [
      "Del centro de Matamoros al centro de Brownsville",
      "Abierto 24 horas, todos los días",
      "El cruce peatonal más importante de la región",
    ],
  },
  {
    slug: "puente-bm",
    portNumber: "535501",
    name: "Puente B&M",
    nameUs: "B&M International Bridge",
    citySlug: "matamoros",
    mapsQuery: "B&M International Bridge Brownsville TX",
    coords: { lat: 25.899, lng: -97.425 },
    description:
      "El puente B&M (Veteranos) cruza al norte del centro de Matamoros hacia Brownsville. Histórico y compacto, es una alternativa al Gateway con líneas generalmente cortas. Abre 24 horas.",
    facts: [
      "Cruce histórico al norte del centro de Matamoros",
      "Abierto 24 horas, todos los días",
      "Alternativa tranquila al puente Gateway",
    ],
  },
  {
    slug: "puente-veterans",
    portNumber: "535502",
    name: "Puente Veterans (Libre)",
    nameUs: "Veterans International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Veterans International Bridge Brownsville TX",
    coords: { lat: 25.92, lng: -97.409 },
    description:
      "El puente Veterans (conocido como Puente Libre) es el cruce vehicular principal de Matamoros: conecta el este de la ciudad con Brownsville y la Expressway 77/83 hacia Harlingen y el norte del Valle. Abre de 6:00 a.m. a medianoche.",
    facts: [
      "El cruce vehicular principal de Matamoros",
      "Horario: 6:00 a.m. – 12:00 a.m.",
      "Acceso directo a la Expressway 77/83",
    ],
  },
  {
    slug: "puente-los-indios",
    portNumber: "535503",
    name: "Puente Los Indios",
    nameUs: "Los Indios International Bridge",
    citySlug: "matamoros",
    mapsQuery: "Los Indios International Bridge Los Indios TX",
    coords: { lat: 25.983, lng: -97.741 },
    description:
      "El puente Los Indios cruza al oeste de Matamoros, uniendo Lucio Blanco con Los Indios, Texas, camino a Harlingen y McAllen. Un cruce pequeño con líneas cortas la mayor parte del día. Horario: 6:00 a.m. a 10:00 p.m.",
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
    name: "Puente Presidio–Ojinaga",
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
