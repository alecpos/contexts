import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const mdFiles: string[] = [];
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules') continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (entry.endsWith('.md')) mdFiles.push(full);
  }
}

walk('.');

const linkRegex = /https?:\/\/[^)"'\s]+/g;
const links = new Set<string>();
for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(linkRegex);
  if (matches) matches.forEach(l => links.add(l));
}

async function check(url: string): Promise<{url: string, status: number | null}> {
  try {
    const res = await fetch(url, {method: 'HEAD'});
    return {url, status: res.status};
  } catch {
    return {url, status: null};
  }
}

(async () => {
  const results: Array<{url: string, status: number | null}> = [];
  for (const url of links) {
    const r = await check(url);
    results.push(r);
    console.log(`${r.status ?? 'ERR'} ${url}`);
  }
})();
