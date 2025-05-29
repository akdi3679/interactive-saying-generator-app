import { Product, User, ProductCategory } from '../models/types';
import { getAuthState } from '../components/AuthButtons';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: new Date('2023-02-28'),
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    createdAt: new Date('2023-03-10'),
  }
];

export const categories: ProductCategory[] = [
  'Electronics',
  'Fashion',
  'Furniture',
  'Household',
  'Vehicles',
  'Property',
  'Collectibles',
  'Sports',
  'Toys',
  'Business & Industrial',
  'Jewelry',
  'Other'
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro',
    description: 'Barely used, perfect condition. Comes with original box and accessories. This phone is in excellent condition with no scratches or dents. Includes original charger, cable, and earphones. Battery health is at 98%. Recently upgraded to the latest iOS version.',
    price: 899,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1681567686392-dab7667d6642?q=80&w=2070',
      'https://images.unsplash.com/photo-1695575191499-69eb5a4710b2?q=80&w=2070',
      'https://images.unsplash.com/photo-1632581896950-d6914a644cef?q=80&w=3116&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    seller: mockUsers[0],
    location: 'San Francisco, CA',
    condition: 'Like New',
    createdAt: new Date('2023-06-15'),
    isArchived: false,
    bidding: {
      isAuction: true,
      currentBid: 899,
      bidCount: 12,
      endTime: new Date('2023-08-30'),
    },
    buyNowPrice: 1099,
    shipping: {
      cost: 0,
      freeShipping: true,
      expeditedAvailable: true,
    },
    returns: {
      accepted: true,
      periodDays: 14,
    },
    visibility: 'public',
  },
  {
    id: '2',
    title: 'Modern Leather Sofa',
    description: 'Beautiful brown leather sofa, only 1 year old. Moving and need to sell quickly. This high-quality genuine leather sofa has minimal wear. Perfect for a living room or office space. Comfortable and durable with solid wood frame. Pick up only - no delivery available.',
    price: 750,
    category: 'Furniture',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2070',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070',
    ],
    seller: mockUsers[1],
    location: 'Chicago, IL',
    condition: 'Good',
    createdAt: new Date('2023-05-20'),
    isArchived: false,
    shipping: {
      cost: 150,
      freeShipping: false,
      expeditedAvailable: false,
    },
    returns: {
      accepted: false,
    },
    visibility: 'public',
  },
  {
    id: '3',
    title: 'Sony Noise Cancelling Headphones',
    description: 'WH-1000XM4 model, great sound quality with noise cancellation. These premium headphones provide industry-leading noise cancellation with dual noise sensor technology. Enjoy 30 hours of battery life and quick charging. Touch controls for volume, play/pause, and voice assistant.',
    price: 199,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2788',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=2071',
    ],
    seller: mockUsers[2],
    location: 'Austin, TX',
    condition: 'Good',
    createdAt: new Date('2023-06-01'),
    isArchived: false,
    shipping: {
      cost: 0,
      freeShipping: true,
      expeditedAvailable: true,
    },
    returns: {
      accepted: true,
      periodDays: 30,
    },
    visibility: 'public',
  },
  {
    id: '4',
    title: 'Nike Air Jordan 1',
    description: 'Size 10, worn only a few times. Original box included. These classic Air Jordan 1s are in excellent condition. The iconic red and black colorway is perfect for any collection. Minimal creasing on the toe box. 100% authentic - purchased directly from Nike.',
    price: 180,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=2065',
    ],
    seller: mockUsers[0],
    location: 'New York, NY',
    condition: 'Like New',
    createdAt: new Date('2023-05-10'),
    isArchived: false,
    shipping: {
      cost: 12,
      freeShipping: false,
      expeditedAvailable: true,
    },
    returns: {
      accepted: false,
    },
    visibility: 'public',
  },
  {
    id: '5',
    title: '2019 Toyota Camry',
    description: '45,000 miles, excellent condition, one owner, all service records available. This fuel-efficient sedan gets 32 MPG combined. Features include backup camera, Bluetooth connectivity, Apple CarPlay, and Android Auto. Recently serviced with all fluids changed and new brakes installed.',
    price: 18500,
    category: 'Vehicles',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2069',
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2069',
    ],
    seller: mockUsers[1],
    location: 'Dallas, TX',
    condition: 'Good',
    createdAt: new Date('2023-06-12'),
    isArchived: false,
    bidding: {
      isAuction: true,
      currentBid: 18500,
      bidCount: 5,
      endTime: new Date('2023-09-01'),
    },
    visibility: 'public',
  },
  {
    id: '6',
    title: 'MacBook Pro 16"',
    description: 'M1 Max, 32GB RAM, 1TB SSD. Perfect for developers and designers. This powerful MacBook Pro is in excellent condition with minimal use. The M1 Max chip delivers exceptional performance for demanding tasks like video editing and 3D rendering. Space Gray color. Includes original box, charger, and AppleCare+ until 2025.',
    price: 2499,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=2787',
    ],
    seller: mockUsers[2],
    location: 'Seattle, WA',
    condition: 'Like New',
    createdAt: new Date('2023-06-05'),
    isArchived: true,
    shipping: {
      cost: 0,
      freeShipping: true,
      expeditedAvailable: true,
    },
    returns: {
      accepted: true,
      periodDays: 14,
    },
    visibility: 'public',
  },
];

export const getCurrentUser = (): User | null => {
  const auth = getAuthState();
  
  if (auth.isLoggedIn && auth.user) {
    return {
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      avatar: auth.user.avatar,
      createdAt: new Date(),
    };
  }
  
  return null;
};

export const getWishlist = (): string[] => {
  // In a real app, this would come from an API or local storage
  return ['2', '5']; 
};
