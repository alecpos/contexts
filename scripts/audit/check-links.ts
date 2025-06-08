import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

interface LinkRecord {
  file: string;
  line: number;
  url: string;
}

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
const links: LinkRecord[] = [];

for (const file of mdFiles) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(linkRegex);
    if (matches) {
      matches.forEach(url => {
        links.push({ file, line: idx + 1, url });
      });
    }
  });
}

async function check(url: string): Promise<{ url: string; status: number | null }> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { url, status: res.status };
  } catch {
    return { url, status: null };
  }
}

(async () => {
  const results: Array<{ file: string; line: number; url: string; status: number | null }> = [];

  const checks = links.map(async (link) => {
    const { url, file, line } = link;
    const { status } = await check(url);
    results.push({ file, line, url, status });
    console.log(`${status ?? 'ERR'} ${url} (${file}:${line})`);
  });

  await Promise.all(checks);
  fs.writeFileSync('link-check-results.json', JSON.stringify(results, null, 2));
})();
