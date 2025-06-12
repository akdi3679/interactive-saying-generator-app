
export const ProfileService = {
  async getProfileById(userId) {
    if (!userId) return null;

    // Mock profile data using localStorage
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    const profile = profiles[userId];
    
    if (!profile) {
      // Create a default profile if none exists
      const defaultProfile = {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        avatar: '',
        createdAt: new Date(),
      };
      
      profiles[userId] = defaultProfile;
      localStorage.setItem('profiles', JSON.stringify(profiles));
      return defaultProfile;
    }

    return profile;
  },

  async updateProfile(userId, updates) {
    if (!userId) return false;

    try {
      const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      if (profiles[userId]) {
        profiles[userId] = { ...profiles[userId], ...updates };
        localStorage.setItem('profiles', JSON.stringify(profiles));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  async uploadAvatar(userId, file) {
    if (!userId || !file) return null;

    // Mock avatar upload - in a real app this would upload to storage
    const mockUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`;
    
    await this.updateProfile(userId, { avatar_url: mockUrl });
    return mockUrl;
  }
};
