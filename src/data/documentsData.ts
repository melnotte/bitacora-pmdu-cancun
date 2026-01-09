export type DocType = 'Programa' | 'Anexo' | 'Mapa' | 'Acta' | 'Convocatoria' | 'Dictamen';

export type DocPhase = 
  | 'Diagnóstico' 
  | 'Imagen Objetivo' 
  | 'Estrategias' 
  | 'Proyecto' 
  | 'Consulta Pública' 
  | 'Aprobación y Publicación';

export interface PMDUDocument {
  id: string;
  title: string;
  type: DocType;
  phase: DocPhase;
  version: string;
  date: string; 
  description: string;
  size: string;
  url: string;
  tags: string[];
}

export const documents: PMDUDocument[] = [
  // --- FASE 1: DIAGNÓSTICO ---
  {
    id: 'doc-001',
    title: 'Diagnóstico Integrado del Municipio',
    type: 'Programa',
    phase: 'Diagnóstico',
    version: 'v1.2-final',
    date: '2024-02-15',
    description: 'Análisis completo de la situación demográfica, económica y ambiental.',
    size: '45 MB',
    url: '#',
    tags: ['ambiental', 'demografía']
  },
  {
    id: 'doc-011',
    title: 'Plano de Infraestructura Hidráulica',
    type: 'Mapa',
    phase: 'Diagnóstico',
    version: 'v1.1',
    date: '2024-02-05',
    description: 'Red actual de agua potable y alcantarillado.',
    size: '95 MB',
    url: '#',
    tags: ['infraestructura', 'agua']
  },

  // --- FASE 2: IMAGEN OBJETIVO ---
  {
    id: 'doc-img-01',
    title: 'Visión de Ciudad 2040',
    type: 'Programa',
    phase: 'Imagen Objetivo',
    version: 'v1.0',
    date: '2024-03-01',
    description: 'Documento rector que define el modelo de ciudad deseado a largo plazo.',
    size: '12 MB',
    url: '#',
    tags: ['planeación', 'visión']
  },

  // --- FASE 3: ESTRATEGIAS ---
  {
    id: 'doc-002',
    title: 'Plano de Zonificación Primaria',
    type: 'Mapa',
    phase: 'Estrategias', 
    version: 'v2.0',
    date: '2024-03-10',
    description: 'Propuesta visual de las zonas de conservación y desarrollo.',
    size: '15 MB',
    url: '#',
    tags: ['mapas', 'zonificación']
  },

  // --- FASE 4: PROYECTO ---
  {
    id: 'doc-proy-01',
    title: 'Anteproyecto del PMDU (Versión Técnica)',
    type: 'Programa',
    phase: 'Proyecto',
    version: 'v0.9',
    date: '2024-04-01',
    description: 'Versión completa del instrumento lista para revisión técnica.',
    size: '55 MB',
    url: '#',
    tags: ['borrador', 'técnico']
  },

  // --- FASE 5: CONSULTA PÚBLICA ---
  {
    id: 'doc-010',
    title: 'Formato de Observaciones Ciudadanas',
    type: 'Convocatoria',
    phase: 'Consulta Pública',
    version: 'v1.0',
    date: '2024-04-15',
    description: 'Formulario oficial para presentar observaciones durante la consulta.',
    size: '0.5 MB',
    url: '#',
    tags: ['trámites']
  },
  {
    id: 'doc-012',
    title: 'Presentación Ejecutiva - Consulta',
    type: 'Programa',
    phase: 'Consulta Pública',
    version: 'v1.0',
    date: '2024-04-10',
    description: 'Resumen del proyecto para difusión general.',
    size: '10 MB',
    url: '#',
    tags: ['difusión']
  },

  // --- FASE 6: APROBACIÓN ---
  {
    id: 'doc-013',
    title: 'Acta de Aprobación de Cabildo',
    type: 'Acta',
    phase: 'Aprobación y Publicación',
    version: 'Final',
    date: '2024-07-01', 
    description: 'Acta oficial de la sesión donde se aprueba el programa.',
    size: '2 MB',
    url: '#',
    tags: ['legal', 'oficial']
  }
];