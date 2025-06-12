
import { DATABASE_CONFIG } from '../config/database';

let mockDatabase = {
  users: [],
  groups: [],
  groupMemberships: [],
  groupPosts: []
};

export const connectToMongoDB = async () => {
  console.log('Mock MongoDB connection established');
  return { connected: true };
};

export const createUser = async (email, password, name) => {
  try {
    const existingUser = mockDatabase.users.find((user) => user.email === email);
    if (existingUser) {
      return { error: "User with this email already exists", data: null };
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
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
    const existingMembership = mockDatabase.groupMemberships.find(
      (m) => m.groupId === groupId && m.userId === userId
    );
    if (existingMembership) return true;

    mockDatabase.groupMemberships.push({
      groupId,
      userId,
      joinedAt: new Date(),
      role: 'member'
    });

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

export const getUserGroups = async (userId) => {
  try {
    const userMemberships = mockDatabase.groupMemberships.filter(m => m.userId === userId);
    const userGroups = userMemberships.map(membership => {
      return mockDatabase.groups.find(group => group.id === membership.groupId);
    }).filter(Boolean);
    
    return userGroups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
};

export const isUserMember = async (groupId, userId) => {
  try {
    const membership = mockDatabase.groupMemberships.find(
      m => m.groupId === groupId && m.userId === userId
    );
    return !!membership;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

export const createGroupPost = async (postData) => {
  try {
    const newPost = {
      ...postData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      likes: 0,
      comments: []
    };

    mockDatabase.groupPosts.push(newPost);
    return newPost.id;
  } catch (error) {
    console.error('Error creating group post:', error);
    return null;
  }
};

export const getGroupPosts = async (groupId) => {
  try {
    return mockDatabase.groupPosts
      .filter(post => post.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching group posts:', error);
    return [];
  }
};
