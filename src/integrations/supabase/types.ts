export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      closers: {
        Row: {
          id: string
          nome: string
          foto_url: string | null
          taxa_conversao: number
          numero_vendas: number
          valor_total_vendas: number
          valor_total_entradas: number
          tempo_empresa: string | null
          time: string | null
          produto_mais_vendido: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          foto_url?: string | null
          taxa_conversao?: number
          numero_vendas?: number
          valor_total_vendas?: number
          valor_total_entradas?: number
          tempo_empresa?: string | null
          time?: string | null
          produto_mais_vendido?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          foto_url?: string | null
          taxa_conversao?: number
          numero_vendas?: number
          valor_total_vendas?: number
          valor_total_entradas?: number
          tempo_empresa?: string | null
          time?: string | null
          produto_mais_vendido?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      funis: {
        Row: {
          id: string
          nome_produto: string
          valor_venda: number
          especialista: string | null
          descricao: string | null
          total_vendas: number
          valor_total_gerado: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_produto: string
          valor_venda?: number
          especialista?: string | null
          descricao?: string | null
          total_vendas?: number
          valor_total_gerado?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_produto?: string
          valor_venda?: number
          especialista?: string | null
          descricao?: string | null
          total_vendas?: number
          valor_total_gerado?: number
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          id: string
          closer_id: string | null
          funil_id: string | null
          produto: string
          valor_venda: number
          valor_entrada: number
          negociacao: string | null
          data_venda: string
          created_at: string
        }
        Insert: {
          id?: string
          closer_id?: string | null
          funil_id?: string | null
          produto: string
          valor_venda: number
          valor_entrada?: number
          negociacao?: string | null
          data_venda?: string
          created_at?: string
        }
        Update: {
          id?: string
          closer_id?: string | null
          funil_id?: string | null
          produto?: string
          valor_venda?: number
          valor_entrada?: number
          negociacao?: string | null
          data_venda?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendas_closer_id_fkey"
            columns: ["closer_id"]
            isOneToOne: false
            referencedRelation: "closers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_funil_id_fkey"
            columns: ["funil_id"]
            isOneToOne: false
            referencedRelation: "funis"
            referencedColumns: ["id"]
          }
        ]
      }
      funis_aquisicao: {
        Row: {
          id: string
          nome_funil: string
          investido: number
          faturamento_trafego: number
          roas_trafego: number
          numero_alunos: number
          periodo: string
          data_inicio: string | null
          data_fim: string | null
          sheet_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_funil: string
          investido?: number
          faturamento_trafego?: number
          roas_trafego?: number
          numero_alunos?: number
          periodo: string
          data_inicio?: string | null
          data_fim?: string | null
          sheet_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_funil?: string
          investido?: number
          faturamento_trafego?: number
          roas_trafego?: number
          numero_alunos?: number
          periodo?: string
          data_inicio?: string | null
          data_fim?: string | null
          sheet_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          id: string
          tipo: 'aquisicao' | 'monetizacao' | 'sdr'
          status: 'success' | 'error'
          mensagem: string | null
          registros_sincronizados: number
          created_at: string
        }
        Insert: {
          id?: string
          tipo: 'aquisicao' | 'monetizacao' | 'sdr'
          status: 'success' | 'error'
          mensagem?: string | null
          registros_sincronizados?: number
          created_at?: string
        }
        Update: {
          id?: string
          tipo?: 'aquisicao' | 'monetizacao' | 'sdr'
          status?: 'success' | 'error'
          mensagem?: string | null
          registros_sincronizados?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
