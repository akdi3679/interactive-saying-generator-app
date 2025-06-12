
export const DATABASE_CONFIG = {
  provider: 'mongodb',
  
  mongodb: {
    uri: import.meta.env.VITE_MONGODB_URI || "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/marketplace-db?retryWrites=true&w=majority",
  }
};

export const isDatabaseConfigured = () => {
  return !!DATABASE_CONFIG.mongodb.uri && !DATABASE_CONFIG.mongodb.uri.includes('your-username');
};
