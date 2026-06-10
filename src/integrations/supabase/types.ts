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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      broker_activity: {
        Row: {
          action: string
          broker: string
          created_at: string
          details: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          broker: string
          created_at?: string
          details?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          broker?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      broker_connections: {
        Row: {
          broker: string
          connected_at: string | null
          created_at: string
          disconnected_at: string | null
          id: string
          last_sync_at: string | null
          mode: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          broker: string
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          id?: string
          last_sync_at?: string | null
          mode?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          broker?: string
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          id?: string
          last_sync_at?: string | null
          mode?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          id: string
          mood: string | null
          notes: string
          pnl: number | null
          setup: string | null
          symbol: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood?: string | null
          notes?: string
          pnl?: number | null
          setup?: string | null
          symbol?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string | null
          notes?: string
          pnl?: number | null
          setup?: string | null
          symbol?: string | null
          user_id?: string
        }
        Relationships: []
      }
      paper_trades: {
        Row: {
          closed_at: string | null
          created_at: string
          entry_price: number
          exit_price: number | null
          id: string
          instrument: string | null
          notes: string | null
          opened_at: string
          pnl: number | null
          quantity: number
          side: string
          status: string
          stop_loss: number | null
          symbol: string
          target: number | null
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          entry_price: number
          exit_price?: number | null
          id?: string
          instrument?: string | null
          notes?: string | null
          opened_at?: string
          pnl?: number | null
          quantity: number
          side: string
          status?: string
          stop_loss?: number | null
          symbol: string
          target?: number | null
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          instrument?: string | null
          notes?: string | null
          opened_at?: string
          pnl?: number | null
          quantity?: number
          side?: string
          status?: string
          stop_loss?: number | null
          symbol?: string
          target?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          risk_per_trade: number
          signals_viewed: number
          updated_at: string
          user_id: string
          virtual_capital: number
        }
        Insert: {
          created_at?: string
          risk_per_trade?: number
          signals_viewed?: number
          updated_at?: string
          user_id: string
          virtual_capital?: number
        }
        Update: {
          created_at?: string
          risk_per_trade?: number
          signals_viewed?: number
          updated_at?: string
          user_id?: string
          virtual_capital?: number
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
