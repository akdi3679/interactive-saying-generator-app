
import { DATABASE_CONFIG } from '../config/database';

// Mock MongoDB implementation for browser compatibility
// In a real application, this would be handled server-side

let mockDatabase: any = {
  users: [],
  groups: [],
  groupMemberships: []
};

export const connectToMongoDB = async () => {
  // Mock connection for browser environment
  console.log('Mock MongoDB connection established');
  return { connected: true };
};

export const createUser = async (email: string, password: string, name: string) => {
  try {
    // Check if user already exists
    const existingUser = mockDatabase.users.find((user: any) => user.email === email);
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

export const validateUser = async (email: string, password: string) => {
  try {
    // Find user by email and password
    const user = mockDatabase.users.find((u: any) => u.email === email && u.password === password);
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
export const createGroup = async (groupData: any) => {
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
    return mockDatabase.groups.map((group: any) => ({
      ...group,
    }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const joinGroup = async (groupId: string, userId: string) => {
  try {
    // Check if already a member
    const existingMembership = mockDatabase.groupMemberships.find(
      (m: any) => m.groupId === groupId && m.userId === userId
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
    const group = mockDatabase.groups.find((g: any) => g.id === groupId);
    if (group) {
      group.memberCount++;
    }

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    return false;
  }
};
