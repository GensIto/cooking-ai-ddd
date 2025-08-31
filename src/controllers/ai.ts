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

        const foodsRes = await c.env.AI.run(
          '@cf/meta/llama-3.2-11b-vision-instruct',
          {
            messages,
            response_format: {
              type: 'json_schema',
              json_schema: {
                type: 'object',
                properties: {
                  foods: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        confidence: { type: 'number' },
                      },
                      required: ['name'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['foods'],
                additionalProperties: false,
              },
            },
          }
        );

        type FoodResponse = { foods: { name: string }[] };
        function isFoodResponse(x: unknown): x is FoodResponse {
          return (
            typeof x === 'object' &&
            x !== null &&
            Array.isArray((x as FoodResponse).foods) &&
            (x as FoodResponse).foods.every((f) => typeof f?.name === 'string')
          );
        }

        const raw =
          typeof foodsRes.response === 'string'
            ? JSON.parse(foodsRes.response)
            : foodsRes.response;

        if (!isFoodResponse(raw))
          return c.json({ error: 'Invalid AI JSON' }, 400);

        const list = raw.foods.map((v) => v.name).join(', ');

        const messages2 = [
          {
            role: 'system',
            content: 'You are a Japanese cooking expert. Output JSON only.',
          },
          {
            role: 'user',
            content: [
              '以下の食材リストから日本語で家庭向けレシピを1品作成してください。',
              `食材(使用可能): ${list}`,
              `人数: ${1}人分`,
              '厳守事項:',
              '- ingredients[].name には「使用可能リスト」の食材名のみを入れること。',
              '- それ以外が必要な場合は extra_ingredients に入れること（ingredients には入れない）。',
              '- 料理名は実際に存在するものにすること。',
              '- 手順は最長8ステップ、簡潔に。主要アレルゲンを allergens に列挙。',
              '出力は必ずJSONのみ。',
            ].join('\n'),
          },
        ];

        const recipeRes = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: messages2,
          temperature: 0.3,
          max_tokens: 700,
          // ★ CloudflareのJSON Mode（json_schema直下にスキーマを記述）
          response_format: {
            type: 'json_schema',
            json_schema: {
              type: 'object',
              required: [
                'title',
                'servings',
                'ingredients',
                'extra_ingredients',
                'steps',
                'allergens',
              ],
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                servings: { type: 'integer' },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['name'],
                    additionalProperties: false,
                    properties: {
                      name: { type: 'string' },
                      quantity: { type: 'number' },
                      unit: { type: 'string' },
                    },
                  },
                },
                extra_ingredients: { type: 'array', items: { type: 'string' } }, // 他に必要な材料
                steps: {
                  type: 'array',
                  items: { type: 'string' },
                  maxItems: 8,
                }, // 料理のstep
                allergens: { type: 'array', items: { type: 'string' } }, // アレルギーの注意
              },
            },
          },
        });

        return c.json(recipeRes);
      })
      .get('/', (c) => {
        return c.json({ message: 'AI Route' });
      });
  }
}
