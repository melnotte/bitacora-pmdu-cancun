export type CommentStatus = 'Recibido' | 'En análisis' | 'Atendido/Integrado' | 'No procedente' | 'Duplicado';

export interface Comment {
  id: string;
  folio: string;
  date: string; // YYYY-MM-DD
  topic: string;
  zone: string;
  content: string;
  status: CommentStatus;
  internalNote: string;
}

export const initialComments: Comment[] = [
  {
    id: '1',
    folio: 'PMDU-2024-1001',
    date: '2024-01-15',
    topic: 'Movilidad',
    zone: 'Centro',
    content: 'Se requiere mayor sincronización en los semáforos de la Av. Tulum.',
    status: 'Recibido',
    internalNote: ''
  },
  {
    id: '2',
    folio: 'PMDU-2024-1002',
    date: '2024-01-16',
    topic: 'Medio Ambiente',
    zone: 'Zona Hotelera',
    content: 'Propongo más estaciones de reciclaje en playas públicas.',
    status: 'En análisis',
    internalNote: 'Revisar con Servicios Públicos'
  },
  {
    id: '3',
    folio: 'PMDU-2024-1003',
    date: '2024-01-18',
    topic: 'Zonificación',
    zone: 'Polígono Sur',
    content: 'Cambio de uso de suelo en predio baldío para parque.',
    status: 'Recibido',
    internalNote: ''
  },
  {
    id: '4',
    folio: 'PMDU-2024-1004',
    date: '2024-01-20',
    topic: 'Movilidad',
    zone: 'Región 100',
    content: 'Falta alumbrado en paraderos de autobús.',
    status: 'Atendido/Integrado',
    internalNote: 'Integrado en estrategia 4.2'
  },
  {
    id: '5',
    folio: 'PMDU-2024-1005',
    date: '2024-01-21',
    topic: 'Espacio Público',
    zone: 'Centro',
    content: 'Solicitud de mantenimiento en Parque de las Palapas.',
    status: 'No procedente',
    internalNote: 'Corresponde a mantenimiento urbano, no a planeación PMDU'
  }
];