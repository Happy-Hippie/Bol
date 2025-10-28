import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          description: string;
          logo_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          website: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          description: string;
          status: 'active' | 'completed' | 'on-hold';
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      funders: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          contact_name: string | null;
          contact_email: string | null;
          logo_url: string | null;
          relationship_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['funders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['funders']['Insert']>;
      };
      context_library: {
        Row: {
          id: string;
          org_id: string;
          file_name: string;
          file_type: string;
          file_url: string;
          file_size: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['context_library']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['context_library']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          report_type: 'annual' | 'funder' | 'project' | 'custom';
          status: 'draft' | 'in-review' | 'complete';
          content: any;
          generated_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      activities: {
        Row: {
          id: string;
          org_id: string;
          activity_type: string;
          title: string;
          description: string;
          priority: 'urgent' | 'important' | 'normal';
          due_date: string | null;
          completed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
    };
  };
};
