export interface EventEvidence {
  reportUrl?: string;
  presentationUrl?: string;
  videoUrl?: string;
  photosUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  time: string;
  location: string;
  district: string;
  modality: 'Presencial' | 'Virtual' | 'Híbrido';
  category: 'Taller' | 'Conferencia' | 'Mesa de Trabajo' | 'Audiencia';
  status: 'abierto' | 'lleno' | 'finalizado'; 
  description: string;
  agenda?: string[];
  organizers?: string[];
  evidence?: EventEvidence;
}

export const events: Event[] = [
  {
    id: "evt-001",
    title: "Taller de Diagnóstico Zona Norte",
    date: "2025-10-15",
    time: "10:00 AM - 2:00 PM",
    location: "Domo Deportivo 237",
    district: "Zona Norte",
    modality: "Presencial",
    category: "Taller",
    status: "abierto",
    description: "Espacio participativo para identificar problemáticas urbanas específicas de la zona norte de Cancún.",
    agenda: ["10:00 - Bienvenida", "10:30 - Mesas de trabajo", "13:00 - Plenaria de resultados"],
    organizers: ["Implan Cancún", "Secretaría de Ecología"]
  },
  {
    id: "evt-002",
    title: "Foro Virtual: Movilidad Sostenible",
    date: "2025-10-20",
    time: "5:00 PM - 7:00 PM",
    location: "Zoom",
    district: "N/A",
    modality: "Virtual",
    category: "Conferencia",
    status: "lleno",
    description: "Expertos internacionales discuten el futuro de la movilidad en ciudades turísticas.",
  },
  {
    id: "evt-003",
    title: "Instalación del COPLADEMUN",
    date: "2024-01-15",
    time: "12:00 PM",
    location: "Salón Presidentes",
    district: "Centro",
    modality: "Presencial",
    category: "Audiencia",
    status: "finalizado",
    description: "Sesión solemne de instalación del Comité de Planeación para el Desarrollo Municipal.",
    evidence: {
      reportUrl: "/docs/acta-instalacion.pdf",
      photosUrl: "/galeria/evento-003"
    }
  },
  {
    id: "evt-004",
    title: "Mesa de Trabajo: Zona Hotelera",
    date: "2025-11-05",
    time: "09:00 AM",
    location: "Centro de Convenciones",
    district: "Zona Hotelera",
    modality: "Presencial",
    category: "Mesa de Trabajo",
    status: "abierto",
    description: "Análisis de infraestructura turística y servicios públicos.",
  }
];