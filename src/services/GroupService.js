
import { createGroup as mongoCreateGroup, getGroups as mongoGetGroups, joinGroup as mongoJoinGroup } from '../lib/mongodb';

export const GroupService = {
  async createGroup(groupData) {
    try {
      const groupId = await mongoCreateGroup(groupData);
      if (groupId) {
        await this.joinGroup(groupId, groupData.createdBy);
      }
      return groupId;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  },

  async getGroups() {
    try {
      const groups = await mongoGetGroups();
      return groups;
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  },

  async getGroupById(groupId) {
    try {
      const groups = await mongoGetGroups();
      return groups.find((group) => group.id === groupId) || null;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  },

  async joinGroup(groupId, userId) {
    try {
      return await mongoJoinGroup(groupId, userId);
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  },

  async getUserGroups(userId) {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  },

  async isUserMember(groupId, userId) {
    try {
      return false;
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },

  async initializeDefaultGroups() {
    try {
      const groups = await mongoGetGroups();
      const hasTopSale = groups.some((g) => g.name === 'Top Sale');
      
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
