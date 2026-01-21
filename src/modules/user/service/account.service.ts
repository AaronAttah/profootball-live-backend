import bcrypt from 'bcrypt';
import { User } from '../model/user.model';

export class AccountService {
  async updateEmail(userId: string, email: string): Promise<User> {
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== userId) {
      const err: any = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.email = email;
    await user.save();
    return user;
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      const err: any = new Error('Current password incorrect');
      err.status = 400;
      throw err;
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}



