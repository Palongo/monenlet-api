# Changelog

## [1.0.0] — 2026-04-18 — Publication initiale

### Ajouté
- `POST /convert` — Conversion via body JSON
- `GET /convert` — Conversion via query params (virgule ou point acceptés)
- `GET /convert/langs` — Liste des langues supportées
- `GET /health` — Health check
- `GET /docs` — Swagger UI interactif (OpenAPI 3.0)
- `GET /docs/json` — Spec OpenAPI brut
- Logique MG, FR, EN portée depuis le projet VBA `monenlet-vba`
- Validation Zod sur tous les paramètres
- Rate limiting : 200 req / 15 min / IP
- Sécurité : Helmet + CORS
- Dockerfile + `railway.toml` + `render.yaml`
- Suite de tests Jest + Supertest
