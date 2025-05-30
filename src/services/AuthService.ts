
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export class AuthService {
  private static currentUser: User | null = null;

  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Test credentials
    if (email === 'test@test.com' && password === '0000') {
      const user: User = {
        id: 'current-user',
        email: 'test@test.com',
        name: 'Test User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser'
      };
      
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { user, error: null };
    }
    
    return { user: null, error: 'Invalid credentials' };
  }

  static signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  static getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
