
import { createGroup as mongoCreateGroup, getGroups as mongoGetGroups, joinGroup as mongoJoinGroup, getUserGroups as mongoGetUserGroups, isUserMember as mongoIsUserMember } from '../lib/mongodb';

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
      return await mongoGetUserGroups(userId);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  },

  async isUserMember(groupId, userId) {
    try {
      return await mongoIsUserMember(groupId, userId);
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },

  async initializeDefaultGroups() {
    try {
      const groups = await mongoGetGroups();
      const hasTopSale = groups.some((g) => g.name === 'Buy & Sell Everything');
      
      if (!hasTopSale) {
        await this.createGroup({
          name: 'Buy & Sell Everything',
          description: 'A community for buying and selling all kinds of items',
          category: 'General',
          isPublic: true,
          createdBy: 'system'
        });
      }

      const hasElectronics = groups.some((g) => g.name === 'Electronics Market');
      if (!hasElectronics) {
        await this.createGroup({
          name: 'Electronics Market',
          description: 'Buy and sell electronics, gadgets, and tech items',
          category: 'Electronics',
          isPublic: true,
          createdBy: 'system'
        });
      }

      const hasFashion = groups.some((g) => g.name === 'Fashion Exchange');
      if (!hasFashion) {
        await this.createGroup({
          name: 'Fashion Exchange',
          description: 'Clothes, shoes, accessories and fashion items',
          category: 'Fashion',
          isPublic: true,
          createdBy: 'system'
        });
      }
    } catch (error) {
      console.error('Error initializing default groups:', error);
    }
  }
};
