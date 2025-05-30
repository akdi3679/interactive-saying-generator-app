
export interface TestUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  badges: string[];
  rating: number;
  totalRatings: number;
  followers: number;
  following: number;
  groups: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  connections: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  analytics: {
    productViews: number;
    productLikes: number;
    profileVisits: number;
    earnings: number;
    totalSales: number;
    activeListings: number;
  };
}

const testUser: TestUser = {
  id: "test-user-1",
  email: "test@test.com",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  bio: "Passionate seller with 5+ years of experience on the platform. I specialize in electronics and vintage items.",
  location: "New York, NY",
  joinDate: "2019-03-15",
  badges: ["Top Seller", "Fast Shipper", "Quality Products", "Verified Seller"],
  rating: 4.8,
  totalRatings: 1247,
  followers: 892,
  following: 156,
  groups: [
    { id: "1", name: "Electronics Enthusiasts", image: "https://picsum.photos/100?random=1" },
    { id: "2", name: "Vintage Collectors", image: "https://picsum.photos/100?random=2" },
    { id: "3", name: "Tech Reviews", image: "https://picsum.photos/100?random=3" }
  ],
  connections: [
    { id: "1", name: "Alice Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
    { id: "2", name: "Bob Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
    { id: "3", name: "Carol Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol" }
  ],
  analytics: {
    productViews: 15420,
    productLikes: 2890,
    profileVisits: 5670,
    earnings: 24750.50,
    totalSales: 156,
    activeListings: 23
  }
};

export class TestAuthService {
  static currentUser: TestUser | null = null;

  static async signIn(email: string, password: string): Promise<{ user: TestUser | null; error: string | null }> {
    if (email === "test@test.com" && password === "0000") {
      this.currentUser = testUser;
      localStorage.setItem('testUser', JSON.stringify(testUser));
      return { user: testUser, error: null };
    }
    return { user: null, error: "Invalid credentials" };
  }

  static signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('testUser');
  }

  static getCurrentUser(): TestUser | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('testUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  static updateUser(updates: Partial<TestUser>): TestUser {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('testUser', JSON.stringify(this.currentUser));
    }
    return this.currentUser!;
  }
}
