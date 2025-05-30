
import { TestAuthService } from '../services/TestAuthService';

export const useDatabase = () => {
  const user = TestAuthService.getCurrentUser();
  
  return {
    user,
    session: user ? { user } : null,
    signIn: TestAuthService.signIn,
    signUp: TestAuthService.signUp,
    signOut: TestAuthService.signOut,
    loading: false
  };
};
