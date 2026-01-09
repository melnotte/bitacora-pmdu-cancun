export interface DocumentLink {
  name: string;
  url: string;
}

export interface ProcessPhase {
  id: number;
  title: string;
  dates: string;
  status: 'completed' | 'active' | 'upcoming';
  description: string;
  documents?: DocumentLink[];
  events?: DocumentLink[];
}

export interface NewsPost {
  id: number;
  date: string;
  category: 'Taller' | 'Avance' | 'Comunicado' | 'Hito';
  title: string;
  content: string;
  image?: string;
}

export const phases: ProcessPhase[] = [
  {
    id: 1,
    title: "1. Diagnóstico",
    dates: "Ene - Feb 2024",
    status: "completed",
    description: "Identificación de problemáticas, necesidades y oportunidades del territorio municipal.",
    documents: [
      { name: "Diagnóstico Integrado del Municipio", url: "/documentos?etapa=Diagnóstico" },
      { name: "Plano de Infraestructura Hidráulica", url: "/documentos?etapa=Diagnóstico" }
    ]
  },
  {
    id: 2,
    title: "2. Imagen Objetivo",
    dates: "Marzo 2024",
    status: "completed",
    description: "Construcción colectiva de la visión de ciudad a largo plazo (2040).",
    events: [
      { name: "Taller de Co-diseño Urbano", url: "/participa" }
    ],
    documents: [
      { name: "Visión de Ciudad 2040", url: "/documentos?etapa=Imagen Objetivo" }
    ]
  },
  {
    id: 3,
    title: "3. Estrategias",
    dates: "Abril 2024",
    status: "completed",
    description: "Definición de políticas, estrategias y proyectos estratégicos para alcanzar la visión.",
    documents: [
      { name: "Plano de Zonificación Primaria", url: "/documentos?etapa=Estrategias" }
    ]
  },
  {
    id: 4,
    title: "4. Proyecto",
    dates: "Mayo 2024",
    status: "completed",
    description: "Elaboración técnica de los instrumentos normativos, cartas urbanas y reglamentos.",
    documents: [
      { name: "Anteproyecto del PMDU (Versión Técnica)", url: "/documentos?etapa=Proyecto" }
    ]
  },
  {
    id: 5,
    title: "5. Consulta Pública",
    dates: "Junio 2024",
    status: "active", 
    description: "Periodo legal para que la ciudadanía revise el proyecto y emita sus observaciones.",
    events: [
      { name: "Audiencia Pública Consultiva", url: "/participa" }
    ],
    documents: [
      { name: "Formato de Observaciones Ciudadanas", url: "/documentos?etapa=Consulta Pública" },
      { name: "Presentación Ejecutiva - Consulta", url: "/documentos?etapa=Consulta Pública" }
    ]
  },
  {
    id: 6,
    title: "6. Aprobación y Publicación",
    dates: "Julio 2024",
    status: "upcoming",
    description: "Dictamen final, aprobación por Cabildo y publicación en el Periódico Oficial.",
    documents: [
      { name: "Acta de Aprobación de Cabildo", url: "/documentos?etapa=Aprobación y Publicación" }
    ]
  }
];

export const newsPosts: NewsPost[] = [
  {
    id: 0,
    date: "2024-06-01",
    category: "Comunicado",
    title: "Inicia oficialmente la Consulta Pública del PMDU",
    content: "A partir de hoy, se reciben observaciones ciudadanas en el portal web y ventanillas físicas.",
  },
  {
    id: 1,
    date: "2024-03-10",
    category: "Taller",
    title: "Resultados del primer taller participativo",
    content: "Más de 500 ciudadanos participaron en las mesas de trabajo en la supermanzana...",
  },
  {
    id: 2,
    date: "2024-03-05",
    category: "Avance",
    title: "Finaliza la etapa de diagnóstico",
    content: "Se ha consolidado el documento base con información de INEGI y campo.",
  },
  {
    id: 3,
    date: "2024-02-20",
    category: "Comunicado",
    title: "Aviso de inicio de trabajos",
    content: "El Ayuntamiento da el banderazo oficial para la actualización del PMDU.",
  }
];