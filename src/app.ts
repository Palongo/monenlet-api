import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import convertRouter from './routes/convert';
import { errorHandler, notFound } from './middleware/errorHandler';
import { swaggerSpec } from './swagger';

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Middlewares de sécurité
// ─────────────────────────────────────────────────────────────────────────────

// Helmet : headers de sécurité HTTP
app.use(
  helmet({
    // Désactivé pour permettre le rendu Swagger UI inline
    contentSecurityPolicy: false,
  }),
);

// CORS : autoriser toutes les origines (API publique)
app.use(
  cors({
    origin:  '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting : 200 requêtes / 15 min par IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      200,
    message: {
      success: false,
      error:   'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders:   false,
  }),
);

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /:
 *   get:
 *     summary: Informations sur l'API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Bienvenue sur l'API MONENLET
 */
app.get('/', (_req, res) => {
  res.json({
    name:        'MONENLET API',
    version:     '1.0.0',
    description: 'Montant en lettres — Malgache · Français · Anglais',
    author:      'Justin FARALAHY — MAAS (managnasa.co)',
    endpoints: {
      convert_post: 'POST /convert',
      convert_get:  'GET  /convert?amount=&lang=',
      langs:        'GET  /convert/langs',
      health:       'GET  /health',
      docs:         'GET  /docs',
    },
    docs:   `${process.env.API_URL ?? 'http://localhost:3000'}/docs`,
    github: 'https://github.com/VOTRE_USERNAME/monenlet-api',
  });
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service opérationnel
 */
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    Math.floor(process.uptime()),
    version:   '1.0.0',
  });
});

// Routes de conversion
app.use('/convert', convertRouter);

// Documentation Swagger UI
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'MONENLET API — Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);

// Route OpenAPI spec JSON brut
app.get('/docs/json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─────────────────────────────────────────────────────────────────────────────
// Handlers d'erreur (doivent être en dernier)
// ─────────────────────────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Démarrage
// ─────────────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.listen(PORT, () => {
  console.log(`✅ MONENLET API v1.0.0 — http://localhost:${PORT}`);
  console.log(`📚 Swagger UI       — http://localhost:${PORT}/docs`);
  console.log(`🌐 Langues          — mg · fr · en`);
});

export default app;
