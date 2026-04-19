# MONENLET API 🌍

> API REST — Montant en lettres | Malgache · Français · Anglais

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tests](https://img.shields.io/badge/Tests-Jest-red)

API REST open source pour convertir un montant numérique en lettres,
utilisable depuis n'importe quel langage, framework ou application tierce.

---

## Démo rapide

```bash
# Malgache
curl "https://api.example.com/convert?amount=1352689.60&lang=mg"

# Français
curl -X POST https://api.example.com/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 1250.25, "lang": "fr"}'

# Anglais
curl "https://api.example.com/convert?amount=1001&lang=en&decimals=0"
```

---

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/` | Informations et liste des endpoints |
| `GET` | `/health` | Health check (uptime, version) |
| `POST` | `/convert` | Conversion via body JSON |
| `GET` | `/convert?amount=&lang=` | Conversion via query params |
| `GET` | `/convert/langs` | Liste des langues supportées |
| `GET` | `/docs` | Documentation Swagger UI interactive |
| `GET` | `/docs/json` | Spec OpenAPI 3.0 en JSON brut |

---

## Syntaxe

### POST /convert

```json
{
  "amount":   1352689.60,
  "lang":     "mg",
  "currency": "Ariary",
  "decimals": 2
}
```

| Paramètre | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `amount` | number | ✅ | — | Montant (max 999 999 999 999) |
| `lang` | `mg` \| `fr` \| `en` | ✅ | — | Langue de conversion |
| `currency` | string | ❌ | `Ariary` / `ARIARY` | Libellé de devise |
| `decimals` | 0 \| 1 \| 2 | ❌ | `2` | Précision décimale |

### Réponse

```json
{
  "success": true,
  "data": {
    "amount":          1352689.60,
    "lang":            "mg",
    "lang_label":      "Malgache",
    "currency":        "Ariary",
    "decimals":        2,
    "result":          "Sivy amby valopolo sy eninjato sy roa arivo sy dimy alina sy telo hetsy sy iray tapitrisa Ariary faingo enimpolo",
    "input_formatted": "1 352 689,60"
  },
  "meta": {
    "version":         "1.0.0",
    "supported_langs": ["mg", "fr", "en"]
  }
}
```

### GET /convert (query params)

```
GET /convert?amount=1250.25&lang=fr&decimals=2
```

> ✅ Accepte la **virgule** ou le **point** comme séparateur décimal.
> `amount=1250,25` et `amount=1250.25` sont équivalents.

---

## Exemples d'intégration

### JavaScript / Fetch

```javascript
const response = await fetch('https://api.example.com/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 1352689.60, lang: 'mg' }),
});
const { data } = await response.json();
console.log(data.result);
// → "Sivy amby valopolo sy eninjato sy roa arivo..."
```

### PHP

```php
$response = file_get_contents('https://api.example.com/convert?' . http_build_query([
    'amount' => 1250.25,
    'lang'   => 'fr',
]));
$data = json_decode($response, true);
echo $data['data']['result'];
// → "MILLE DEUX CENT CINQUANTE ARIARYS ET VINGT-CINQ CENTIMES"
```

### Python

```python
import requests

res = requests.post('https://api.example.com/convert', json={
    'amount': 1001,
    'lang': 'en',
    'decimals': 0
})
print(res.json()['data']['result'])
# → "ONE THOUSAND AND ONE ARIARYS"
```

### Excel / Power Query

```
= Json.Document(
    Web.Contents("https://api.example.com/convert?amount="
      & Text.From([Montant]) & "&lang=mg")
  )[data][result]
```

### Google Sheets

```
=IMPORTDATA("https://api.example.com/convert?amount="&A1&"&lang=fr")
```

Ou via `IMPORTJSON` / Apps Script :

```javascript
function montantEnLettres(montant, langue) {
  const url = `https://api.example.com/convert?amount=${montant}&lang=${langue}`;
  const response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText()).data.result;
}
```

---

## Installation locale

```bash
git clone https://github.com/VOTRE_USERNAME/monenlet-api.git
cd monenlet-api

npm install
cp .env.example .env

# Mode développement (hot reload)
npm run dev

# Build + production
npm run build && npm start
```

L'API démarre sur `http://localhost:3000`.
La documentation Swagger est disponible sur `http://localhost:3000/docs`.

---

## Tests

```bash
# Tous les tests
npm test

# Avec couverture
npm run test:coverage
```

Suite de tests :
- **Tests unitaires** — logique MG, FR, EN (cas de référence + règles linguistiques)
- **Tests d'intégration** — tous les endpoints HTTP via Supertest
- **Tests de validation** — paramètres invalides, erreurs 400/404

---

## Déploiement

### Railway (recommandé — gratuit)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Fork ce dépôt sur GitHub
2. Créer un projet sur [railway.app](https://railway.app)
3. Connecter le dépôt GitHub → Railway détecte `railway.toml` automatiquement
4. Ajouter la variable `API_URL` avec l'URL publique générée par Railway
5. Deploy ✅

### Render (alternatif — gratuit)

1. Créer un compte sur [render.com](https://render.com)
2. New → Web Service → connecter le dépôt GitHub
3. Render détecte `render.yaml` automatiquement
4. Deploy ✅

### Docker

```bash
docker build -t monenlet-api .
docker run -p 3000:3000 -e NODE_ENV=production monenlet-api
```

### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - API_URL=http://localhost:3000
    restart: unless-stopped
```

---

## Architecture

```
src/
├── core/
│   ├── malagasy.ts     Logique MG — lecture ascendante, amby/sy/faingo
│   ├── french.ts       Logique FR — ET, VINGTS, CENTS, MILLE
│   ├── english.ts      Logique EN — AND, hyphens, no plural multipliers
│   └── index.ts        Interface unifiée convert()
├── routes/
│   └── convert.ts      Endpoints REST + JSDoc OpenAPI
├── middleware/
│   ├── validate.ts     Validation Zod (body + query params)
│   └── errorHandler.ts Gestion erreurs globale
├── swagger.ts          Configuration OpenAPI 3.0
└── app.ts              Express, middlewares, démarrage
tests/
├── core.test.ts        Tests logique pure (Jest)
└── api.test.ts         Tests endpoints HTTP (Supertest)
```

---

## Limites

| Critère | Valeur |
|---|---|
| Montant maximum | 999 999 999 999 |
| Décimales | 0 à 2 |
| Rate limit | 200 req / 15 min / IP |
| Valeurs négatives | Converties en `Abs()` automatiquement |

---

## Auteur

**Justin FARALAHY**
- 🏢 [MAAS — Managn'Asa](https://managnasa.co) · Nosy Be, Madagascar
- 📊 [Karamako.mg](https://karamako.mg)

---

## Licence

[MIT](LICENSE) — libre d'utilisation, y compris commerciale.
