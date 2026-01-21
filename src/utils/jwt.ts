import jwt from 'jsonwebtoken';
import {jwtConfig} from '../config/index'

const jwtSecret =jwtConfig.secret;
const accessExpiresIn = jwtConfig.expiresIn;
const refreshSecret = jwtConfig.secret;
const refreshExpiresIn = jwtConfig.expiresIn;


export function signAccessToken(payload: object): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: accessExpiresIn as any });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn as any });
}

export function verifyAccessToken<T = any>(token: string): T {
  return jwt.verify(token, jwtSecret) as T;
}

export function verifyRefreshToken<T = any>(token: string): T {
  return jwt.verify(token, refreshSecret) as T;
}





