// node scripts/audit.mjs: check this site with MotifSpec's rule checker (scripts/check.mjs in the pinned module, see
// its docs/hugo.md), so the rules always match the release in go.mod. It fails on stylesheets, style attributes, raw
// colours and units, primitive, unknown or deprecated tokens, classes and icons MotifSpec doesn't define, and "·"
// separators, in layouts/ and content/.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
let mounts;
try {
  mounts = execFileSync('hugo', ['config', 'mounts'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  console.error(`hugo config mounts failed, so the MotifSpec module couldn't be found:\n${e.stderr || e.message}`);
  process.exit(1);
}
// One JSON object per module, each starting with "{" on its own line; Hugo may print progress lines such as
// "hugo: downloading modules …" around them. MotifSpec is the module that mounts assets/motifspec (also under a local
// replacement).
const modules = mounts.split(/^(?=\{$)/m).filter((c) => c.startsWith('{')).map((c) => JSON.parse(c.slice(0, c.lastIndexOf('}') + 1)));
const motifspec = modules.find((m) => m.mounts?.some((x) => x.target === 'assets/motifspec'));
if (!motifspec) {
  console.error('MotifSpec is not among this site\'s Hugo modules (hugo config mounts).');
  process.exit(1);
}
const checker = join(motifspec.dir, 'scripts', 'check.mjs');
if (!existsSync(checker)) {
  console.error(`MotifSpec ${motifspec.version || '(local)'} has no scripts/check.mjs. It ships from v1.12.0.`);
  process.exit(1);
}
try {
  execFileSync('node', [checker, ROOT], { stdio: 'inherit' });
} catch (e) {
  process.exit(e.status ?? 1);
}
