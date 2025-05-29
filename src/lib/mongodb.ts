
import { DATABASE_CONFIG } from '../config/database';

// Mock MongoDB implementation for browser compatibility
// In a real application, this would be handled server-side

let mockDatabase = {
  users: [],
  groups: [],
  groupMemberships: []
};

export const connectToMongoDB = async () => {
  // Mock connection for browser environment
  console.log('Mock MongoDB connection established');
  return { connected: true };
};

export const createUser = async (email, password, name) => {
  try {
    // Check if user already exists
    const existingUser = mockDatabase.users.find((user) => user.email === email);
    if (existingUser) {
      return { error: "User with this email already exists", data: null };
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, this would be hashed
      name,
      createdAt: new Date(),
    };

    mockDatabase.users.push(newUser);
    return { data: { id: newUser.id, email, name }, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: "Failed to create user", data: null };
  }
};

export const validateUser = async (email, password) => {
  try {
    // Find user by email and password
    const user = mockDatabase.users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return { error: "Invalid credentials", data: null };
    }

    return { 
      data: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error validating user:', error);
    return { error: "Authentication failed", data: null };
  }
};

// Group operations
export const createGroup = async (groupData) => {
  try {
    const newGroup = {
      ...groupData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      memberCount: 1,
    };

    mockDatabase.groups.push(newGroup);
    return newGroup.id;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
};

export const getGroups = async () => {
  try {
    return mockDatabase.groups.map((group) => ({
      ...group,
    }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const joinGroup = async (groupId, userId) => {
  try {
    // Check if already a member
    const existingMembership = mockDatabase.groupMemberships.find(
      (m) => m.groupId === groupId && m.userId === userId
    );
    if (existingMembership) return true;

    // Add membership
    mockDatabase.groupMemberships.push({
      groupId,
      userId,
      joinedAt: new Date(),
      role: 'member'
    });

    // Update member count
    const group = mockDatabase.groups.find((g) => g.id === groupId);
    if (group) {
      group.memberCount++;
    }

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    return false;
  }
};
