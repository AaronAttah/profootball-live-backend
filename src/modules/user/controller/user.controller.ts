import { Request, Response, NextFunction } from 'express';
import { UserProfileService } from '../service/userProfile.service';
import { AccountService } from '../service/account.service';
import { ok, noContent } from '../../../utils/response';

const profileService = new UserProfileService();
const accountService = new AccountService();

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.user as string;
    const profile = await profileService.getOrCreate(userId);
    return ok(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.user as string;
    const profile = await profileService.update(userId, req.body);
    return ok(res, profile, 'Profile updated');
  } catch (err) {
    next(err);
  }
}


export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.user as string;
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    await accountService.updatePassword(userId, currentPassword, newPassword);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}

