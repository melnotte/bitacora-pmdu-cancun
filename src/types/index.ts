import type { Database } from './supabase';

// --- TIPOS DE LA BASE DE DATOS ---
export type PhaseRow = Database['public']['Tables']['process_phases']['Row'];
export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type EventRow = Database['public']['Tables']['events']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row']; 
export type InstrumentRow = Database['public']['Tables']['official_instruments']['Row'];
export type PollRow = Database['public']['Tables']['weekly_polls']['Row'];
export type PollOptionRow = Database['public']['Tables']['poll_options']['Row'];
export type ChapterRow = Database['public']['Tables']['consultation_chapters']['Row'];
export type CommentRow = Database['public']['Tables']['comments']['Row'];

// --- TIPOS EXTENDIDOS O DE AYUDA ---

// Para el JSONB de 'related_links' en instruments
export interface RelatedLink {
  title: string;
  url: string;
}

export interface Instrument extends InstrumentRow {
  phase?: {
    title: string;
    status: string;
  };
}

// Relaciones complejas (Joins)
export interface ProcessPhase extends PhaseRow {
  documents: DocumentRow[];
  events: EventRow[];
}

// --- TIPOS PARA VISTAS ---

// Para selectores o tabs donde solo necesitamos ID y Título
export interface PhaseSimple {
  id: number;
  title: string;
  order_index: number;
}

// Para la tarjeta de documento
export interface UIDocument {
  id: string;
  title: string;
  description: string | null;
  url: string;
  size: string | null;
  date: string;           // Mapeado de 'publication_date'
  type: string;           // Mapeado del join 'document_types.name'
  phase: string;          // Mapeado del join 'process_phases.title'
  tags: string[] | null;
  version: string | null;
}

// --- TIPOS DE EVIDENCIA ---
export interface EvidenceItem {
  url: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface EventEvidence {
  reportUrl?: EvidenceItem | string;       
  presentationUrl?: EvidenceItem | string; 
  videoUrl?: EvidenceItem | string;        
  photosUrl?: EvidenceItem | string;       
  attendanceUrl?: EvidenceItem | string;   
  transcriptUrl?: EvidenceItem | string;   
}

// --- TIPO UI EVENT ---
export interface UIEvent extends Omit<EventRow, 'evidence' | 'time'> {
  evidence?: EventEvidence;
  start_time: string;      // Viene como "10:00:00"
  end_time: string | null; // Puede ser null
}

// --- TIPOS DE ACTUALIZACIONES ---
export interface PostCategory {
  id: number;
  name: string;
  color?: string;
}

export interface Post extends PostRow {
  post_categories: {
    name: string;
    color?: string;
  } | null;
  linked_event_id: string | null;
  linked_document_id: string | null;
}

// --- ENCUESTAS ---
export interface WeeklyPollWithDetails extends PollRow {
  poll_options: PollOptionRow[];
}

// --- ESTADÍSTICAS DEL DASHBOARD ---
export interface TopicStat {
  topic: string;
  count: number;
  pct: string;
}

export interface WeeklyStat {
  week: string;
  count: number;
  height: string;
}
