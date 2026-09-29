/**
 * Guías evergreen para temas cercanos con mucha búsqueda (SENTRI, Ready Lane,
 * I-94, qué puedo pasar, cruzar caminando). Cada dato se verificó contra la
 * fuente oficial listada en `sources`; al cambiar costos o requisitos,
 * actualiza también `updated`.
 */

export type Block =
  | string
  | { list: string[]; ordered?: boolean }
  | { table: { head: string[]; rows: string[][] } }
  | { note: string };

export interface GuiaSection {
  h2: string;
  blocks: Block[];
  /** Agrega la lista viva de cruces con ese carril según CBP. */
  laneDirectory?: "sentri" | "ready";
}

export interface Guia {
  slug: string;
  /** Nombre corto para la miga de pan. */
  short: string;
  title: string;
  metaTitle: string;
  description: string;
  published: string;
  updated: string;
  intro: string;
  sections: GuiaSection[];
  faqs: { q: string; a: string }[];
  /** Slugs de cruces relacionados. */
  related: string[];
  sources: { label: string; url: string }[];
  /** Consulta CBP en vivo para las secciones con `laneDirectory`. */
  laneDirectory?: boolean;
}

export const guias: Guia[] = [
  {
    slug: "sentri",
    short: "SENTRI",
    title: "SENTRI: qué es, cuánto cuesta y cómo tramitarla",
    metaTitle: "SENTRI 2026: qué es, costo ($120 USD), requisitos y cómo sacarla",
    description:
      "Todo sobre la SENTRI: qué es, cuánto cuesta en 2026, cuánto dura, qué documentos llevar a la entrevista, cómo agregar tu carro y en qué puentes y garitas hay carril SENTRI.",
    published: "2026-09-29",
    updated: "2026-09-29",
    intro:
      "La SENTRI es el programa de viajero confiable de U.S. Customs and Border Protection (CBP) para la frontera con México: si te aprueban, cruzas por carriles exclusivos que casi siempre tienen una fracción de la fila normal. Si cruzas seguido a Estados Unidos, es de los trámites que más tiempo te ahorran al año.",
    laneDirectory: true,
    sections: [
      {
        h2: "¿Qué es la SENTRI?",
        blocks: [
          "SENTRI (Secure Electronic Network for Travelers Rapid Inspection) es un programa de CBP que agiliza la entrada a Estados Unidos de viajeros pre-aprobados y considerados de bajo riesgo. Los miembros usan carriles dedicados en los puertos terrestres de la frontera sur, tanto en coche como —en garitas como San Ysidro— a pie.",
          "Para obtenerla pasas una revisión de antecedentes y una entrevista. A cambio recibes una tarjeta con chip que te da acceso a los carriles SENTRI; también sirve en los carriles [Ready Lane](/guias/ready-lane).",
        ],
      },
      {
        h2: "¿Cuánto cuesta la SENTRI en 2026?",
        blocks: [
          {
            table: {
              head: ["Concepto", "Costo (USD)"],
              rows: [
                ["Solicitud por persona (no reembolsable)", "$120"],
                ["Menores de 18 años, si el padre o tutor es miembro o aplica al mismo tiempo", "$0"],
                ["Agregar un vehículo después de la solicitud o renovación", "$42"],
                ["Reposición de tarjeta", "$25"],
              ],
            },
          },
          "El costo de $120 se paga completo al enviar la solicitud y aplica desde el 1 de octubre de 2024; antes eran $122.25 divididos en varios cobros. Si te rechazan, no se devuelve.",
          { note: "Puedes registrar hasta 4 vehículos y hasta 8 personas por vehículo. Todos los que viajen en el carro por el carril SENTRI deben ser miembros." },
        ],
      },
      {
        h2: "¿Cuánto dura la SENTRI?",
        blocks: [
          "La membresía dura 5 años y vence el día de tu cumpleaños. Puedes renovarla hasta un año antes de que venza sin perder el tiempo que te quede.",
        ],
      },
      {
        h2: "Cómo tramitar la SENTRI paso a paso",
        blocks: [
          {
            ordered: true,
            list: [
              "Crea tu cuenta del Trusted Traveler Program (TTP) en ttp.cbp.dhs.gov iniciando sesión con Login.gov. Cada solicitante necesita su propia cuenta, incluidos los menores.",
              "Llena la solicitud en línea y paga los $120.",
              "Espera la revisión de CBP. Si te dan aprobación condicional, agenda tu entrevista en un centro de inscripción SENTRI (Enrollment Center). Cada persona tiene su propia entrevista.",
              "Ve a la entrevista con tu pasaporte vigente, una identificación adicional, la tarjeta de circulación (registration) del vehículo y un comprobante de seguro de auto válido en Estados Unidos.",
              "Si te aprueban, recibes tu tarjeta SENTRI y puedes empezar a usar los carriles.",
            ],
          },
          "Desde el 15 de septiembre de 2026, la app oficial “Trusted Traveler” de CBP reemplaza a las apps anteriores: desde ahí puedes solicitar, agendar tu entrevista y renovar la SENTRI.",
          "Desde 2024 el vehículo ya no se inspecciona en el centro de inscripción; CBP puede revisarlo en inspección secundaria cuando cruces.",
        ],
      },
      {
        h2: "¿SENTRI incluye Global Entry?",
        blocks: [
          "Depende de tu nacionalidad. Los ciudadanos y residentes permanentes de Estados Unidos con SENTRI pueden usar los kioscos de Global Entry en aeropuertos. Los ciudadanos mexicanos no lo reciben automáticamente: necesitan una evaluación de riesgo del gobierno de México y hacer la solicitud por separado desde su cuenta TTP.",
        ],
      },
      {
        h2: "¿En qué puentes y garitas hay carril SENTRI?",
        blocks: [
          "Esta lista se arma sola con los carriles que U.S. CBP reporta hoy para vehículos. Toca un cruce para ver cuánto tarda la línea SENTRI en este momento:",
        ],
        laneDirectory: "sentri",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta la SENTRI en 2026?",
        a: "La solicitud cuesta $120 dólares por persona (no reembolsable). Los menores de 18 no pagan si su padre, madre o tutor es miembro o aplica al mismo tiempo. Agregar un vehículo después cuesta $42.",
      },
      {
        q: "¿Cuántos años dura la SENTRI?",
        a: "Cinco años. Vence el día de tu cumpleaños y puedes renovarla hasta un año antes sin perder tiempo de vigencia.",
      },
      {
        q: "¿Qué documentos llevo a la entrevista de SENTRI?",
        a: "Pasaporte vigente, una identificación adicional, la tarjeta de circulación del vehículo que vas a registrar y comprobante de seguro de auto válido en Estados Unidos.",
      },
      {
        q: "¿Puedo usar la SENTRI en Ready Lane?",
        a: "Sí. La tarjeta SENTRI tiene chip RFID y es uno de los documentos aceptados en los carriles [Ready Lane](/guias/ready-lane).",
      },
    ],
    related: ["san-ysidro", "otay-mesa", "paso-del-norte", "puente-zaragoza", "puente-hidalgo", "puente-acuna-del-rio"],
    sources: [
      { label: "CBP — SENTRI", url: "https://www.cbp.gov/travel/trusted-traveler-programs/sentri" },
      { label: "CBP — Cómo solicitar SENTRI", url: "https://www.cbp.gov/travel/trusted-traveler-programs/sentri/how-apply-sentri" },
      {
        label: "CBP — Costo de la solicitud SENTRI",
        url: "https://www.cbp.gov/travel/trusted-traveler-programs/sentri/how-apply-sentri/non-refundable-application-fee",
      },
      { label: "CBP — Renovación de SENTRI", url: "https://www.cbp.gov/travel/trusted-traveler-programs/sentri/sentri-renewal" },
      { label: "CBP — Beneficios de SENTRI", url: "https://www.cbp.gov/travel/trusted-traveler-programs/sentri/benefits-sentri" },
      { label: "CBP — App Trusted Traveler", url: "https://www.cbp.gov/travel/trusted-traveler-programs/trusted-traveler-mobile-app" },
      { label: "Trusted Traveler Programs (solicitud)", url: "https://ttp.cbp.dhs.gov" },
    ],
  },
  {
    slug: "ready-lane",
    short: "Ready Lane",
    title: "Ready Lane: qué es y qué documentos sirven",
    metaTitle: "Ready Lane: qué es, qué documentos aceptan y dónde hay (2026)",
    description:
      "Qué es la Ready Lane, qué documentos con chip RFID aceptan (visa láser, passport card, green card, SENTRI), quién debe traerlos y en qué puentes y garitas hay Ready Lane en coche y a pie.",
    published: "2026-09-29",
    updated: "2026-09-29",
    intro:
      "La Ready Lane es un carril para quienes cruzan con documentos que tienen chip RFID. No necesitas inscribirte a nada: si todos en el carro traen una tarjeta con chip, puedes formarte ahí y normalmente avanzar más rápido que en la línea normal.",
    laneDirectory: true,
    sections: [
      {
        h2: "¿Qué es la Ready Lane?",
        blocks: [
          "Son carriles dedicados —en coche y, en algunas garitas, a pie— para viajeros que traen tarjetas con tecnología RFID. El lector del carril lee tu tarjeta antes de que llegues con el oficial, así que la inspección es más rápida.",
          "A diferencia de la [SENTRI](/guias/sentri), la Ready Lane no requiere solicitud, entrevista ni pago extra: solo necesitas el documento correcto.",
        ],
      },
      {
        h2: "Documentos aceptados en Ready Lane",
        blocks: [
          "Según CBP, los documentos con chip RFID que sirven en Ready Lane son:",
          {
            list: [
              "Tarjeta de cruce fronterizo (Border Crossing Card, la “visa láser”) con chip RFID",
              "Tarjeta de residente permanente (green card) con chip RFID",
              "U.S. Passport Card (el pasaporte en formato tarjeta)",
              "Licencia de manejo mejorada (Enhanced Driver's License) o tarjeta tribal mejorada",
              "Tarjetas de viajero confiable: SENTRI, NEXUS, Global Entry y FAST",
            ],
          },
          { note: "El pasaporte estadounidense en libreta no aparece en la lista de documentos de Ready Lane. Si solo traes la libreta, fórmate en la línea normal." },
        ],
      },
      {
        h2: "¿Todos en el carro necesitan documento con chip?",
        blocks: [
          "Sí. Todas las personas de 16 años o más en el vehículo (o en tu grupo, si cruzas a pie) deben traer una tarjeta con chip RFID. Pueden ser tarjetas distintas: por ejemplo, una visa láser y una passport card en el mismo carro está bien.",
          "Consejo: ten todas las tarjetas a la mano antes de llegar al lector, separadas de otras tarjetas con chip (bancarias o de acceso) que puedan interferir con la lectura.",
        ],
      },
      {
        h2: "Ready Lane a pie",
        blocks: [
          "También existe Ready Lane peatonal. U.S. CBP la reporta en la [Garita San Ysidro](/puente/san-ysidro) (línea peatonal principal), en [El Chaparral / PedWest](/puente/pedwest-el-chaparral) y en el [Cross Border Xpress](/puente/cbx), entre otros cruces.",
        ],
      },
      {
        h2: "¿En qué puentes y garitas hay Ready Lane?",
        blocks: ["Lista viva, con los carriles vehiculares que U.S. CBP reporta hoy. Toca uno para ver la espera de la Ready Lane ahora:"],
        laneDirectory: "ready",
      },
    ],
    faqs: [
      {
        q: "¿Puedo usar la Ready Lane con visa láser?",
        a: "Sí, si tu tarjeta de cruce fronterizo (visa láser) tiene chip RFID. Todos los mayores de 16 en el carro deben traer un documento con chip.",
      },
      {
        q: "¿Puedo usar la Ready Lane con pasaporte?",
        a: "Con la U.S. Passport Card sí. El pasaporte estadounidense en libreta no está en la lista de documentos de Ready Lane de CBP.",
      },
      {
        q: "¿La Ready Lane cuesta?",
        a: "No. No hay inscripción ni pago: solo necesitas un documento con chip RFID aceptado por CBP.",
      },
      {
        q: "¿Qué pasa si alguien en el carro no trae documento con chip?",
        a: "No deben usar la Ready Lane. Todas las personas de 16 años o más necesitan una tarjeta con RFID; si no, fórmense en la línea normal.",
      },
    ],
    related: ["san-ysidro", "otay-mesa", "puente-libre", "paso-del-norte", "puente-laredo-2", "puente-hidalgo"],
    sources: [
      { label: "CBP — Ready Lanes", url: "https://www.cbp.gov/travel/clearing-customs/ready-lanes" },
      { label: "CBP — Tiempos de espera en la frontera", url: "https://bwt.cbp.gov" },
    ],
  },
  {
    slug: "permiso-i94",
    short: "Permiso I-94",
    title: "Permiso I-94: cuándo lo necesitas y cómo sacarlo",
    metaTitle: "Permiso I-94 2026: cuándo se necesita, costo y cómo sacarlo en línea",
    description:
      "Cuándo necesitas el permiso I-94 si cruzas con visa láser, cuánto cuesta en 2026, hasta dónde puedes ir sin él (25, 55 o 75 millas) y cómo tramitarlo en línea o en la app CBP Link antes de llegar a la garita.",
    published: "2026-09-29",
    updated: "2026-09-29",
    intro:
      "Si cruzas con visa láser (tarjeta de cruce fronterizo) para ir de compras o de visita cerca de la frontera, normalmente no necesitas permiso I-94. Pero si vas más lejos o te quedas más de 30 días, sí. Aquí te explicamos cuándo aplica, cuánto cuesta y cómo sacarlo en línea para no hacer doble fila.",
    sections: [
      {
        h2: "¿Cuándo necesito el permiso I-94?",
        blocks: [
          "Con la tarjeta de cruce fronterizo puedes estar hasta 30 días dentro de la “zona fronteriza” sin I-94. Necesitas el permiso si te vas a quedar más de 30 días o si vas a ir más allá de estos límites:",
          {
            table: {
              head: ["Estado", "Hasta dónde puedes ir sin I-94"],
              rows: [
                ["California", "25 millas (40 km) de la frontera"],
                ["Texas", "25 millas (40 km) de la frontera"],
                ["Nuevo México", "55 millas (88 km) de la frontera, o al sur de la I-10, lo que quede más al norte"],
                ["Arizona", "75 millas (120 km) si entraste por Sasabe, Nogales, Mariposa, Naco o Douglas; 25 millas si entraste por otro puerto (como Lukeville o San Luis)"],
              ],
            },
          },
          "Ejemplos: si cruzas por Nogales y vas a Tucson, estás dentro de las 75 millas; si vas a Phoenix, necesitas I-94. Si cruzas por Juárez y vas a Las Cruces, revisa la regla de Nuevo México; si vas a San Antonio desde Laredo, necesitas I-94.",
        ],
      },
      {
        h2: "¿Cuánto cuesta el I-94?",
        blocks: [
          "En la frontera terrestre el I-94 cuesta $30 dólares por persona: los $6 de siempre más un cargo de $24 que agregó la ley de presupuesto de Estados Unidos de julio de 2025. Se cobra así desde el 30 de septiembre de 2025.",
          { note: "Esa ley obliga a ajustar el cargo cada año por inflación, y el año fiscal 2027 de Estados Unidos empieza el 1 de octubre de 2026. Antes de pagar, confirma el costo vigente en i94.cbp.dhs.gov." },
        ],
      },
      {
        h2: "Cómo sacar el I-94 en línea (antes de llegar)",
        blocks: [
          {
            ordered: true,
            list: [
              "Entra a i94.cbp.dhs.gov o descarga la app oficial CBP Link (la app CBP One ya no existe con ese nombre; sus funciones pasaron a CBP Link).",
              "Llena la solicitud del I-94 provisional con los datos de tu pasaporte y visa, y paga en línea.",
              "Preséntate en un puerto de entrada terrestre dentro de los 7 días siguientes para que un oficial lo finalice. Si no llegas en ese plazo, el permiso provisional vence y tienes que pagar otra vez.",
            ],
          },
          "Al presentarte, lleva comprobantes de residencia y de solvencia en México (por ejemplo, comprobante de domicilio, trabajo o estados de cuenta). Todos los miembros de la familia que van a recibir el permiso deben estar presentes.",
        ],
      },
      {
        h2: "¿Cuánto dura el permiso I-94?",
        blocks: [
          "Por lo general se otorga hasta por 6 meses y sirve para varias entradas mientras esté vigente, pero la fecha exacta la decide el oficial de CBP: revisa siempre la fecha límite en tu registro en i94.cbp.dhs.gov.",
        ],
      },
      {
        h2: "Consejos para no perder tiempo en la garita",
        blocks: [
          {
            list: [
              "Tramítalo en línea antes de salir: así solo pasas a finalizarlo y evitas llenar todo en la oficina.",
              "Evita las horas pico para ir a la oficina de I-94; revisa la [mejor hora para cruzar](/mejor-hora-para-cruzar) de tu ciudad.",
              "Si vas muy lejos o te quedas mucho tiempo, cuida la fecha de salida: quedarte más de lo permitido puede costarte la visa.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta el permiso I-94 en 2026?",
        a: "$30 dólares por persona en la frontera terrestre desde el 30 de septiembre de 2025. El cargo se ajusta cada año por inflación, así que confirma el costo vigente en i94.cbp.dhs.gov antes de pagar.",
      },
      {
        q: "¿Necesito I-94 para ir a San Antonio o a Phoenix?",
        a: "Sí. San Antonio está a más de 25 millas de la frontera de Texas, y Phoenix a más de 75 millas de la frontera de Arizona, así que con visa láser necesitas el I-94.",
      },
      {
        q: "¿Puedo sacar el I-94 en línea?",
        a: "Sí. Puedes solicitar un I-94 provisional en i94.cbp.dhs.gov o en la app CBP Link, pagar en línea y presentarte en un puerto terrestre dentro de los 7 días siguientes para finalizarlo.",
      },
      {
        q: "¿Todavía existe la app CBP One para el I-94?",
        a: "No con ese nombre. Las funciones de CBP One para viajeros pasaron a la app CBP Link, lanzada en junio de 2025.",
      },
    ],
    related: ["puente-mariposa", "puente-deconcini", "puente-laredo-2", "puente-libre", "san-ysidro", "puente-hidalgo"],
    sources: [
      { label: "CBP — I-94 para visitantes internacionales", url: "https://www.cbp.gov/travel/international-visitors/i-94" },
      { label: "Sitio oficial del I-94", url: "https://i94.cbp.dhs.gov" },
      { label: "8 CFR 235.1 — Límites de la zona fronteriza", url: "https://www.law.cornell.edu/cfr/text/8/235.1" },
      { label: "CBP — App CBP Link", url: "https://www.cbp.gov/about/mobile-apps-directory/cbplink" },
      {
        label: "CBP — Recomendaciones para obtener el I-94",
        url: "https://www.cbp.gov/newsroom/local-media-release/cbp-reminds-travelers-obtain-i-94-permit-early",
      },
    ],
  },
  {
    slug: "que-puedo-pasar",
    short: "Qué puedo pasar",
    title: "Qué puedes pasar por la garita (de ida y de regreso)",
    metaTitle: "¿Qué puedo pasar de Estados Unidos a México y de México a EU? (2026)",
    description:
      "Franquicia de 500 dólares al entrar a México, qué comida no puedes pasar a Estados Unidos (huevo, frutas, carne de puerco), límites de alcohol y tabaco, y cuándo declarar dinero. Actualizado a 2026.",
    published: "2026-09-29",
    updated: "2026-09-29",
    intro:
      "Declarar mal (o no declarar) es de las formas más rápidas de pasar un mal rato en la garita. Estas son las reglas vigentes para lo que traes de compras a México y lo que puedes —y no puedes— pasar a Estados Unidos.",
    sections: [
      {
        h2: "Al entrar a México: la franquicia de 500 dólares",
        blocks: [
          "Desde el 22 de octubre de 2025, la franquicia para pasajeros residentes en México es de 500 dólares por persona, sin importar si entras por tierra, aire o mar (Reglas Generales de Comercio Exterior 2026, regla 3.2.3). Ya no existe el límite de 300 dólares por tierra.",
          {
            list: [
              "Los integrantes de una familia que entran juntos en el mismo vehículo pueden sumar sus franquicias.",
              "Lo que exceda la franquicia paga una tasa global de 19% sobre el valor, para compras de hasta 3,000 dólares (regla 3.2.2).",
              "El alcohol y el tabaco no cuentan dentro de la franquicia (ver abajo).",
            ],
          },
          {
            note: "Si vives en la franja fronteriza y cruzas seguido, hay una regla aparte para compras de consumo personal (regla 3.4.1): hasta 150 dólares por día, o 400 si viajan más de 2 personas en el vehículo. No incluye alcohol, cerveza, tabaco ni combustible.",
          },
        ],
      },
      {
        h2: "Alcohol y tabaco que puedes entrar a México",
        blocks: [
          "Si eres mayor de 18 años puedes traer, además de tu franquicia: hasta 3 litros de bebidas alcohólicas y 6 litros de vino, y hasta 20 cajetillas de cigarros, 25 puros o 200 gramos de tabaco.",
        ],
      },
      {
        h2: "Al entrar a Estados Unidos: declara toda la comida",
        blocks: [
          "La regla de oro de CBP: declara todos los alimentos y productos agrícolas que traigas. Si lo declaras y no se puede pasar, simplemente lo dejas sin multa. Si no lo declaras y te lo encuentran, te lo quitan y te pueden multar desde 300 dólares la primera vez.",
          "Productos de México que no puedes pasar a Estados Unidos:",
          {
            list: [
              "Huevo fresco o crudo y pollo crudo o aves vivas (por gripe aviar y enfermedad de Newcastle). El huevo cocido también requiere permiso.",
              "Naranja, toronja, mandarina, naranja agria y lima.",
              "Guayaba, mango, durazno, granada, manzana y caña de azúcar entera.",
              "Jamón, carne de puerco, chicharrón y bolonia.",
              "Flor de cempasúchil, murraya (limonaria), tierra y plantas en maceta.",
              "Aguacate: solo pelado, en mitades, sin hueso y en líquido o empacado al vacío.",
            ],
          },
          "Normalmente sí se permiten: pan y productos horneados sin carne, ciertos quesos, condimentos, especias empacadas, miel, café y té. Aun así, decláralos.",
        ],
      },
      {
        h2: "Alcohol y tabaco que puedes pasar a Estados Unidos",
        blocks: [
          {
            list: [
              "Límite federal libre de impuestos: 1 litro de alcohol si tienes 21 años o más.",
              "Visitantes: 200 cigarros, 50 puros o 2 kg de tabaco.",
              "Residentes de Estados Unidos que regresan de México: 1 litro cada 30 días y 1 cartón de cigarros al mes.",
              "Texas: la comisión estatal de bebidas (TABC) permite importar hasta 1 galón de licor, o 3 galones de vino, o 24 cervezas de 12 onzas, una vez cada 30 días, si tienes 21 años o más y pagas el impuesto estatal en el puerto.",
            ],
          },
        ],
      },
      {
        h2: "Dinero en efectivo: cuándo declararlo",
        blocks: [
          "En los dos países debes declarar si traes más de 10,000 dólares (o su equivalente) en efectivo o documentos: en Estados Unidos, en total por familia o grupo, con el formulario FinCEN 105; en México, con la forma de declaración de aduana. Traer más no está prohibido; no declararlo sí.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuánto es la franquicia para entrar a México por tierra en 2026?",
        a: "500 dólares por persona, igual que por avión o barco, desde el 22 de octubre de 2025. Los integrantes de una familia que viajan juntos en el mismo vehículo pueden sumarla.",
      },
      {
        q: "¿Puedo pasar huevo de México a Estados Unidos?",
        a: "No. El huevo fresco o crudo está prohibido por la gripe aviar, y el huevo cocido también requiere permiso. Tampoco el pollo crudo ni aves vivas.",
      },
      {
        q: "¿Qué frutas no puedo pasar a Estados Unidos?",
        a: "Entre otras: naranja, toronja, mandarina, lima, guayaba, mango, durazno, granada, manzana y caña de azúcar. Declara siempre toda la fruta que traigas.",
      },
      {
        q: "¿Cuánto alcohol puedo pasar a Estados Unidos?",
        a: "Libre de impuestos, 1 litro si tienes 21 años o más. En Texas puedes pasar más (hasta 1 galón de licor, 3 de vino o 24 cervezas) una vez cada 30 días pagando el impuesto estatal.",
      },
    ],
    related: ["paso-del-norte", "san-ysidro", "puente-hidalgo", "puente-laredo-1", "puente-deconcini", "puente-gateway"],
    sources: [
      {
        label: "DOF — Reglas Generales de Comercio Exterior 2026 (27/12/2025)",
        url: "https://dof.gob.mx/nota_detalle.php?codigo=5777199&fecha=27/12/2025",
      },
      { label: "ANAM — Residentes de la franja fronteriza", url: "https://www.anam.gob.mx/residentes-de-la-franja-fronteriza/" },
      { label: "CBP — Productos agrícolas", url: "https://www.cbp.gov/travel/international-visitors/agricultural-items" },
      {
        label: "CBP — Artículos prohibidos y restringidos",
        url: "https://www.cbp.gov/travel/us-citizens/know-before-you-go/prohibited-and-restricted-items",
      },
      { label: "CBP — Requisitos al regresar de México", url: "https://www.cbp.gov/travel/us-citizens/cbp-reqs-mexico" },
      { label: "CBP — Dinero e instrumentos monetarios", url: "https://www.cbp.gov/travel/international-visitors/money-monetary-instruments" },
      { label: "TABC — Importación personal en puertos de entrada", url: "https://www.tabc.texas.gov/faqs/personal-importation-ports-of-entry-faqs/" },
    ],
  },
  {
    slug: "cruzar-caminando-tijuana-san-diego",
    short: "Cruzar caminando Tijuana–San Diego",
    title: "Cómo cruzar caminando de Tijuana a San Diego",
    metaTitle: "Cruzar caminando de Tijuana a San Diego: San Ysidro, PedWest, Otay o CBX",
    description:
      "Las 4 formas de cruzar a pie de Tijuana a San Diego: San Ysidro (PedEast), El Chaparral/PedWest, Otay y el CBX del aeropuerto. Horarios, Ready Lane y SENTRI peatonal, y cómo tomar el trolley.",
    published: "2026-09-29",
    updated: "2026-09-29",
    intro:
      "Cruzar a pie suele ser más rápido que en carro en las horas pico, y en Tijuana tienes cuatro opciones. Aquí te decimos cuál conviene según tu destino y tu horario, y dónde revisar la línea en vivo antes de salir.",
    sections: [
      {
        h2: "Las 4 opciones para cruzar a pie",
        blocks: [
          {
            table: {
              head: ["Cruce", "Horario (según CBP)", "Carriles peatonales"],
              rows: [
                ["[Garita San Ysidro](/puente/san-ysidro) (PedEast)", "24 horas", "Normal, Ready Lane y SENTRI"],
                ["[El Chaparral / PedWest](/puente/pedwest-el-chaparral)", "6:00 a.m. – 2:00 p.m., entre semana", "Normal y Ready Lane"],
                ["[Garita de Otay](/puente/otay-mesa)", "24 horas", "Peatonal"],
                ["[Cross Border Xpress (CBX)](/puente/cbx)", "24 horas", "Normal y Ready Lane (solo con boleto de avión)"],
              ],
            },
          },
        ],
      },
      {
        h2: "San Ysidro (PedEast): la opción principal",
        blocks: [
          "Es el cruce peatonal principal y abre las 24 horas. Tiene tres filas: la general, la Ready Lane (con documento con chip, ver [nuestra guía](/guias/ready-lane)) y la de SENTRI y viajero confiable. Del lado de San Diego sales directo al San Ysidro Transit Center, donde termina la línea azul (Blue Line) del trolley hacia el centro de San Diego.",
        ],
      },
      {
        h2: "El Chaparral / PedWest: la alternativa de la mañana",
        blocks: [
          "PedWest está al oeste de San Ysidro; en Tijuana se entra por la zona de El Chaparral y del lado estadounidense sales al final de Virginia Avenue, junto a Las Americas Premium Outlets y al Virginia Avenue Transit Center. Muchas mañanas avanza más rápido que PedEast, pero tiene horario reducido: según la página de CBP, de 6:00 a.m. a 2:00 p.m., de lunes a viernes.",
          { note: "Antes de ir, revisa en [la página de PedWest](/puente/pedwest-el-chaparral) si CBP la reporta abierta y cuánto tarda la línea." },
        ],
      },
      {
        h2: "Otay: si vas al este del condado",
        blocks: [
          "La [garita de Otay](/puente/otay-mesa) también tiene cruce peatonal las 24 horas. Conviene si vives en el este de Tijuana o tu destino está en Otay Mesa o sobre la SR-905, y suele ser la alternativa cuando la línea de San Ysidro está muy larga.",
        ],
      },
      {
        h2: "Cross Border Xpress (CBX): solo si vuelas desde Tijuana",
        blocks: [
          "El [CBX](/puente/cbx) es un puente peatonal privado que conecta directo con el Aeropuerto de Tijuana. Solo lo puedes usar con boleto de avión: según las condiciones del servicio, hacia México hasta 24 horas antes de tu vuelo y hacia Estados Unidos hasta 2 horas después de aterrizar.",
          "El boleto del puente se paga aparte; sus precios publicados empiezan en 31.99 dólares sencillo y 51.99 dólares redondo en temporada regular (más en temporada alta). Revisa el precio vigente en crossborderxpress.com.",
        ],
      },
      {
        h2: "Consejos para cruzar a pie más rápido",
        blocks: [
          {
            list: [
              "Revisa [cómo está la línea en Tijuana](/ciudad/tijuana) antes de salir: la diferencia entre PedEast y PedWest puede ser de más de una hora.",
              "Si tu documento tiene chip RFID, usa la Ready Lane peatonal.",
              "Evita las horas pico de la mañana entre semana, cuando cruzan trabajadores y estudiantes; revisa la [mejor hora para cruzar San Ysidro](/mejor-hora-para-cruzar/tijuana/san-ysidro).",
              "Si vas más allá de 25 millas o te quedas más de 30 días, necesitas el [permiso I-94](/guias/permiso-i94).",
              "Declara toda la comida que traigas: hay productos que no pueden pasar ([ver la lista](/guias/que-puedo-pasar)).",
            ],
          },
        ],
      },
      {
        h2: "Para regresar a México a pie",
        blocks: [
          "Si eres extranjero, para entrar a México necesitas la Forma Migratoria Múltiple (FMM): puedes iniciarla en línea en el sitio del Instituto Nacional de Migración (inm.gob.mx/fmme) y debes sellarla al cruzar. Los horarios de los cruces peatonales hacia México pueden cambiar; confírmalos en sitio.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuál es el horario de PedWest (El Chaparral)?",
        a: "Según la página de CBP, de 6:00 a.m. a 2:00 p.m., de lunes a viernes. Revisa en esta página si CBP la reporta abierta antes de ir.",
      },
      {
        q: "¿La garita peatonal de San Ysidro abre las 24 horas?",
        a: "Sí. El cruce peatonal principal de San Ysidro (PedEast) abre las 24 horas, con filas general, Ready Lane y SENTRI.",
      },
      {
        q: "¿Puedo cruzar por el CBX sin boleto de avión?",
        a: "No. El Cross Border Xpress es exclusivo para pasajeros con boleto de avión del Aeropuerto de Tijuana, y el cruce se paga aparte.",
      },
      {
        q: "¿Dónde tomo el trolley después de cruzar por San Ysidro?",
        a: "En el San Ysidro Transit Center, junto a la salida del cruce peatonal: ahí termina la línea azul (UC San Diego Blue Line) del trolley hacia el centro de San Diego.",
      },
    ],
    related: ["san-ysidro", "pedwest-el-chaparral", "otay-mesa", "cbx"],
    sources: [
      { label: "CBP — Puerto de San Ysidro (horarios)", url: "https://www.cbp.gov/about/contact/ports/san-ysidro-class-california-2504" },
      { label: "CBP — Tiempos de espera en la frontera", url: "https://bwt.cbp.gov" },
      { label: "Cross Border Xpress — Boletos", url: "https://www.crossborderxpress.com/en/tickets/" },
      { label: "San Diego MTS — Trolley", url: "https://www.sdmts.com" },
      { label: "INM — Forma Migratoria Múltiple electrónica", url: "https://www.inm.gob.mx/fmme" },
    ],
  },
];

export const guiasBySlug = new Map(guias.map((g) => [g.slug, g]));
