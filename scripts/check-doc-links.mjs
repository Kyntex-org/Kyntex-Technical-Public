import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', 'build', 'node_modules']);
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    excluded.has(entry.name) ? [] : entry.isDirectory()
      ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

const problems = [];
let checked = 0;
for (const file of files(root).filter(name => name.endsWith('.md'))) {
  const source = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of source.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    let href = match[1].trim();
    if (href.startsWith('<') && href.endsWith('>')) href = href.slice(1, -1);
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href) || href.startsWith('#')) continue;
    href = decodeURIComponent(href.split('#')[0]);
    if (!href) continue;
    checked++;
    const resolved = path.resolve(path.dirname(file), href);
    const relative = path.relative(root, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(resolved)) {
      problems.push(`${path.relative(root, file)} -> ${href}`);
    }
  }
}
if (problems.length) {
  console.error(`Broken or out-of-repository documentation links:\n${problems.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checked} relative Markdown file/image links resolve.`);
}
