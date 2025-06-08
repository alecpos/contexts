import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const callGraphPath = path.join(ROOT, 'call-graph.json');
const migrationPlanPath = path.join(ROOT, 'migration-plan.json');
const linkCheckPath = path.join(ROOT, 'link-check-results.json');

interface CallGraph {
  source: string;
  calls: Array<{ callee: string; module: string; line: number; column: number }>;
  httpEntry?: boolean;
}

interface ExportDetail {
  name: string;
  kind: 'function' | 'variable';
  type?: string;
}

interface AuditExport {
  source: string;
  exports: ExportDetail[];
  usedIn: string[];
}

interface LinkResult {
  file: string;
  line: number;
  url: string;
  status: number | null;
}

function load<T>(filePath: string): T[] {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Failed to load ${filePath}`);
    return [];
  }
}

const calls: CallGraph[] = load(callGraphPath);
const auditExports: AuditExport[] = load(migrationPlanPath);
const links: LinkResult[] = load(linkCheckPath);

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Audit Dashboard</title>
  <style>
    body { font-family: Arial; line-height: 1.5; margin: 2rem; }
    h2 { margin-top: 2rem; border-bottom: 1px solid #ccc; padding-bottom: 0.3rem; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f4f4f4; text-align: left; }
    .err { color: red; font-weight: bold; }
    .ok { color: green; }
    code { background: #eee; padding: 2px 5px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Audit Dashboard Report</h1>

  <h2>1. HTTP Entry Points</h2>
  <ul>
    ${calls.filter(c => c.httpEntry).map(c => `<li><code>${c.source}</code></li>`).join('\n')}
  </ul>

  ${auditExports.map(e => `
    <h3>${e.source}</h3>
    <ul>
      ${e.exports.map(x => `<li><code>${x.name}</code> (${x.kind}${x.type ? `: ${x.type}` : ''})</li>`).join('')}
    </ul>
    <p><strong>Used in:</strong> ${e.usedIn.length > 0 ? e.usedIn.join(', ') : '<em>Not used</em>'}</p>
  `).join('')}
  
  <h2>3. Link Check Failures</h2>
  <table>
    <thead><tr><th>Status</th><th>URL</th><th>File</th><th>Line</th></tr></thead>
    <tbody>
      ${links.map(link => `
        <tr>
          <td class="${link.status && link.status < 400 ? 'ok' : 'err'}">${link.status ?? 'ERR'}</td>
          <td><a href="${link.url}" target="_blank">${link.url}</a></td>
          <td>${link.file}</td>
          <td>${link.line}</td>
        </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'audit-dashboard.html'), html);
console.log('Wrote audit-dashboard.html');
