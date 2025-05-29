
import { Group, GroupMembership } from '../models/group.types';
import { createGroup as mongoCreateGroup, getGroups as mongoGetGroups, joinGroup as mongoJoinGroup } from '../lib/mongodb';

export const GroupService = {
  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'memberCount'>): Promise<string | null> {
    try {
      const groupId = await mongoCreateGroup(groupData);
      if (groupId) {
        // Auto-join creator to the group
        await this.joinGroup(groupId, groupData.createdBy);
      }
      return groupId;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  },

  async getGroups(): Promise<Group[]> {
    try {
      return await mongoGetGroups();
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  },

  async getGroupById(groupId: string): Promise<Group | null> {
    try {
      const groups = await mongoGetGroups();
      return groups.find((group: Group) => group.id === groupId) || null;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  },

  async joinGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      return await mongoJoinGroup(groupId, userId);
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  },

  async getUserGroups(userId: string): Promise<Group[]> {
    try {
      // This would need to be implemented in MongoDB
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  },

  async isUserMember(groupId: string, userId: string): Promise<boolean> {
    try {
      // This would need to be implemented in MongoDB
      // For now, return false
      return false;
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },

  async initializeDefaultGroups(): Promise<void> {
    try {
      const groups = await mongoGetGroups();
      const hasTopSale = groups.some((g: Group) => g.name === 'Top Sale');
      
      if (!hasTopSale) {
        await this.createGroup({
          name: 'Top Sale',
          description: 'Best deals and trending items',
          category: 'General',
          isPublic: true,
          createdBy: 'system'
        });
      }
    } catch (error) {
      console.error('Error initializing default groups:', error);
    }
  }
};
