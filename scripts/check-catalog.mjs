import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const catalogPath = path.join(root, 'data/catalog.ts');
const source = fs.readFileSync(catalogPath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const catalogModule = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const { catalog, sixFlavorGift } = catalogModule;
const errors = [];

if (!Array.isArray(catalog) || catalog.length !== 9) {
  errors.push(`catalog must contain exactly 9 products (actual: ${catalog?.length ?? 'invalid'})`);
}

const requiredFields = [
  'name',
  'price',
  'content',
  'image',
  'baseUrl',
  'allergy',
  'shelfLife',
  'storage',
  'seo',
];
for (const product of catalog ?? []) {
  for (const field of requiredFields) {
    if (!product[field]) errors.push(`${product.slug ?? 'unknown'}: ${field} is required`);
  }
  if (!/^https:\/\/yamadamochi\.thebase\.in\/items\/\d+$/.test(product.baseUrl)) {
    errors.push(`${product.slug}: invalid BASE URL`);
  }
}

if (new Set((catalog ?? []).map((product) => product.baseUrl)).size !== 9) {
  errors.push('BASE URLs must be unique for all 9 products');
}

const officialGift = {
  name: '飛騨高山 朝市の切り餅 6種類食べ比べセット',
  price: '2,980円（税込）',
  content: '200g × 6袋',
  packaging: '贈り物用ギフトボックス入り',
  baseUrl: 'https://yamadamochi.thebase.in/items/149543143',
};
for (const [field, expected] of Object.entries(officialGift)) {
  if (sixFlavorGift?.[field] !== expected)
    errors.push(`six-flavor-gift.${field} must be "${expected}"`);
}

const ignored = new Set([catalogPath, path.join(root, 'scripts/check-catalog.mjs')]);
const forbidden = [
  { pattern: /(?:2,640|2640)/, message: 'old price 2,640 remains' },
  { pattern: /2,980円（税込）/, message: 'price must be referenced from catalog.ts' },
  {
    pattern: /https:\/\/yamadamochi\.thebase\.in\/items\/\d+/,
    message: 'BASE URL must be referenced from catalog.ts',
  },
];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(?:ts|tsx|js|jsx|mjs)$/.test(entry.name) && !ignored.has(file)) {
      const text = fs.readFileSync(file, 'utf8');
      for (const rule of forbidden) {
        if (rule.pattern.test(text)) errors.push(`${path.relative(root, file)}: ${rule.message}`);
      }
    }
  }
}
for (const directory of ['app', 'components', 'data', 'lib', 'scripts'])
  walk(path.join(root, directory));

if (errors.length) {
  console.error(`check:catalog failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  'check:catalog passed: 9 products, official gift spec, prices and BASE URLs are consistent.',
);
