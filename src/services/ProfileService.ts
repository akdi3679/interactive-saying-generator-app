
import { supabase } from '../lib/supabase';
import { User } from '../models/types';

export const ProfileService = {
  async getProfileById(userId: string): Promise<User | null> {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url || '',
      createdAt: new Date(data.created_at),
    };
  },

  async updateProfile(userId: string, updates: { name?: string; avatar_url?: string }): Promise<boolean> {
    if (!userId) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!userId || !file) return null;

    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);

    // Update the user's profile with the new avatar URL
    await ProfileService.updateProfile(userId, { avatar_url: data.publicUrl });

    return data.publicUrl;
  }
};
