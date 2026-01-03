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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string
          city: string
          created_at: string | null
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          name: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          branch_id: string
          created_at: string
          id: string
          last_restocked_at: string | null
          max_threshold: number
          menu_item_id: string
          min_threshold: number
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          id?: string
          last_restocked_at?: string | null
          max_threshold?: number
          menu_item_id: string
          min_threshold?: number
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          id?: string
          last_restocked_at?: string | null
          max_threshold?: number
          menu_item_id?: string
          min_threshold?: number
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      kds_orders: {
        Row: {
          branch_id: string
          completed_at: string | null
          created_at: string
          estimated_completion: string | null
          id: string
          order_id: string
          priority: number | null
          started_at: string | null
          station: string | null
          status: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          order_id: string
          priority?: number | null
          started_at?: string | null
          station?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          order_id?: string
          priority?: number | null
          started_at?: string | null
          station?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kds_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kds_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          tier: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tier?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tier?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          calories: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          dietary_tags: string[] | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          preparation_time: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_tags?: string[] | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          id: string
          recipient: string
          sent_at: string | null
          status: string
          template_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string | null
          template: string
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          subject?: string | null
          template: string
          type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string | null
          template?: string
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string | null
          order_id: string
          quantity: number
          special_requests: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id: string
          quantity?: number
          special_requests?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id?: string
          quantity?: number
          special_requests?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: Json | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: Json | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: Json | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          branch_id: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_fee: number | null
          discount: number | null
          estimated_time: number | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          estimated_time?: number | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax?: number | null
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          estimated_time?: number | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          branch_id: string | null
          config: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          max_order_amount: number | null
          min_order_amount: number | null
          payment_method: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_order_amount?: number | null
          min_order_amount?: number | null
          payment_method: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_order_amount?: number | null
          min_order_amount?: number | null
          payment_method?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_address: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_address?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_address?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          starts_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string
          refund_method: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          refund_method?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          refund_method?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified_purchase: boolean | null
          is_visible: boolean | null
          menu_item_id: string
          order_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          is_visible?: boolean | null
          menu_item_id: string
          order_id?: string | null
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          is_visible?: boolean | null
          menu_item_id?: string
          order_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_orders: {
        Row: {
          branch_id: string | null
          cart_data: Json
          created_at: string
          id: string
          is_recurring: boolean | null
          recurrence_pattern: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          cart_data: Json
          created_at?: string
          id?: string
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch_id?: string | null
          cart_data?: Json
          created_at?: string
          id?: string
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_from_support: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_from_support?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_from_support?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          order_id: string | null
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          unit: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          unit?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_health_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      setup_initial_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff" | "customer"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "out_for_delivery"
        | "delivered"
        | "picked_up"
        | "cancelled"
      order_type: "delivery" | "pickup"
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
    Enums: {
      app_role: ["admin", "manager", "staff", "customer"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "picked_up",
        "cancelled",
      ],
      order_type: ["delivery", "pickup"],
    },
  },
} as const
