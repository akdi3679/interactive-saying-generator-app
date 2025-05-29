import { supabase } from '../lib/supabase';
import { Database } from '../models/database.types';
import { Product, ProductCategory, User } from '../models/types';

export type DbProduct = Database['public']['Tables']['products']['Row'];

// Convert a database product to our frontend Product type
const mapDbProductToProduct = async (dbProduct: DbProduct): Promise<Product> => {
  // Get the seller profile
  const { data: sellerData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', dbProduct.seller_id)
    .single();

  const seller: User = {
    id: dbProduct.seller_id,
    name: sellerData?.name || 'Unknown User',
    email: sellerData?.email || '',
    avatar: sellerData?.avatar_url || '',
    createdAt: new Date(sellerData?.created_at || Date.now()),
  };

  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category as ProductCategory,
    images: dbProduct.images,
    seller: seller,
    location: dbProduct.location,
    condition: dbProduct.condition as 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor',
    createdAt: new Date(dbProduct.created_at),
    isArchived: dbProduct.is_archived,
    bidding: dbProduct.is_auction ? {
      isAuction: true,
      currentBid: dbProduct.current_bid,
      bidCount: dbProduct.bid_count,
      endTime: dbProduct.auction_end ? new Date(dbProduct.auction_end) : undefined,
    } : undefined,
    buyNowPrice: dbProduct.buy_now_price,
    shipping: {
      cost: dbProduct.shipping_cost,
      freeShipping: dbProduct.free_shipping,
      expeditedAvailable: dbProduct.expedited_available,
    },
    returns: {
      accepted: dbProduct.returns_accepted,
      periodDays: dbProduct.returns_period_days,
    },
    groupId: dbProduct.group_id,
    visibility: (dbProduct.visibility as 'public' | 'group-only') || 'public',
  };
};

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    const products = await Promise.all(
      (data || []).map(product => mapDbProductToProduct(product))
    );

    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return mapDbProductToProduct(data);
  },

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    const products = await Promise.all(
      (data || []).map(product => mapDbProductToProduct(product))
    );

    return products;
  },

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by seller:', error);
      return [];
    }

    const products = await Promise.all(
      (data || []).map(product => mapDbProductToProduct(product))
    );

    return products;
  },

  async createProduct(product: Omit<Database['public']['Tables']['products']['Insert'], 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, created_at: new Date().toISOString() }])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data?.id || null;
  }
};
