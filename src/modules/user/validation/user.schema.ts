import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  notificationPrefs: z.record(z.any()).optional(),
});

export const updateEmailSchema = z.object({
  email: z.string().email(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});



