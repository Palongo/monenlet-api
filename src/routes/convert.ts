import { Router, Request, Response } from 'express';
import { convert, SUPPORTED_LANGS, LANG_LABELS } from '../core/index';
import { ConvertSchema, ConvertQuerySchema, validateBody, validateQuery } from '../middleware/validate';

const router = Router();

/**
 * @openapi
 * /convert:
 *   post:
 *     summary: Convertit un montant en lettres
 *     description: |
 *       Convertit un montant numérique en lettres dans la langue choisie.
 *       Supporte le Malgache (mg), le Français (fr) et l'Anglais (en).
 *     tags: [Conversion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConvertRequest'
 *           examples:
 *             malgache:
 *               summary: Exemple Malgache
 *               value: { amount: 1352689.60, lang: "mg" }
 *             francais:
 *               summary: Exemple Français
 *               value: { amount: 1250.25, lang: "fr", currency: "ARIARY", decimals: 2 }
 *             anglais:
 *               summary: Exemple Anglais
 *               value: { amount: 1001, lang: "en", decimals: 0 }
 *     responses:
 *       200:
 *         description: Conversion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvertResponse'
 *       400:
 *         description: Paramètres invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  validateBody(ConvertSchema),
  (req: Request, res: Response): void => {
    const result = convert(req.body);
    res.json({
      success: true,
      data:    result,
      meta: {
        version:         '1.0.0',
        supported_langs: SUPPORTED_LANGS,
      },
    });
  },
);

/**
 * @openapi
 * /convert:
 *   get:
 *     summary: Convertit un montant en lettres (GET)
 *     description: |
 *       Alternative GET pour les intégrations simples (liens, navigateur).
 *       Accepte la virgule ou le point comme séparateur décimal.
 *     tags: [Conversion]
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 *         description: "Montant a convertir. Accepte virgule ou point decimal."
 *         example: "1352689.60"
 *       - in: query
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mg, fr, en]
 *         description: Code langue
 *         example: "mg"
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Devise (défaut selon la langue)
 *         example: "Ariary"
 *       - in: query
 *         name: decimals
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 2
 *         description: Nombre de décimales (défaut 2)
 *         example: 2
 *     responses:
 *       200:
 *         description: Conversion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvertResponse'
 *       400:
 *         description: Paramètres invalides
 */
router.get(
  '/',
  validateQuery(ConvertQuerySchema),
  (req: Request, res: Response): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = (req as any).parsedQuery;
    const result = convert(parsed);
    res.json({
      success: true,
      data:    result,
      meta: {
        version:         '1.0.0',
        supported_langs: SUPPORTED_LANGS,
      },
    });
  },
);

/**
 * @openapi
 * /convert/langs:
 *   get:
 *     summary: Liste les langues supportées
 *     tags: [Conversion]
 *     responses:
 *       200:
 *         description: Liste des langues disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:  { type: string }
 *                       label: { type: string }
 */
router.get('/langs', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: SUPPORTED_LANGS.map((code) => ({ code, label: LANG_LABELS[code] })),
  });
});

export default router;
