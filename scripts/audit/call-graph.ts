import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const ROOT = path.join(__dirname, '..', '..');
const SOURCE_DIR = path.join(ROOT, 'utils', 'unvalidatedUtils');

interface CallSite {
  callee: string;
  module: string;
  line: number;
  column: number;
}

interface Calls {
  source: string;
  calls: CallSite[];
  httpEntry?: boolean;
  reachableEndpoints?: string[];
}

const results: Calls[] = [];

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      results.push(analyzeFile(full));
    }
  }
}

function resolveModule(from: string, spec: string): string {
  if (spec.startsWith('.')) {
    const resolved = path.resolve(path.dirname(from), spec);
    return path.relative(ROOT, resolved);
  }
  return spec;
}

function analyzeFile(filePath: string): Calls {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const importMap = new Map<string, string>();
  const calls: CallSite[] = [];
  const isHttpEntry = filePath.includes('/pages/api/') || filePath.includes('/app/api/');

  sourceFile.forEachChild(function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const spec = (node.moduleSpecifier as ts.StringLiteral).text;
      const resolved = resolveModule(filePath, spec);
      if (node.importClause) {
        const { name, namedBindings } = node.importClause;
        if (name) {
          importMap.set(name.getText(), resolved);
        }
        if (namedBindings && ts.isNamedImports(namedBindings)) {
          for (const e of namedBindings.elements) {
            const id = e.name.getText();
            importMap.set(id, resolved);
          }
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      if (ts.isIdentifier(expr)) {
        const mod = importMap.get(expr.text);
        if (mod) {
          const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
          calls.push({
            callee: expr.text,
            module: mod,
            line: line + 1,
            column: character + 1,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  });

  return {
    source: path.relative(ROOT, filePath),
    calls,
    httpEntry: isHttpEntry || undefined,
  };
}

walk(SOURCE_DIR);
// compute reachable API endpoints for each file
const adjacency = new Map<string, Set<string>>();
const apiFiles = new Set<string>();

for (const res of results) {
  adjacency.set(res.source, new Set(res.calls.map(c => c.module)));
  if (res.httpEntry) apiFiles.add(res.source);
}

function collect(start: string, visited: Set<string> = new Set()): Set<string> {
  if (visited.has(start)) return new Set();
  visited.add(start);
  const out = new Set<string>();
  if (apiFiles.has(start)) out.add(start);
  const mods = adjacency.get(start);
  if (mods) {
    for (const m of mods) {
      if (apiFiles.has(m)) out.add(m);
      else collect(m, visited).forEach(e => out.add(e));
    }
  }
  return out;
}

for (const res of results) {
  res.reachableEndpoints = Array.from(collect(res.source));
}
fs.writeFileSync(path.join(ROOT, 'call-graph.json'), JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} entries to call-graph.json`);

// --- DOT FILE GENERATION ---
const dotLines = [
  'digraph CallGraph {',
  '  node [shape=box fontname="Helvetica"]'
];

for (const result of results) {
  const from = result.source;
  for (const call of result.calls) {
    dotLines.push(`  "${from}" -> "${call.module}" [label="${call.callee}@${call.line}:${call.column}"]`);
  }
}

dotLines.push('}');
fs.writeFileSync(path.join(ROOT, 'call-graph.dot'), dotLines.join('\n'));
console.log(`Wrote call-graph.dot for visualization.`);

// --- HTML VISUALIZATION (MERMAID) ---
const mermaidLines = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '  <meta charset="UTF-8">',
  '  <title>Call Graph</title>',
  '  <script type="module" src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"></script>',
  '  <script>mermaid.initialize({ startOnLoad: true });</script>',
  '</head>',
  '<body>',
  '  <pre class="mermaid">',
  'graph TD'
];

for (const result of results) {
  const from = result.source;
  for (const call of result.calls) {
    mermaidLines.push(`  ${from.replace(/\W/g, '_')}-->${call.module.replace(/\W/g, '_')}[${call.callee}@${call.line}]`);
  }
}

mermaidLines.push('  </pre>');
mermaidLines.push('</body>');
mermaidLines.push('</html>');

fs.writeFileSync(path.join(ROOT, 'call-graph.html'), mermaidLines.join('\n'));
console.log('Wrote call-graph.html for web visualization.');