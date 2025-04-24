import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      document_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      document_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          content: string
          fields: Json
          created_at: string
          updated_at: string
          created_by: string
          status: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          content: string
          fields?: Json
          created_at?: string
          updated_at?: string
          created_by: string
          status?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          content?: string
          fields?: Json
          created_at?: string
          updated_at?: string
          created_by?: string
          status?: string
        }
      }
      generated_documents: {
        Row: {
          id: string
          template_id: string
          user_id: string
          data: Json
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          template_id: string
          user_id: string
          data?: Json
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          template_id?: string
          user_id?: string
          data?: Json
          created_at?: string
          status?: string
        }
      }
    }
  }
}