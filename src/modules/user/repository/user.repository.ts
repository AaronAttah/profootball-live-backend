import { Op } from 'sequelize';
import { User } from '../model/user.model';
import { Follow } from '../model/follow.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return User.findOne({ where: { id:id } });
  }

  async create(data: { email: string; passwordHash: string; firstName?: string; lastName?: string }): Promise<User> {
    return User.create(data);
  }

  // Follow relations
  async findOrCreateFollow(followerId: string, followingId: string): Promise<void> {
    await Follow.findOrCreate({ where: { followerId, followingId }, defaults: { followerId, followingId } });
  }
  async findFollow( followingId: string): Promise<void> {
    await Follow.findOne({ where: { followingId }});
  }

  async deleteFollow(followerId: string, followingId: string): Promise<void> {
    await Follow.destroy({ where: { followerId, followingId } });
  }

  async listFollowing(userId: string): Promise<User[]> {
    const follows = await Follow.findAll({ where: { followerId: userId } });
    const ids = follows.map(f => f.followingId);
    if (ids.length === 0) return [];
    return User.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'email', 'firstName', 'lastName'] });
  }

  async listFollowers(userId: string): Promise<User[]> {
    const follows = await Follow.findAll({ where: { followingId: userId } });
    const ids = follows.map(f => f.followerId);
    if (ids.length === 0) return [];
    return User.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'email', 'firstName', 'lastName'] });
  }
}




