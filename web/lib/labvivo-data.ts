import {
  type ChallengeCategory,
  type Experience,
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
    bio: "Coordina iniciativas de vinculacion entre campus, comunidades y sostenibilidad aplicada.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "andres.villela@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "exec-2",
    group: "executive",
    name: "Anais Weil",
    role: "Coordinacion de proyectos de innovacion",
    bio: "Lidera la articulacion de experiencias docentes en territorio y campus vivo.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "anais.weil@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "exec-3",
    group: "executive",
    name: "Cristobal Ossa",
    role: "Investigacion aplicada y datos abiertos",
    bio: "Impulsa el uso de repositorios abiertos para desafios interdisciplinarios.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "cristobal.ossa@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "exec-4",
    group: "executive",
    name: "Esteban Beros",
    role: "Estudiante de Ingenieria UC",
    bio: "Desarrollador de la plataforma LabVivo UC y colaborador en su implementacion tecnica.",
    photoUrl: "/assets/photos/teb.png",
    social: {},
  },
  {
    id: "exec-5",
    group: "executive",
    name: "Arturo Herreros",
    role: "Estudiante de Ingenieria UC",
    bio: "Desarrollador de la plataforma LabVivo UC y colaborador en su arquitectura de frontend.",
    photoUrl: "/assets/photos/arturo.png",
    social: {},
  },
  {
    id: "academic-1",
    group: "academic",
    name: "Valentina Riquelme",
    role: "Academica asociada - Arquitectura",
    bio: "Acompana desafios de energia, habitabilidad y urbanismo regenerativo.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "valentina.riquelme@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-2",
    group: "academic",
    name: "Nicolas Becerra",
    role: "Academico asociado - Ingenieria",
    bio: "Disena pilotos de residuos y movilidad con seguimiento de impacto.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "nicolas.becerra@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-3",
    group: "academic",
    name: "Marta Olivares",
    role: "Academica asociada - Ecologia",
    bio: "Vincula investigacion de biodiversidad con cursos y tesis en campus.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "marta.olivares@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-4",
    group: "academic",
    name: "Javier Cifuentes",
    role: "Academico asociado - Diseno estrategico",
    bio: "Facilita codiseno con estudiantes y actores comunitarios.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "javier.cifuentes@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-5",
    group: "academic",
    name: "Daniela Saldias",
    role: "Academica asociada - Politicas publicas",
    bio: "Conecta evidencias territoriales con estrategias de escalamiento.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "daniela.saldias@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "academic-6",
    group: "academic",
    name: "Felipe Jara",
    role: "Academico asociado - Ciencias de datos",
    bio: "Desarrolla visualizaciones para seguimiento de oportunidades y resultados.",
    photoUrl: PLACEHOLDER_PHOTO,
    social: {
      email: "felipe.jara@uc.cl",
      instagram: "https://instagram.com/labsvivosuc",
      linkedin: "https://linkedin.com",
    },
  },
];

const FALLBACK_ASSOCIATED_MEMBERS = [
  "Andres Villela Chacon",
  "Anais Weil",
  "Maria Jose Quiroga",
  "Benjamin Lagos",
  "Patricia Toledo",
  "Josefina Mella",
  "Francisca Luna",
  "Vicente Ramirez",
  "Constanza Pino",
  "Alonso Yanez",
  "Pilar Espinoza",
  "Martin Bustamante",
  "Fernanda Rojas",
  "Diego Mulet",
  "Camila Arriagada",
  "Manuel Cortes",
  "Ignacia Solis",
  "Rocio Pavez",
  "Lukas Cifuentes",
  "Carolina Vergara",
  "Tomas Caceres",
  "Julieta Gaete",
  "Matias Fierro",
  "Antonia Palma",
];

const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "Forestacion en Campus San Joaquin",
    summary:
      "Piloto de restauracion de biodiversidad en areas de alto trafico estudiantil.",
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "exp-2",
    title: "Vermicompost en San Joaquin",
    summary:
      "Sistema de compostaje para residuos organicos de casino universitario.",
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "exp-3",
    title: "Jardines infantiles",
    summary:
      "Programa de co-diseno de espacios verdes para aprendizaje temprano.",
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "exp-4",
    title: "Monitoreo de movilidad activa",
    summary:
      "Levantamiento y visualizacion de rutas peatonales y ciclistas internas.",
    imageUrl: PLACEHOLDER_IMAGE,
  },
  {
    id: "exp-5",
    title: "Laboratorio de agua de lluvia",
    summary:
      "Prototipo de captacion y uso de aguas lluvias para riego de zonas piloto.",
    imageUrl: PLACEHOLDER_IMAGE,
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
    id: "project-1",
    title: "Chom - Anais Weil",
    description:
      "Experimentacion en bio-materiales para cultivos de bajo impacto con participacion estudiantil.",
    contactName: "Anais Weil",
    contactEmail: "cha.lab.biomaterial@gmail.com",
    tags: ["Biomateriales", "Campus vivo"],
    challengeType: "Accion climatica",
    engagementLevel: "Practicante",
    imageUrl: "/assets/photos/chom_anais_weil.png",
  },
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

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Flora y Fauna en los Campus",
    description:
      "Desafio 1: Monitoreo de especies nativas y su relacion con nuevos corredores ecologicos.",
    categoryId: "flora-fauna",
    categoryName: "Flora y Fauna en los campus",
    label: "Investigacion de pregrado",
    supervisor: "Profesor Guia: Marta Olivares",
    typeLabel: "Investigacion Bosque",
    icon: "forest",
  },
  {
    id: "opp-2",
    title: "Transporte",
    description:
      "Desafio 1: Mejora de rutas seguras y estaciones de movilidad activa para estudiantes.",
    categoryId: "transporte",
    categoryName: "Transporte",
    label: "Practica profesional",
    supervisor: "Encargado: Nicolas Becerra",
    typeLabel: "Practica Planta",
    icon: "plant",
  },
  {
    id: "opp-3",
    title: "Transporte",
    description:
      "Desafio 2: Analitica de patrones de viaje en horarios punta con visualizaciones abiertas.",
    categoryId: "transporte",
    categoryName: "Transporte",
    label: "Tesis de doctorado",
    supervisor: "Profesor Guia: Felipe Jara",
    typeLabel: "Tesis/Titulo Arbol",
    icon: "tree",
  },
  {
    id: "opp-4",
    title: "Residuos",
    description:
      "Desafio 1: Escalamiento de sistemas de compostaje y reduccion de desperdicio organico.",
    categoryId: "residuos",
    categoryName: "Residuos",
    label: "Proyecto docente",
    supervisor: "Encargada: Anais Weil",
    typeLabel: "Cursos Germinacion",
    icon: "germination",
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
  const apiExperiences = await getFromApi<Experience[]>(
    `/experiences?limit=${limit}`,
  );
  const source =
    apiExperiences && apiExperiences.length > 0
      ? apiExperiences
      : FALLBACK_EXPERIENCES;

  return source.slice(0, limit);
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

export async function getOpportunities(): Promise<Opportunity[]> {
  const apiOpportunities = await getFromApi<Opportunity[]>("/opportunities");

  return apiOpportunities && apiOpportunities.length > 0
    ? apiOpportunities
    : FALLBACK_OPPORTUNITIES;
}
