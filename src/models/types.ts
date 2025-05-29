
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  isGuest?: boolean;
  rating?: number;
  totalRatings?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  seller: User;
  location: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  createdAt: Date;
  isArchived: boolean;
  bidding?: {
    isAuction: boolean;
    currentBid?: number;
    bidCount?: number;
    endTime?: Date;
  };
  buyNowPrice?: number;
  shipping?: {
    cost: number;
    freeShipping: boolean;
    expeditedAvailable: boolean;
  };
  returns?: {
    accepted: boolean;
    periodDays?: number;
  };
  groupId?: string;
  visibility: 'public' | 'group-only';
}

export interface Bid {
  id: string;
  productId: string;
  userId: string;
  amount: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  productId?: string;
  isRead: boolean;
}

export type ProductCategory = 
  | 'Electronics'
  | 'Fashion'
  | 'Furniture'
  | 'Household'
  | 'Vehicles' 
  | 'Property'
  | 'Collectibles'
  | 'Sports'
  | 'Toys'
  | 'Business & Industrial'
  | 'Jewelry'
  | 'Other';
