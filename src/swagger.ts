import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'MONENLET API',
      version:     '1.0.0',
      description: `
## Montant en Lettres — API REST

Convertit un montant numérique en lettres dans trois langues :
- 🇲🇬 **Malgache** (\`mg\`) — lecture ascendante, connecteurs *amby* / *sy* / *faingo*
- 🇫🇷 **Français** (\`fr\`) — normes bancaires (ET, QUATRE-VINGTS, CENTS, MILLE)
- 🇬🇧 **Anglais** (\`en\`) — British banking standard (AND, hyphens, no plural on multipliers)

### Utilisation rapide
\`\`\`
GET /convert?amount=1352689.60&lang=mg
POST /convert  →  { "amount": 1250.25, "lang": "fr" }
\`\`\`

### Auteur
**PAL'DAH Jusfas** — [Palongo](https://palongo.co)
      `,
      contact: {
        name:  'Palongo',
        url:   'https://palongo.co',
        email: 'palongo.ddf@gmail.com',
      },
      license: {
        name: 'MIT',
        url:  'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url:         process.env.API_URL ?? 'http://localhost:3000',
        description: 'Serveur courant',
      },
    ],
    components: {
      schemas: {
        ConvertRequest: {
          type:     'object',
          required: ['amount', 'lang'],
          properties: {
            amount: {
              type:        'number',
              description: 'Montant à convertir (max 999 999 999 999)',
              example:     1352689.60,
            },
            lang: {
              type:        'string',
              enum:        ['mg', 'fr', 'en'],
              description: 'Code langue : mg (Malgache), fr (Français), en (Anglais)',
              example:     'mg',
            },
            currency: {
              type:        'string',
              description: 'Devise (défaut : "Ariary" pour mg, "ARIARY" pour fr/en)',
              example:     'Ariary',
            },
            decimals: {
              type:        'integer',
              minimum:     0,
              maximum:     2,
              default:     2,
              description: 'Nombre de décimales (0 = pas de centimes)',
              example:     2,
            },
          },
        },
        ConvertResponse: {
          type:       'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type:       'object',
              properties: {
                amount:          { type: 'number',  example: 1352689.60 },
                lang:            { type: 'string',  example: 'mg' },
                lang_label:      { type: 'string',  example: 'Malgache' },
                currency:        { type: 'string',  example: 'Ariary' },
                decimals:        { type: 'integer', example: 2 },
                result:          {
                  type:    'string',
                  example: 'Sivy amby valopolo sy eninjato sy roa arivo sy dimy alina sy telo hetsy sy iray tapitrisa Ariary faingo enimpolo',
                },
                input_formatted: { type: 'string', example: '1 352 689,60' },
              },
            },
            meta: {
              type:       'object',
              properties: {
                version:         { type: 'string', example: '1.0.0' },
                supported_langs: {
                  type:  'array',
                  items: { type: 'string' },
                  example: ['mg', 'fr', 'en'],
                },
              },
            },
          },
        },
        ErrorResponse: {
          type:       'object',
          properties: {
            success: { type: 'boolean', example: false },
            error:   { type: 'string',  example: 'Validation error' },
            details: {
              type:  'array',
              items: {
                type:       'object',
                properties: {
                  field:   { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Conversion', description: 'Endpoints de conversion montant → lettres' },
      { name: 'System',     description: 'Health check et informations système' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
