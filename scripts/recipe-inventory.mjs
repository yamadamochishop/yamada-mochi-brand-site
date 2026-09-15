// レシピ棚卸し表を生成する。
//
//   node --experimental-strip-types scripts/recipe-inventory.mjs > docs/recipes/recipe-inventory.md
//   pnpm exec prettier --write docs/recipes/recipe-inventory.md
//
// `data/recipes.ts` を正本として、slug / title / 材料 / 手順数 / 商品 / タグ / 画像有無 /
// 人気指標の有無を1行ずつ並べる。Search Console データを転記する前後で見比べる用途。
import { getRecipeInventory } from '../lib/recipe-page.ts';

const rows = getRecipeInventory();
const dash = '—';
const cell = (value) => String(value).replace(/\|/g, '\\|');

const lines = [
  '# レシピ棚卸し',
  '',
  '`data/recipes.ts` から `scripts/recipe-inventory.mjs` で生成。手で編集しない。',
  '',
  `生成対象: ${rows.length}件（published ${rows.filter((r) => r.status === 'published').length}件）`,
  '',
  '| # | slug | title | 商品 | category | tags | 材料数 | 手順数 | 時間 | 難易度 | 人数 | 画像 | featured | popularity.score | publishedAt | status |',
  '| - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |',
  ...rows.map(
    (row, index) =>
      [
        index + 1,
        `\`${row.slug}\``,
        cell(row.title),
        row.relatedProductIds.join(', '),
        row.category,
        row.tags.join(', ') || dash,
        row.ingredients.length,
        row.stepCount,
        row.cookingTimeMinutes !== undefined ? `${row.cookingTimeMinutes}分` : dash,
        row.difficulty ?? dash,
        row.servings ?? dash,
        row.hasImage ? 'あり' : 'なし',
        row.featured ? 'yes' : dash,
        row.popularityScore ?? dash,
        row.publishedAt ?? dash,
        row.status,
      ]
        .map((v) => `| ${v} `)
        .join('') + '|',
  ),
  '',
  '## 説明',
  '',
  ...rows.map((row) => `- \`${row.slug}\`: ${cell(row.description)}`),
  '',
  '## 材料',
  '',
  ...rows.map((row) => `- \`${row.slug}\`: ${row.ingredients.join(' / ')}`),
  '',
];

process.stdout.write(lines.join('\n'));
