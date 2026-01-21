import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../utils/jwt';
import { ok, created } from '../../../utils/response';

const userService = new UserService();

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.signup(req.body);
    const accessToken = signAccessToken({ 
      user: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    const refreshToken = signRefreshToken({ sub: user.id });
    return created(res, {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      tokens: { accessToken, refreshToken },
    }, 'Signup successful');
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await userService.validateCredentials(email, password);
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }
    const accessToken = signAccessToken({ 
      user: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    const refreshToken = signRefreshToken({ user: user.id });
    return ok(res, {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      tokens: { accessToken, refreshToken },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) {
      const error: any = new Error('Missing refresh token');
      error.status = 400;
      throw error;
    }
    const payload = verifyRefreshToken<{ user: string }>(refreshToken);
    const accessToken = signAccessToken({ user: payload.user });
    return ok(res, { accessToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}






