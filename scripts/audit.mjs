// node scripts/audit.mjs — the site has no styling of its own. Fails on:
//   - any stylesheet in the repository (styles come only from the brand-codex module)
//   - style attributes in layouts/ or content/
//   - raw colours, or numbers with a length or time unit, in layouts/ or content/ (code samples included)
// Zero is allowed (0px is not a size). Values that reach the page from brand-codex are checked by its own audit.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['.git', 'public', 'resources', 'node_modules', '.hugo_build.lock']);
const RAW_COLOR = /(?<![\w&/.-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/g;
const RAW_UNIT = /(?<![\w.#-])-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|ch|ex|vw|vh|vmin|vmax|svh|dvh|lvh|cqi|cqw|pt|pc|cm|mm|in|ms|s)\b/g;
const STYLE_ATTR = /\sstyle\s*=/g;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p); else yield p;
  }
}

const problems = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (['.css', '.scss', '.sass', '.less'].includes(extname(file))) problems.push(`${rel}: stylesheet in the site repository; styles belong in brand-codex`);
}
for (const dir of ['layouts', 'content']) {
  for (const file of walk(join(ROOT, dir))) {
    if (!['.html', '.md', '.txt', '.xml', '.json'].includes(extname(file))) continue;
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const re of [STYLE_ATTR, RAW_COLOR, RAW_UNIT]) {
        for (const m of line.matchAll(re)) {
          if (re === RAW_UNIT && /^-?0+(?:\.0+)?[a-z]+$/.test(m[0])) continue;
          const what = re === STYLE_ATTR ? 'style attribute' : re === RAW_COLOR ? 'raw colour' : 'raw size or duration';
          problems.push(`${rel}:${i + 1}: ${what} "${m[0].trim()}"`);
        }
      }
    });
  }
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  console.error(`${problems.length} problem(s). Use brand-codex components and tokens instead, or propose an addition to brand-codex.`);
  process.exit(1);
}
console.log('No stylesheets, style attributes, raw colours, sizes or durations in layouts/ or content/.');
