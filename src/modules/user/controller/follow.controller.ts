import { Request, Response, NextFunction } from 'express';
import { FollowService } from '../service/follow.service';
import { ok } from '../../../utils/response';

const followService = new FollowService();

export async function follow(req: Request, res: Response, next: NextFunction) {
  try {
    const followerId = (req as any).user?.user as string;
    console.log({followerId})
    const { userId } = req.params as { userId: string };

    await followService.follow(followerId, userId);
    return ok(res, undefined, 'Successfully followed');
  } catch (err) {
    next(err);
  }
}

export async function unfollow(req: Request, res: Response, next: NextFunction) {
  try {
    const followerId = (req as any).user?.user as string;
    const { userId } = req.params as { userId: string };
    await followService.unfollow(followerId, userId);
    return ok(res, undefined, 'Successfully unfollowed');
  } catch (err) {
    next(err);
  }
}

export async function listFollowing(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params as { userId: string };
    const users = await followService.getFollowing(userId);
    return ok(res, users);
  } catch (err) {
    next(err);
  }
}

export async function listFollowers(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params as { userId: string };
    const users = await followService.getFollowers(userId);
    return ok(res, users);
  } catch (err) {
    next(err);
  }
}

