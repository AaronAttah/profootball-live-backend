import { UserRepository } from '../repository/user.repository';

export class FollowService {
  constructor(private readonly repo: UserRepository = new UserRepository()) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      const err: any = new Error('Cannot follow yourself');
      err.status = 400;
      throw err;
    }
    const userExist = await this.repo.findById(followingId)
    console.log({userExist})
    if (!userExist) {
      const err: any = new Error('this user does not exist');
      err.status = 500;
      throw err;
    }

    await this.repo.findOrCreateFollow(followerId, followingId);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.repo.deleteFollow(followerId, followingId);
  }

  async getFollowing(userId: string) {
    return this.repo.listFollowing(userId);
  }

  async getFollowers(userId: string) {
    return this.repo.listFollowers(userId);
  }
}


