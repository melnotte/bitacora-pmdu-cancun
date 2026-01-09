// Estructura para un items de evidencia con metadatos
export interface EvidenceItem {
  url: string;
  uploadedAt?: string; // Fecha de carga
  uploadedBy?: string; // Responsable
}

// Interfaz de Evidencias para soportar los nuevos tipos
export interface EventEvidence {
  reportUrl?: EvidenceItem | string;       // Minuta / Reporte
  presentationUrl?: EvidenceItem | string; // Presentación
  videoUrl?: EvidenceItem | string;        // Grabación
  photosUrl?: EvidenceItem | string;       // Galería
  attendanceUrl?: EvidenceItem | string;   // Lista de Asistencia
  transcriptUrl?: EvidenceItem | string;   // Transcripción
}

export interface Event {
  id: string;
  title: string;
  date: string;      // Formato YYYY-MM-DD
  time: string;
  location: string;
  lat?: number;      // coordenadas
  lng?: number;
  mapQuery?: string; // dirección en google
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
    lat: 21.202433790565664,
    lng: -86.8329215275856,
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
    mapQuery: "Blvd. Kukulcan Km 7.5, Punta Cancun, Zona Hotelera, 77500 Cancún, Q.R.",
    district: "Centro",
    modality: "Presencial",
    category: "Audiencia",
    status: "finalizado",
    description: "Sesión solemne de instalación del Comité de Planeación para el Desarrollo Municipal.",
    evidence: {
      reportUrl: {
        url: "/docs/acta-instalacion.pdf",
        uploadedAt: "16 Ene 2024",
        uploadedBy: "Secretaría Técnica"
      },
      presentationUrl: {
        url: "/docs/presentacion-coplademun.pdf",
        uploadedAt: "16 Ene 2024",
        uploadedBy: "Dir. Planeación"
      },
      photosUrl: "/galeria/evento-003",
      attendanceUrl: {
        url: "/docs/lista-asistencia-003.pdf",
        uploadedAt: "17 Ene 2024",
        uploadedBy: "Administración"
      }
    }
  },
  {
    id: "evt-004",
    title: "Mesa de Trabajo: Zona Hotelera",
    date: "2025-11-05",
    time: "09:00 AM",
    location: "Cancun Center",
    mapQuery: "Cancun Center, Blvd. Kukulcán Km 9, Zona Hotelera, Cancún, Q.R.",
    district: "Zona Hotelera",
    modality: "Presencial",
    category: "Mesa de Trabajo",
    status: "abierto",
    description: "Análisis de infraestructura turística y servicios públicos.",
  }
];