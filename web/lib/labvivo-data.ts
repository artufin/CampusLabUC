import {
  type ChallengeCategory,
  type Experience,
  type OpenDataDataset,
  type OpenDataEntry,
  type Opportunity,
  type PaginatedProjects,
  type Person,
  type PersonGroup,
  type Project,
  type Sponsor,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_LABVIVO_API_URL;

const PLACEHOLDER_PHOTO = "/assets/photos/andres_villela_v2.png";
const PLACEHOLDER_IMAGE = "/assets/photos/experiencia_img.png";

const FALLBACK_PEOPLE: Person[] = [
  {
    id: "exec-1",
    group: "executive",
    name: "Andres Villela",
    role: "Profesor de la Escuela de Diseno UC",
    bio: "the goat.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "andres.villela@uc.cl",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "exec-2",
    group: "executive",
    name: "Enzo Loiza",
    role: "Coordinacion de proyectos de innovacion",
    bio: "Lidera la articulacion de experiencias docentes en territorio y campus vivo.",
    photoUrl: "/assets/photos/enzoloiz.jpeg",
    social: {
      email: "TODO@uc.cl",
      linkedin: "https://linkedin.com/in/TODO",
    },
  },
  {
    id: "exec-3",
    group: "executive",
    name: "Catalina Ortega",
    role: "Investigacion aplicada y datos abiertos",
    bio: "Impulsa el uso de repositorios abiertos para desafios interdisciplinarios.",
    photoUrl: "/assets/photos/catort.jpeg",
    social: {
      email: "TODO@uc.cl",
      linkedin: "https://linkedin.com/in/TODO",
    },
  },
  {
    id: "exec-4",
    group: "executive",
    name: "Esteban Beros",
    role: "Estudiante de Ingenieria UC",
    bio: "Desarrollador de la plataforma CampusLab UC y colaborador en su implementacion tecnica.",
    photoUrl: "/assets/photos/teb.png",
    social: {
      email: "TODO@uc.cl",
      linkedin: "https://linkedin.com/in/TODO",
    },
  },
  {
    id: "exec-5",
    group: "executive",
    name: "Arturo Herreros",
    role: "Estudiante de Ingenieria UC",
    bio: "Desarrollador de la plataforma CampusLab UC y colaborador en su arquitectura de frontend.",
    photoUrl: "/assets/photos/arturo.png",
    social: {
      email: "TODO@uc.cl",
      linkedin: "https://linkedin.com/in/TODO",
    },
  },
  {
    id: "academic-1",
    group: "academic",
    name: "Leoncio Cabrera",
    role: "Academica asociada - Arquitectura",
    bio: "Acompana desafios de energia, habitabilidad y urbanismo regenerativo.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "valentina.riquelme@uc.cl",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-2",
    group: "academic",
    name: "Rodrigo Carrasco",
    role: "Academico asociado - Ingenieria",
    bio: "Disena pilotos de residuos y movilidad con seguimiento de impacto.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "nicolas.becerra@uc.cl",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-3",
    group: "academic",
    name: "José Miguel Cardemil",
    role: "Academica asociada - Ecologia",
    bio: "Vincula investigacion de biodiversidad con cursos y tesis en campus.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "marta.olivares@uc.cl",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-4",
    group: "academic",
    name: "Patricia Galilea",
    role: "Academico asociado - Diseno estrategico",
    bio: "Facilita codiseno con estudiantes y actores comunitarios.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "javier.cifuentes@uc.cl",
      linkedin: "https://linkedin.com",
    },
  },
];

const FALLBACK_ASSOCIATED_MEMBERS = [
  "Prof. Luis Cifuentes", 
  "Vicente Iglesias", 
  "Javiera Escudero", 
  "Angel Ortiz", 
  "Benjamín Fuentemivida", 
  "Catalina Arce", 
  "María José Araya", 
  "Dominique del Castillo", 
  "Catalina Figueroa", 
  "Gian Jara", 
  "María José Marzá", 
  "Camille Olguín", 
  "Itzae Flores", 
  "Maximiliano Frey", 
  "Ignacio Godoy", 
  "Francisco E. Parulla", 
  "Javier Arriagada", 
  "Josefa Casado",
  "Denise Salinas",
  "Catalina Ortega"
];

const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "Forestacion en Campus San Joaquin",
    summary:
      "Piloto de restauracion de biodiversidad en areas de alto trafico estudiantil.",
    imageUrl: PLACEHOLDER_IMAGE,
    location: "Campus San Joaquin",
    date: "Marzo 2025",
    tags: ["Biodiversidad", "Areas verdes"],
    body:
      "Junto a la Direccion de Sustentabilidad se identificaron zonas de alto trafico estudiantil con baja cobertura vegetal. El piloto plantio especies nativas y midio su tasa de sobrevivencia durante dos semestres, generando una guia replicable para otras areas del campus.",
  },
  {
    id: "exp-2",
    title: "Vermicompost en San Joaquin",
    summary:
      "Sistema de compostaje para residuos organicos de casino universitario.",
    imageUrl: PLACEHOLDER_IMAGE,
    location: "Casino central, Campus San Joaquin",
    date: "Agosto 2024",
    tags: ["Residuos", "Economia circular"],
    body:
      "Estudiantes de Ingenieria disenaron un sistema de vermicompostaje para procesar los residuos organicos del casino central. El compost resultante se utiliza en las areas verdes del campus, cerrando el ciclo de materia organica dentro del propio territorio universitario.",
  },
  {
    id: "exp-3",
    title: "Jardines infantiles",
    summary:
      "Programa de co-diseno de espacios verdes para aprendizaje temprano.",
    imageUrl: PLACEHOLDER_IMAGE,
    location: "Jardin infantil UC",
    date: "Octubre 2024",
    tags: ["Co-diseno", "Educacion"],
    body:
      "Un equipo interdisciplinario trabajo junto a educadoras del jardin infantil UC para rediseñar espacios exteriores como herramientas de aprendizaje temprano, integrando huertos, sombra natural y mobiliario de bajo impacto.",
  },
  {
    id: "exp-4",
    title: "Monitoreo de movilidad activa",
    summary:
      "Levantamiento y visualizacion de rutas peatonales y ciclistas internas.",
    imageUrl: PLACEHOLDER_IMAGE,
    location: "Campus San Joaquin",
    date: "Mayo 2025",
    tags: ["Movilidad", "Datos abiertos"],
    body:
      "Se desplegaron contadores temporales en los accesos y ciclovias internas del campus para entender los flujos de movilidad activa. Los resultados alimentan directamente el modulo de datos abiertos del Campus Lab.",
  },
  {
    id: "exp-5",
    title: "Laboratorio de agua de lluvia",
    summary:
      "Prototipo de captacion y uso de aguas lluvias para riego de zonas piloto.",
    imageUrl: PLACEHOLDER_IMAGE,
    location: "Facultad de Ingenieria",
    date: "Junio 2024",
    tags: ["Agua", "Prototipado"],
    body:
      "Estudiantes de pregrado construyeron un prototipo de captacion de aguas lluvias para el riego de areas piloto, evaluando su rendimiento frente a distintos eventos de precipitacion durante un semestre completo.",
  },
];

const FALLBACK_SPONSORS: Sponsor[] = [
  {
    id: "sponsor-1",
    name: "CDI Chile",
    logoUrl: "/assets/sponsors/cdi_logo.png",
  },
  {
    id: "sponsor-2",
    name: "FabLab Universidad de Chile",
    logoUrl: "/assets/sponsors/fablab_logo.png",
  },
  {
    id: "sponsor-3",
    name: "Santander",
    logoUrl: "/assets/sponsors/santander_logo.png",
  },
];

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "project-2",
    title: "Riego inteligente en patios de innovacion",
    description:
      "Integracion de sensores y rutinas de riego para reducir consumo hidrico en zonas de aprendizaje.",
    contactName: "Valentina Riquelme",
    contactEmail: "valentina.riquelme@uc.cl",
    tags: ["Agua", "IoT"],
    challengeType: "Energia y construccion",
    engagementLevel: "Tesis de magister",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-3",
    title: "Compostaje colaborativo",
    description:
      "Modelo de economia circular para residuos organicos en cafeterias universitarias.",
    contactName: "Nicolas Becerra",
    contactEmail: "nicolas.becerra@uc.cl",
    tags: ["Residuos", "Sostenibilidad"],
    challengeType: "Residuos",
    engagementLevel: "Ayudantia",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-4",
    title: "Observatorio de flora y fauna",
    description:
      "Registro abierto de biodiversidad para actividades de docencia e investigacion.",
    contactName: "Marta Olivares",
    contactEmail: "marta.olivares@uc.cl",
    tags: ["Biodiversidad", "Datos"],
    challengeType: "Flora y fauna",
    engagementLevel: "Investigacion de pregrado",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-5",
    title: "Mapeo de movilidad activa",
    description:
      "Cartografia participativa de rutas seguras de caminata y bicicleta entre campus.",
    contactName: "Javier Cifuentes",
    contactEmail: "javier.cifuentes@uc.cl",
    tags: ["Movilidad", "Participacion"],
    challengeType: "Transporte",
    engagementLevel: "Proyecto docente",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-6",
    title: "Aulas de sombra",
    description:
      "Instalaciones temporales para confort termico y actividades de aprendizaje al aire libre.",
    contactName: "Daniela Saldias",
    contactEmail: "daniela.saldias@uc.cl",
    tags: ["Confort", "Diseno"],
    challengeType: "Energia y construccion",
    engagementLevel: "Practica profesional",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-7",
    title: "Laboratorio de vinculacion comunitaria",
    description:
      "Programa de co-creacion de soluciones de barrio en torno al campus.",
    contactName: "Felipe Jara",
    contactEmail: "felipe.jara@uc.cl",
    tags: ["Comunidad", "Vinculacion"],
    challengeType: "Vinculacion",
    engagementLevel: "Voluntariado",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-8",
    title: "Huerta de aprendizaje",
    description:
      "Espacio activo para practicas de germinacion, suelo vivo y monitoreo de crecimiento.",
    contactName: "Andres Villela",
    contactEmail: "andres.villela@uc.cl",
    tags: ["Huerta", "Docencia"],
    challengeType: "Accion climatica",
    engagementLevel: "Curso semestral",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-9",
    title: "Micromovilidad electrica",
    description:
      "Analisis de estaciones de carga y uso real de flotas de traslado corto.",
    contactName: "Cristobal Ossa",
    contactEmail: "cristobal.ossa@uc.cl",
    tags: ["Transporte", "Energia"],
    challengeType: "Transporte",
    engagementLevel: "Tesis doctoral",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-10",
    title: "Red de sensores ambientales",
    description:
      "Monitoreo distribuido de temperatura, ruido y calidad de aire en zonas de alto uso.",
    contactName: "Felipe Jara",
    contactEmail: "felipe.jara@uc.cl",
    tags: ["Datos abiertos", "Sensores"],
    challengeType: "Accion climatica",
    engagementLevel: "Investigacion aplicada",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-11",
    title: "Muebles circulares para campus",
    description:
      "Prototipos en madera recuperada para espacios de estudio y encuentro.",
    contactName: "Anais Weil",
    contactEmail: "anais.weil@uc.cl",
    tags: ["Residuos", "Diseno"],
    challengeType: "Residuos",
    engagementLevel: "Laboratorio de fabricacion",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
  {
    id: "project-12",
    title: "Cartografia de especies nativas",
    description:
      "Levantamiento georreferenciado de flora para estrategias de restauracion ecologica.",
    contactName: "Marta Olivares",
    contactEmail: "marta.olivares@uc.cl",
    tags: ["Flora", "GIS"],
    challengeType: "Flora y fauna",
    engagementLevel: "Investigacion de pregrado",
    imageUrl: "/assets/views/repositorio-reference.jpg",
  },
];

const FALLBACK_CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  {
    id: "flora-fauna",
    name: "Flora y Fauna en los campus",
    description:
      "Biodiversidad, restauracion y monitoreo ecologico aplicado al campus.",
    color: "#D85745",
  },
  {
    id: "residuos",
    name: "Residuos",
    description:
      "Prevencion, reutilizacion y valorizacion de residuos en ecosistemas universitarios.",
    color: "#8E322A",
  },
  {
    id: "transporte",
    name: "Transporte",
    description:
      "Movilidad sostenible y mejora de desplazamientos dentro y fuera del campus.",
    color: "#8B4162",
  },
  {
    id: "vinculacion",
    name: "Vinculacion",
    description:
      "Co-diseno con comunidades, territorios y actores del entorno universitario.",
    color: "#621544",
  },
  {
    id: "accion-climatica",
    name: "Accion climatica",
    description:
      "Estrategias de mitigacion, adaptacion y resiliencia climatica en campus.",
    color: "#665A4F",
  },
  {
    id: "comunidad",
    name: "Comunidad",
    description:
      "Procesos de colaboracion, bienestar y aprendizaje situado entre actores diversos.",
    color: "#6A3E67",
  },
  {
    id: "energia",
    name: "Energia y construccion",
    description:
      "Infraestructura, energia y confort para espacios universitarios sostenibles.",
    color: "#9C867D",
  },
];

const FALLBACK_OPEN_DATA_ENTRIES: OpenDataEntry[] = [
  {
    id: "dato-1",
    title: "Datos",
    body: "Repositorio de indicadores de sostenibilidad, biodiversidad y actividad de laboratorios vivos. Este bloque queda conectado para ser reemplazado por API cuando el backend este disponible.",
  },
  {
    id: "dato-2",
    title: "Ley REP",
    body: "Coleccion de datasets, fichas metodologicas y trazabilidad para iniciativas de economia circular y gestion de residuos en campus.",
  },
  {
    id: "dato-3",
    title: "H2O",
    body: "Conjunto de datos de consumo y eficiencia hidrica, orientado a proyectos docentes, tesis y vinculo con actores territoriales.",
  },
];

const FALLBACK_OPEN_DATA_DATASETS: OpenDataDataset[] = [
  {
    id: "dataset-1",
    title: "Inventario de arbolado urbano",
    summary: "Cobertura y estado de vegetacion medida desde campo y visitas de inspeccion.",
    description:
      "Serie mock pensada para un flujo ambiental. Combina observaciones de arbolado con una curva simple para seguimiento de estado general y trazabilidad de cada medicion.",
    tags: ["Ambiente exterior", "Vegetacion", "Monitoreo"],
    source: {
      id: "source-arbolado-san-joaquin",
      kind: "environmental",
      label: "Censo de arbolado",
      location: "Campus San Joaquin, eje central",
      magnitude: "Cobertura vegetal",
      unit: "%",
      expectedFrequency: "Semanal",
      instrument: "Levantamiento de campo y registro georreferenciado",
    },
    stream: {
      mode: "polling",
      status: "active",
      cadence: "Actualizacion cada 24 h",
      timezone: "America/Santiago",
      lastUpdate: "2026-05-07T08:30:00-04:00",
    },
    metrics: [
      { label: "Mediciones", value: "8" },
      { label: "Cobertura media", value: "72%", detail: "Promedio del periodo mostrado" },
      { label: "Ultima lectura", value: "84%", detail: "Sector poniente" },
    ],
    measurements: [
      { timestamp: "2026-05-01T08:00:00-04:00", value: 61, quality: "good" },
      { timestamp: "2026-05-01T12:00:00-04:00", value: 64, quality: "good" },
      { timestamp: "2026-05-02T08:00:00-04:00", value: 66, quality: "good" },
      { timestamp: "2026-05-03T08:00:00-04:00", value: 68, quality: "good" },
      { timestamp: "2026-05-04T08:00:00-04:00", value: 71, quality: "estimated" },
      { timestamp: "2026-05-05T08:00:00-04:00", value: 73, quality: "good" },
      { timestamp: "2026-05-06T08:00:00-04:00", value: 76, quality: "good" },
      { timestamp: "2026-05-07T08:00:00-04:00", value: 84, quality: "good" },
    ],
    downloads: ["CSV de inventario", "GeoJSON de ubicaciones", "PDF metodologico"],
  },
  {
    id: "dataset-2",
    title: "Consumo hidrico por campus",
    summary: "Lecturas de caudal y consumo que permiten ver tendencias de uso y picos horarios.",
    description:
      "Mock de fuente hidraulica con enfoque de serie temporal. El modelo guarda caudal, presion y estado del stream para que el grafico pueda adaptarse a datos de infraestructura en tiempo casi real.",
    tags: ["Ambiente construido", "Hidraulica", "Series temporales"],
    source: {
      id: "source-agua-biblioteca",
      kind: "hydraulic",
      label: "Contador hidraulico",
      location: "Biblioteca San Joaquin, sala tecnica",
      magnitude: "Caudal",
      unit: "L/s",
      expectedFrequency: "Cada 1 min",
      instrument: "Sensor de caudal y presion",
    },
    stream: {
      mode: "continuous",
      status: "active",
      cadence: "Actualizacion cada 60 s",
      timezone: "America/Santiago",
      lastUpdate: "2026-05-07T08:34:00-04:00",
    },
    metrics: [
      { label: "Mediciones", value: "10" },
      { label: "Caudal medio", value: "4.8 L/s", detail: "Promedio del tramo" },
      { label: "Pico del dia", value: "6.2 L/s", detail: "Hora punta de uso" },
    ],
    measurements: [
      { timestamp: "2026-05-07T08:00:00-04:00", value: 3.6, quality: "good" },
      { timestamp: "2026-05-07T08:10:00-04:00", value: 4.1, quality: "good" },
      { timestamp: "2026-05-07T08:20:00-04:00", value: 4.3, quality: "good" },
      { timestamp: "2026-05-07T08:30:00-04:00", value: 4.8, quality: "good" },
      { timestamp: "2026-05-07T08:40:00-04:00", value: 5.2, quality: "estimated" },
      { timestamp: "2026-05-07T08:50:00-04:00", value: 5.8, quality: "good" },
      { timestamp: "2026-05-07T09:00:00-04:00", value: 6.2, quality: "good" },
      { timestamp: "2026-05-07T09:10:00-04:00", value: 5.4, quality: "good" },
      { timestamp: "2026-05-07T09:20:00-04:00", value: 5.1, quality: "good" },
      { timestamp: "2026-05-07T09:30:00-04:00", value: 4.7, quality: "good" },
    ],
    downloads: ["CSV de consumo", "JSON de series", "Ficha tecnica de sensor"],
  },
  {
    id: "dataset-3",
    title: "Aceleracion sismologica de fondo",
    summary: "Ventana de ruido ambiental y respuesta ante un evento breve de vibracion.",
    description:
      "Mock pensado para una fuente sismologica. El conjunto alterna ruido de fondo con un evento breve para mostrar por que el grafico necesita leer ventanas temporales y no solo un valor puntual.",
    tags: ["Ambiente exterior", "Sismologia", "Eventos"],
    source: {
      id: "source-sismo-observatorio",
      kind: "seismic",
      label: "Acelerometro triaxial",
      location: "Campus Oriente, terraza instrumental",
      magnitude: "Aceleracion",
      unit: "gal",
      expectedFrequency: "100 Hz",
      instrument: "Sensor triaxial miniSEED",
    },
    stream: {
      mode: "event",
      status: "degraded",
      cadence: "Ventanas de 10 s",
      timezone: "America/Santiago",
      lastUpdate: "2026-05-07T08:22:10-04:00",
    },
    metrics: [
      { label: "Mediciones", value: "12" },
      { label: "Ruido base", value: "0.04 gal", detail: "Ventana previa al evento" },
      { label: "Pico registrado", value: "0.61 gal", detail: "Pulso breve de vibracion" },
    ],
    measurements: [
      { timestamp: "2026-05-07T08:21:30-04:00", value: 0.03, quality: "good" },
      { timestamp: "2026-05-07T08:21:40-04:00", value: 0.04, quality: "good" },
      { timestamp: "2026-05-07T08:21:50-04:00", value: 0.05, quality: "good" },
      { timestamp: "2026-05-07T08:22:00-04:00", value: 0.11, quality: "estimated" },
      { timestamp: "2026-05-07T08:22:10-04:00", value: 0.28, quality: "good" },
      { timestamp: "2026-05-07T08:22:20-04:00", value: 0.61, quality: "warning" },
      { timestamp: "2026-05-07T08:22:30-04:00", value: 0.44, quality: "good" },
      { timestamp: "2026-05-07T08:22:40-04:00", value: 0.19, quality: "good" },
      { timestamp: "2026-05-07T08:22:50-04:00", value: 0.09, quality: "good" },
      { timestamp: "2026-05-07T08:23:00-04:00", value: 0.05, quality: "good" },
      { timestamp: "2026-05-07T08:23:10-04:00", value: 0.04, quality: "good" },
      { timestamp: "2026-05-07T08:23:20-04:00", value: 0.03, quality: "good" },
    ],
    downloads: ["CSV de ventana temporal", "MiniSEED mock", "Reporte de evento"],
  },
  {
    id: "dataset-4",
    title: "Conteo de accesos y flujo peatonal",
    summary: "Conteos anonimizados de ingreso y salida para analizar uso de espacios y movilidad.",
    description:
      "Mock de movilidad y flujo humano. Sirve para graficar cambios de ocupacion por franja horaria y para probar una visualizacion con lecturas discretas por polling.",
    tags: ["Movilidad y flujos", "Ocupacion", "Campus"],
    source: {
      id: "source-acceso-principal",
      kind: "mobility",
      label: "Sensor de acceso peatonal",
      location: "Acceso principal, patio central",
      magnitude: "Conteo de personas",
      unit: "personas/h",
      expectedFrequency: "Cada 5 min",
      instrument: "Torre de conteo IR anonimo",
    },
    stream: {
      mode: "polling",
      status: "active",
      cadence: "Actualizacion cada 5 min",
      timezone: "America/Santiago",
      lastUpdate: "2026-05-07T08:35:00-04:00",
    },
    metrics: [
      { label: "Mediciones", value: "9" },
      { label: "Promedio horario", value: "186", detail: "Personas/hora" },
      { label: "Maximo observado", value: "248", detail: "Pico de entrada matinal" },
    ],
    measurements: [
      { timestamp: "2026-05-07T07:30:00-04:00", value: 112, quality: "good" },
      { timestamp: "2026-05-07T07:45:00-04:00", value: 138, quality: "good" },
      { timestamp: "2026-05-07T08:00:00-04:00", value: 164, quality: "good" },
      { timestamp: "2026-05-07T08:15:00-04:00", value: 186, quality: "good" },
      { timestamp: "2026-05-07T08:30:00-04:00", value: 207, quality: "good" },
      { timestamp: "2026-05-07T08:45:00-04:00", value: 229, quality: "estimated" },
      { timestamp: "2026-05-07T09:00:00-04:00", value: 248, quality: "good" },
      { timestamp: "2026-05-07T09:15:00-04:00", value: 221, quality: "good" },
      { timestamp: "2026-05-07T09:30:00-04:00", value: 193, quality: "good" },
    ],
    downloads: ["CSV de aforo", "JSON de accesos", "Resumen metodologico"],
  },
];

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Flora y Fauna en los Campus",
    description:
      "Monitoreo de especies nativas y su relacion con nuevos corredores ecologicos.",
    categoryId: "flora-fauna",
    categoryName: "Flora y Fauna en los campus",
    label: "Investigacion de pregrado",
    supervisor: "Profesor Guia: Marta Olivares",
  },
  {
    id: "opp-2",
    title: "Transporte",
    description:
      "Mejora de rutas seguras y estaciones de movilidad activa para estudiantes.",
    categoryId: "transporte",
    categoryName: "Transporte",
    label: "Practica profesional",
    supervisor: "Encargado: Nicolas Becerra",
  },
  {
    id: "opp-3",
    title: "Transporte",
    description:
      "Analitica de patrones de viaje en horarios punta con visualizaciones abiertas.",
    categoryId: "transporte",
    categoryName: "Transporte",
    label: "Tesis de doctorado",
    supervisor: "Profesor Guia: Felipe Jara",
  },
  {
    id: "opp-4",
    title: "Residuos",
    description:
      "Escalamiento de sistemas de compostaje y reduccion de desperdicio organico.",
    categoryId: "residuos",
    categoryName: "Residuos",
    label: "Proyecto docente",
    supervisor: "Encargada: Anais Weil",
  },
];

interface ProjectsApiResponse {
  projects?: Project[];
  total?: number;
}

async function getFromApi<T>(endpoint: string): Promise<T | null> {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getPeopleByGroup(group: PersonGroup): Promise<Person[]> {
  const apiPeople = await getFromApi<Person[]>(`/people?group=${group}`);
  const source =
    apiPeople && apiPeople.length > 0 ? apiPeople : FALLBACK_PEOPLE;

  return source.filter((person) => person.group === group);
}

export async function getAssociatedMembers(): Promise<string[]> {
  const apiMembers = await getFromApi<string[]>("/people/associated");

  return apiMembers && apiMembers.length > 0
    ? apiMembers
    : FALLBACK_ASSOCIATED_MEMBERS;
}

export async function getLatestExperiences(limit = 5): Promise<Experience[]> {
  const experiences = await getExperiences();

  return experiences.slice(0, limit);
}

export async function getExperiences(): Promise<Experience[]> {
  const apiExperiences = await getFromApi<Experience[]>("/experiences");

  return apiExperiences && apiExperiences.length > 0
    ? apiExperiences
    : FALLBACK_EXPERIENCES;
}

export async function getExperienceById(
  experienceId: string,
): Promise<Experience | null> {
  const experiences = await getExperiences();

  return experiences.find((experience) => experience.id === experienceId) ?? null;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const apiSponsors = await getFromApi<Sponsor[]>("/sponsors");

  return apiSponsors && apiSponsors.length > 0
    ? apiSponsors
    : FALLBACK_SPONSORS;
}

export async function getProjects(
  page = 1,
  pageSize = 5,
): Promise<PaginatedProjects> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 5;

  const apiPayload = await getFromApi<ProjectsApiResponse>(
    `/projects?page=${safePage}&pageSize=${safePageSize}`,
  );

  const projectsSource =
    apiPayload?.projects && apiPayload.projects.length > 0
      ? apiPayload.projects
      : FALLBACK_PROJECTS;

  const total =
    apiPayload?.total && apiPayload.total > 0
      ? apiPayload.total
      : projectsSource.length;

  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    projects: projectsSource.slice(start, end),
    page: normalizedPage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const { projects } = await getProjects(1, 999);

  return projects.find((project) => project.id === projectId) ?? null;
}

export async function getChallengeCategories(): Promise<ChallengeCategory[]> {
  const apiCategories = await getFromApi<ChallengeCategory[]>(
    "/challenge-categories",
  );

  return apiCategories && apiCategories.length > 0
    ? apiCategories
    : FALLBACK_CHALLENGE_CATEGORIES;
}

export async function getOpenDataEntries(): Promise<OpenDataEntry[]> {
  const apiEntries = await getFromApi<OpenDataEntry[]>("/open-data");

  return apiEntries && apiEntries.length > 0
    ? apiEntries
    : FALLBACK_OPEN_DATA_ENTRIES;
}

export async function getOpenDataDatasets(): Promise<OpenDataDataset[]> {
  const apiDatasets = await getFromApi<OpenDataDataset[]>('/open-data/datasets');

  return apiDatasets && apiDatasets.length > 0
    ? apiDatasets
    : FALLBACK_OPEN_DATA_DATASETS;
}

export async function getOpenDataDatasetById(
  datasetId: string,
): Promise<OpenDataDataset | null> {
  const datasets = await getOpenDataDatasets();

  return datasets.find((dataset) => dataset.id === datasetId) ?? null;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const apiOpportunities = await getFromApi<Opportunity[]>("/opportunities");

  return apiOpportunities && apiOpportunities.length > 0
    ? apiOpportunities
    : FALLBACK_OPPORTUNITIES;
}
