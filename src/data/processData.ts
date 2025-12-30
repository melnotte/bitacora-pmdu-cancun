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

// DUMMY DATA
export const phases: ProcessPhase[] = [
  {
    id: 1,
    title: "1. Diagnóstico",
    dates: "Ene - Feb 2024",
    status: "completed",
    description: "Análisis de la situación actual del municipio, identificando problemáticas y oportunidades.",
    documents: [{ name: "Diagnóstico Preliminar PDF", url: "#" }]
  },
  {
    id: 2,
    title: "2. Estrategias",
    dates: "Marzo 2024",
    status: "active",
    description: "Definición de objetivos y líneas de acción para el desarrollo urbano sostenible.",
    events: [{ name: "Taller de Visión Ciudadana", url: "#" }]
  },
  {
    id: 3,
    title: "3. Consulta Pública",
    dates: "Abril 2024",
    status: "upcoming",
    description: "Periodo legal para recibir opiniones y propuestas de la ciudadanía sobre el proyecto.",
  },
];

export const newsPosts: NewsPost[] = [
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