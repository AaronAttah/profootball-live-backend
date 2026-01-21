import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../../../utils/response';
import { HttpStatus } from '../../../utils/status-codes';

export const idParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ID format' }),
});

export const validateParams = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.params);
    next();
  } catch (error: any) {
    return sendError(res, HttpStatus.BAD_REQUEST, 'Validation error', error.errors);
  }
};
