
import { useAuth as useSupabaseAuth } from '../context/AuthContext';
import { useAuth as useMongoAuth } from '../context/MongoAuthContext';
import { DATABASE_CONFIG } from '../config/database';

export const useDatabase = () => {
  if (DATABASE_CONFIG.provider === 'mongodb') {
    const mongoAuth = useMongoAuth();
    return {
      ...mongoAuth,
      session: mongoAuth.user ? { user: mongoAuth.user } : null,
    };
  } else {
    return useSupabaseAuth();
  }
};
