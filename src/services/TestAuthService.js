
const testUser = {
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
  static currentUser = null;

  static async signIn(email, password) {
    if (email === "test@test.com" && password === "0000") {
      this.currentUser = testUser;
      localStorage.setItem('testUser', JSON.stringify(testUser));
      return { user: testUser, error: null };
    }
    return { user: null, error: "Invalid credentials" };
  }

  static async signUp(email, password, name) {
    const newUser = {
      ...testUser,
      id: `user-${Date.now()}`,
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinDate: new Date().toISOString().split('T')[0],
      analytics: {
        productViews: 0,
        productLikes: 0,
        profileVisits: 0,
        earnings: 0,
        totalSales: 0,
        activeListings: 0
      }
    };
    
    this.currentUser = newUser;
    localStorage.setItem('testUser', JSON.stringify(newUser));
    return { user: newUser, error: null };
  }

  static signOut() {
    this.currentUser = null;
    localStorage.removeItem('testUser');
  }

  static getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('testUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  static updateUser(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('testUser', JSON.stringify(this.currentUser));
    }
    return this.currentUser;
  }
}
