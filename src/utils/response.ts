import { Response } from 'express';
import { HttpStatus } from './status-codes';

type SuccessPayload<T = any> = {
  success: true;
  message?: string;
  data?: T;
};

type ErrorPayload = {
  success: false;
  message: string;
  details?: any;
};

export function sendSuccess<T = any>(res: Response, status: HttpStatus, data?: T, message?: string) {
  const payload: SuccessPayload<T> = { success: true };
  if (typeof message !== 'undefined') payload.message = message;
  if (typeof data !== 'undefined') payload.data = data;
  return res.status(status).json(payload);
}

export function sendError(res: Response, status: HttpStatus, message: string, details?: any) {
  const payload: ErrorPayload = { success: false, message };
  if (typeof details !== 'undefined') payload.details = details;
  return res.status(status).json(payload);
}

// Shorthand helpers
export const ok = <T = any>(res: Response, data?: T, message?: string) => sendSuccess(res, HttpStatus.OK, data, message);
export const created = <T = any>(res: Response, data?: T, message?: string) => sendSuccess(res, HttpStatus.CREATED, data, message);
export const noContent = (res: Response) => res.status(HttpStatus.NO_CONTENT).send();


