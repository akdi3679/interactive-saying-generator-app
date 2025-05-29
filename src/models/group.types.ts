
export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPublic: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: Date;
  role: 'member' | 'admin' | 'moderator';
}

export type ProductVisibility = 'public' | 'group-only';
