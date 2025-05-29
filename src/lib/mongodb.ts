
import { MongoClient, ServerApiVersion } from 'mongodb';
import { DATABASE_CONFIG } from '../config/database';

let client: MongoClient | null = null;
let isConnected = false;

export const connectToMongoDB = async () => {
  if (isConnected && client) {
    console.log('Already connected to MongoDB');
    return client;
  }

  try {
    const uri = DATABASE_CONFIG.mongodb.uri;
    
    if (!uri || uri.includes('your-username')) {
      console.error('MongoDB URI is required. Please add your MongoDB connection string to src/config/database.ts');
      return null;
    }

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
    isConnected = true;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return null;
  }
};

export const createUser = async (email: string, password: string, name: string) => {
  try {
    const mongoClient = await connectToMongoDB();
    if (!mongoClient) {
      return { error: "MongoDB connection failed", data: null };
    }

    const db = mongoClient.db("marketplace");
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists", data: null };
    }

    // In a real application, you would hash the password before storing
    // This is just a simplified example
    const newUser = {
      email,
      password, // NEVER store plaintext passwords in production
      name,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    return { data: { id: result.insertedId.toString(), email, name }, error: null };
  } catch (error) {
    console.error('Error creating user in MongoDB:', error);
    return { error: "Failed to create user", data: null };
  }
};

export const validateUser = async (email: string, password: string) => {
  try {
    const mongoClient = await connectToMongoDB();
    if (!mongoClient) {
      return { error: "MongoDB connection failed", data: null };
    }

    const db = mongoClient.db("marketplace");
    const usersCollection = db.collection("users");

    // Find user by email and password
    // In a real application, you would compare hashed passwords
    const user = await usersCollection.findOne({ email, password });
    if (!user) {
      return { error: "Invalid credentials", data: null };
    }

    return { 
      data: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error validating user in MongoDB:', error);
    return { error: "Authentication failed", data: null };
  }
};

// Group operations
export const createGroup = async (groupData: any) => {
  try {
    const mongoClient = await connectToMongoDB();
    if (!mongoClient) return null;

    const db = mongoClient.db("marketplace");
    const groupsCollection = db.collection("groups");

    const newGroup = {
      ...groupData,
      createdAt: new Date(),
      memberCount: 1,
    };

    const result = await groupsCollection.insertOne(newGroup);
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
};

export const getGroups = async () => {
  try {
    const mongoClient = await connectToMongoDB();
    if (!mongoClient) return [];

    const db = mongoClient.db("marketplace");
    const groupsCollection = db.collection("groups");

    const groups = await groupsCollection.find({}).toArray();
    return groups.map(group => ({
      ...group,
      id: group._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const joinGroup = async (groupId: string, userId: string) => {
  try {
    const mongoClient = await connectToMongoDB();
    if (!mongoClient) return false;

    const db = mongoClient.db("marketplace");
    const membershipsCollection = db.collection("groupMemberships");

    // Check if already a member
    const existingMembership = await membershipsCollection.findOne({ groupId, userId });
    if (existingMembership) return true;

    // Add membership
    await membershipsCollection.insertOne({
      groupId,
      userId,
      joinedAt: new Date(),
      role: 'member'
    });

    // Update member count
    const groupsCollection = db.collection("groups");
    await groupsCollection.updateOne(
      { _id: groupId },
      { $inc: { memberCount: 1 } }
    );

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    return false;
  }
};
