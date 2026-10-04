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
const { catalog, sixFlavorGift, fixedSetVariants } = catalogModule;
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
  if (!(
    /^https:\/\/yamadamochi\.thebase\.in\/items\/\d+$/.test(product.baseUrl) ||
    (['six-flavor-gift', 'twelve-set'].includes(product.slug) &&
      product.baseUrl === 'https://yamadamochi.thebase.in/')
  )) {
    errors.push(`${product.slug}: invalid BASE URL`);
  }
}

const individualUrls = (catalog ?? [])
  .filter((item) => /\/items\//.test(item.baseUrl))
  .map((item) => item.baseUrl);
if (new Set(individualUrls).size !== individualUrls.length) {
  errors.push('individual catalogue BASE URLs must be unique; fixed sets may use the fallback');
}

if (fixedSetVariants.length !== 8 || new Set(fixedSetVariants.map((item) => item.id)).size !== 8) {
  errors.push('fixed sets must contain exactly 8 distinct delivery/packaging variants');
}
for (const item of fixedSetVariants) {
  const expected =
    item.bags === 6
      ? item.purpose === 'ご自宅用'
        ? '2,640円（税込）'
        : '2,840円（税込）'
      : item.purpose === 'ご自宅用'
        ? '5,280円（税込）'
        : '5,480円（税込）';
  if (item.price !== expected) errors.push(`${item.id}: incorrect price`);
  if (!(
    item.baseUrl === 'https://yamadamochi.thebase.in/' ||
    /^https:\/\/yamadamochi\.thebase\.in\/items\/\d+$/.test(item.baseUrl)
  ))
    errors.push(
      `${item.id}: use the shop fallback or a verified individual BASE URL; never guess an ID`,
    );
}

const variantIndividualUrls = fixedSetVariants
  .filter((item) => /\/items\//.test(item.baseUrl))
  .map((item) => item.baseUrl);
if (new Set(variantIndividualUrls).size !== variantIndividualUrls.length) {
  errors.push('resolved fixed-set variant URLs must be unique');
}

const officialGift = {
  name: '飛騨高山 朝市の切り餅 6種類食べ比べセット',
  price: '2,840円（税込）',
  content: '200g × 6袋',
  packaging: '贈りもの用ギフト箱・熨斗対応',
};
for (const [field, expected] of Object.entries(officialGift)) {
  if (sixFlavorGift?.[field] !== expected)
    errors.push(`six-flavor-gift.${field} must be "${expected}"`);
}

const ignored = new Set([catalogPath, path.join(root, 'scripts/check-catalog.mjs')]);
const forbidden = [
  { pattern: /(?:5,960|5960)/, message: 'retired fixed 12-bag price remains' },
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
  'check:catalog passed: 6 singles, 3 gift records and 8 fixed-set variants: current prices and BASE fallbacks are consistent.',
);
