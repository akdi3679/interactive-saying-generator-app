
// Database configuration
// Using MongoDB only

export const DATABASE_CONFIG = {
  // Set this to 'mongodb' only
  provider: 'mongodb' as 'mongodb',
  
  // MongoDB Configuration
  mongodb: {
    // Add your MongoDB connection string here
    // Example: "mongodb+srv://username:password@cluster.mongodb.net/dbname"
    uri: import.meta.env.VITE_MONGODB_URI || "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/marketplace-db?retryWrites=true&w=majority",
  }
};

export const isDatabaseConfigured = () => {
  return !!DATABASE_CONFIG.mongodb.uri && !DATABASE_CONFIG.mongodb.uri.includes('your-username');
};
