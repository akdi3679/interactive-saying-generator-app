
import { useAuth as useSupabaseAuth } from '../context/AuthContext';
import { useMongoAuth } from '../services/MongoAuthService';
import { DATABASE_CONFIG } from '../config/database';

export const useDatabase = () => {
  const supabaseAuth = useSupabaseAuth();
  const mongoAuth = useMongoAuth();

  if (DATABASE_CONFIG.provider === 'supabase') {
    return supabaseAuth;
  } else {
    return {
      ...mongoAuth,
      user: null, // MongoDB auth would need session management
      loading: false,
      session: null,
      getProfile: async () => null,
    };
  }
};
