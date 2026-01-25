import type { Database } from './supabase';

// --- TIPOS DE BASE DE DATOS (Filas puras) ---
// Extraemos la definición exacta de la BD
export type PhaseRow = Database['public']['Tables']['process_phases']['Row'];
export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type EventRow = Database['public']['Tables']['events']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row']; 
export type InstrumentRow = Database['public']['Tables']['official_instruments']['Row'];

// --- TIPOS EXTENDIDOS O DE AYUDA ---

// Para el JSONB de 'related_links' en instruments
export interface RelatedLink {
  title: string;
  url: string;
}

// Relaciones complejas (Joins)
export interface ProcessPhase extends PhaseRow {
  documents: DocumentRow[];
  events: EventRow[];
}

// --- TIPOS PARA VISTAS (View Models) ---

// Para selectores o tabs donde solo necesitamos ID y Título
export interface PhaseSimple {
  id: number;
  title: string;
  order_index: number;
}

// Para la tarjeta de documento (Adapter entre BD y UI)
// Esto define qué forma tienen los datos YA procesados para el frontend
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