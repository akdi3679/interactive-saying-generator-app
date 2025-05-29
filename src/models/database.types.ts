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
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: string
          images: string[]
          seller_id: string
          location: string
          condition: string
          created_at: string
          is_archived: boolean
          is_auction: boolean
          current_bid?: number
          bid_count?: number
          auction_end?: string
          buy_now_price?: number
          shipping_cost: number
          free_shipping: boolean
          expedited_available: boolean
          returns_accepted: boolean
          returns_period_days?: number
          group_id?: string
          visibility: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: string
          images: string[]
          seller_id: string
          location: string
          condition: string
          created_at?: string
          is_archived?: boolean
          is_auction?: boolean
          current_bid?: number
          bid_count?: number
          auction_end?: string
          buy_now_price?: number
          shipping_cost?: number
          free_shipping?: boolean
          expedited_available?: boolean
          returns_accepted?: boolean
          returns_period_days?: number
          group_id?: string
          visibility?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          images?: string[]
          seller_id?: string
          location?: string
          condition?: string
          created_at?: string
          is_archived?: boolean
          is_auction?: boolean
          current_bid?: number
          bid_count?: number
          auction_end?: string
          buy_now_price?: number
          shipping_cost?: number
          free_shipping?: boolean
          expedited_available?: boolean
          returns_accepted?: boolean
          returns_period_days?: number
          group_id?: string
          visibility?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
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
  }
}
