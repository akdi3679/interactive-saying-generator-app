
import { Product, User } from '../models/types';

// Test users with ratings
export const testUsers: User[] = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2020-01-15'),
    rating: 4.8,
    totalRatings: 156
  },
  {
    id: 'user2', 
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2019-05-20'),
    rating: 4.6,
    totalRatings: 89
  },
  {
    id: 'user3',
    name: 'Mike Wilson',
    email: 'mike@example.com', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    createdAt: new Date('2021-03-10'),
    rating: 4.9,
    totalRatings: 234
  }
];

// Test products with bidding functionality
export const testProducts: Product[] = [
  {
    id: 'product1',
    title: 'iPhone 14 Pro Max - Excellent Condition',
    description: 'Like new iPhone 14 Pro Max, 256GB, Space Black. Includes original box and charger.',
    price: 899.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    seller: testUsers[0],
    location: 'New York',
    condition: 'Like New',
    createdAt: new Date('2024-01-10'),
    isArchived: false,
    bidding: {
      isAuction: true,
      currentBid: 750.00,
      bidCount: 12,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    },
    buyNowPrice: 899.99,
    shipping: {
      cost: 0,
      freeShipping: true,
      expeditedAvailable: true
    },
    returns: {
      accepted: true,
      periodDays: 30
    },
    visibility: 'public'
  },
  {
    id: 'product2',
    title: 'Vintage Leather Jacket - Premium Quality',
    description: 'Authentic vintage leather jacket from the 80s. Genuine leather, great condition.',
    price: 150.00,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    ],
    seller: testUsers[1],
    location: 'Los Angeles',
    condition: 'Good',
    createdAt: new Date('2024-01-12'),
    isArchived: false,
    shipping: {
      cost: 15.99,
      freeShipping: false,
      expeditedAvailable: true
    },
    returns: {
      accepted: true,
      periodDays: 14
    },
    visibility: 'public'
  },
  {
    id: 'product3',
    title: 'Gaming Setup - RTX 4080 Gaming PC',
    description: 'High-end gaming PC with RTX 4080, 32GB RAM, and latest Intel processor.',
    price: 2500.00,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400'
    ],
    seller: testUsers[2],
    location: 'Chicago',
    condition: 'New',
    createdAt: new Date('2024-01-08'),
    isArchived: false,
    bidding: {
      isAuction: true,
      currentBid: 2100.00,
      bidCount: 8,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    buyNowPrice: 2500.00,
    shipping: {
      cost: 50.00,
      freeShipping: false,
      expeditedAvailable: false
    },
    returns: {
      accepted: true,
      periodDays: 30
    },
    visibility: 'public'
  },
  {
    id: 'product4',
    title: 'Antique Wooden Coffee Table',
    description: 'Beautiful handcrafted wooden coffee table from the 1960s. Perfect for any living room.',
    price: 300.00,
    category: 'Furniture',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ],
    seller: testUsers[0],
    location: 'San Francisco',
    condition: 'Good',
    createdAt: new Date('2024-01-14'),
    isArchived: false,
    shipping: {
      cost: 75.00,
      freeShipping: false,
      expeditedAvailable: false
    },
    returns: {
      accepted: false
    },
    visibility: 'public'
  }
];

// Store test data in localStorage
export const initializeTestData = () => {
  localStorage.setItem('testProducts', JSON.stringify(testProducts));
  localStorage.setItem('testUsers', JSON.stringify(testUsers));
  
  // Initialize bidding data
  const biddingData = {
    product1: [
      { userId: 'user2', amount: 720.00, timestamp: new Date('2024-01-15T10:00:00Z') },
      { userId: 'user3', amount: 750.00, timestamp: new Date('2024-01-15T14:30:00Z') }
    ],
    product3: [
      { userId: 'user1', amount: 2000.00, timestamp: new Date('2024-01-14T09:00:00Z') },
      { userId: 'user2', amount: 2100.00, timestamp: new Date('2024-01-15T11:00:00Z') }
    ]
  };
  localStorage.setItem('biddingData', JSON.stringify(biddingData));
};
