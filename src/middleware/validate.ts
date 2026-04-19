import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const ConvertSchema = z.object({
  amount: z
    .number({ required_error: 'amount is required', invalid_type_error: 'amount must be a number' })
    .finite('amount must be a finite number')
    .max(999_999_999_999, 'amount must be <= 999 999 999 999'),

  lang: z.enum(['mg', 'fr', 'en'], {
    required_error: 'lang is required',
    invalid_type_error: "lang must be one of: 'mg', 'fr', 'en'",
  }),

  currency: z
    .string()
    .min(1)
    .max(20)
    .optional(),

  decimals: z
    .number()
    .int()
    .min(0, 'decimals must be >= 0')
    .max(2, 'decimals must be <= 2')
    .optional()
    .default(2),
});

// Schema pour les requêtes GET (query params sont des strings)
export const ConvertQuerySchema = z.object({
  amount: z
    .string({ required_error: 'amount is required' })
    .transform((v) => {
      // Accepte virgule ou point comme séparateur décimal
      const n = parseFloat(v.replace(',', '.'));
      if (isNaN(n)) throw new Error('amount must be a valid number');
      return n;
    })
    .pipe(
      z.number()
        .finite()
        .max(999_999_999_999)
    ),

  lang: z.enum(['mg', 'fr', 'en'], {
    required_error: 'lang is required',
    invalid_type_error: "lang must be one of: 'mg', 'fr', 'en'",
  }),

  currency: z.string().min(1).max(20).optional(),

  decimals: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(0).max(2))
    .optional()
    .default('2'),
});

/**
 * Middleware de validation Zod générique.
 * Valide req.body avec le schema fourni.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error:   'Validation error',
        details: result.error.errors.map((e) => ({
          field:   e.path.join('.') || 'root',
          message: e.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Middleware de validation Zod pour query params.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateQuery(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error:   'Validation error',
        details: result.error.errors.map((e) => ({
          field:   e.path.join('.') || 'root',
          message: e.message,
        })),
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).parsedQuery = result.data;
    next();
  };
}
