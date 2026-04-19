import request from 'supertest';
import app from '../src/app';

describe('API — Endpoints', () => {

  // ── GET / ──────────────────────────────────────────────────────────────────
  describe('GET /', () => {
    it('returns API info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('MONENLET API');
      expect(res.body.endpoints).toBeDefined();
    });
  });

  // ── GET /health ────────────────────────────────────────────────────────────
  describe('GET /health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  // ── GET /convert/langs ─────────────────────────────────────────────────────
  describe('GET /convert/langs', () => {
    it('returns supported languages', async () => {
      const res = await request(app).get('/convert/langs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      const codes = res.body.data.map((l: { code: string }) => l.code);
      expect(codes).toContain('mg');
      expect(codes).toContain('fr');
      expect(codes).toContain('en');
    });
  });

  // ── POST /convert ──────────────────────────────────────────────────────────
  describe('POST /convert', () => {
    it('converts Malgache correctly', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ amount: 1352689.60, lang: 'mg' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.result).toBe(
        'Sivy amby valopolo sy eninjato sy roa arivo sy dimy alina sy telo hetsy sy iray tapitrisa Ariary faingo enimpolo'
      );
      expect(res.body.data.lang).toBe('mg');
      expect(res.body.data.input_formatted).toBe('1 352 689,60');
    });

    it('converts French correctly', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ amount: 1250.25, lang: 'fr' });

      expect(res.status).toBe(200);
      expect(res.body.data.result).toBe(
        'MILLE DEUX CENT CINQUANTE ARIARYS ET VINGT-CINQ CENTIMES'
      );
    });

    it('converts English correctly', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ amount: 1001, lang: 'en', decimals: 0 });

      expect(res.status).toBe(200);
      expect(res.body.data.result).toBe('ONE THOUSAND AND ONE ARIARYS');
    });

    it('returns 400 on missing amount', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ lang: 'mg' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details[0].field).toBe('amount');
    });

    it('returns 400 on invalid lang', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ amount: 100, lang: 'xx' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('accepts custom currency', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ amount: 100, lang: 'en', currency: 'USD', decimals: 0 });
      expect(res.status).toBe(200);
      expect(res.body.data.result).toContain('USD');
    });
  });

  // ── GET /convert?... ───────────────────────────────────────────────────────
  describe('GET /convert (query params)', () => {
    it('converts via GET with dot decimal', async () => {
      const res = await request(app)
        .get('/convert?amount=1250.25&lang=fr');
      expect(res.status).toBe(200);
      expect(res.body.data.result).toContain('MILLE');
    });

    it('accepts comma as decimal separator', async () => {
      const res = await request(app)
        .get('/convert?amount=1250%2C25&lang=fr');
      expect(res.status).toBe(200);
      expect(res.body.data.result).toContain('VINGT-CINQ CENTIMES');
    });

    it('returns 400 on missing lang', async () => {
      const res = await request(app).get('/convert?amount=100');
      expect(res.status).toBe(400);
    });
  });

  // ── 404 ───────────────────────────────────────────────────────────────────
  describe('404', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
