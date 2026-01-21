import { UserProfile } from '../model/userProfile.model';

export class UserProfileService {
  async getOrCreate(userId: string): Promise<UserProfile> {
    const existing = await UserProfile.findOne({ where: { userId } });
    if (existing) return existing;
    return UserProfile.create({ userId, notificationPrefs: {} });
  }

  async update(userId: string, data: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'avatarUrl' | 'coverUrl' | 'notificationPrefs'>>): Promise<UserProfile> {
    const profile = await this.getOrCreate(userId);
    await profile.update(data as any);
    return profile;
  }
}



