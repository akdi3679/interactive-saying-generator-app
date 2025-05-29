
// Database configuration
// You can choose between Supabase (recommended) or MongoDB

export const DATABASE_CONFIG = {
  // Set this to 'supabase' or 'mongodb' depending on your preference
  provider: 'mongodb' as 'supabase' | 'mongodb',
  
  // MongoDB Configuration (if using MongoDB)
  mongodb: {
    // Add your MongoDB connection string here
    // Example: "mongodb+srv://username:password@cluster.mongodb.net/dbname"
    uri: process.env.MONGODB_URI || "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/marketplace-db?retryWrites=true&w=majority",
  },
  
  // Supabase Configuration (if using Supabase - recommended)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  }
};

export const isDatabaseConfigured = () => {
  if (DATABASE_CONFIG.provider === 'supabase') {
    return !!(DATABASE_CONFIG.supabase.url && DATABASE_CONFIG.supabase.anonKey);
  } else {
    return !!DATABASE_CONFIG.mongodb.uri && !DATABASE_CONFIG.mongodb.uri.includes('your-username');
  }
};
