import { Hono } from 'hono';
import { injectable } from 'tsyringe';
import { Buffer } from 'buffer';

@injectable()
export class AIController {
  constructor() {}
  controller = new Hono<{ Bindings: Env }>();

  routes() {
    return this.controller
      .post('/', async (c) => {
        const form = await c.req.formData();
        const file = form.get('file');
        if (!file || typeof file !== 'object' || !file.arrayBuffer)
          return c.json({ error: 'file required' }, 400);

        const buf = await file.arrayBuffer();
        const b64 = Buffer.from(buf).toString('base64');
        const dataUrl = `data:${file.type || 'image/jpeg'};base64,${b64}`;

        const messages = [
          { role: 'system', content: 'You are an expert food recognizer.' },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '画像に写っている「食品・料理」の一般名を日本語で出力。曖昧なら材料名レベルで。食品でないものは除外し、重複をまとめてください。',
              },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ];

        const response = await c.env.AI.run(
          '@cf/meta/llama-3.2-11b-vision-instruct',
          {
            messages,
            temperature: 0.1,
            max_tokens: 160,
            // ★ JSON Mode（Workers AI準拠）
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'food_detection',
                schema: {
                  type: 'object',
                  properties: {
                    foods: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' }, // 食品名（日本語）
                          confidence: { type: 'number' }, // 0-1
                        },
                        required: ['name'],
                      },
                    },
                  },
                  required: ['foods'],
                  additionalProperties: false,
                },
                strict: true,
              },
            },
          }
        );

        return c.json(response);
      })
      .get('/', (c) => {
        return c.json({ message: 'AI Route' });
      });
  }
}
