import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Validation error', errors: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}



