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
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          unit: string
          current_stock: number
          min_stock: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          unit: string
          current_stock?: number
          min_stock?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          unit?: string
          current_stock?: number
          min_stock?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      stock_transactions: {
        Row: {
          id: string
          item_id: string
          item_name: string
          type: 'in' | 'out'
          quantity: number
          notes: string | null
          date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          item_name: string
          type: 'in' | 'out'
          quantity: number
          notes?: string | null
          date?: string
          created_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          item_name?: string
          type?: 'in' | 'out'
          quantity?: number
          notes?: string | null
          date?: string
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      low_stock_items: {
        Row: {
          id: string
          name: string
          category: string
          unit: string
          current_stock: number
          min_stock: number
          price: number
          status: 'normal' | 'warning' | 'danger'
        }
      }
    }
    Functions: {
      get_dashboard_stats: {
        Returns: {
          total_items: number
          total_stock_in: number
          total_stock_out: number
          low_stock_count: number
        }
      }
    }
  }
}


