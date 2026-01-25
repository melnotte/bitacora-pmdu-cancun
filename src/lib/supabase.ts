import { createClient } from '@supabase/supabase-js';
// 1. Importamos los tipos generados
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

// 2. Inyectamos el genérico <Database> aquí
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);