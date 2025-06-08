import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'utils', 'unvalidatedUtils');

interface Calls {
  source: string;
  calls: Record<string, string[]>;
}

const results: Calls[] = [];

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.ts')) {
      results.push(analyzeFile(full));
    }
  }
}

function resolveModule(from: string, spec: string): string {
  if (spec.startsWith('.')) {
    const resolved = path.resolve(path.dirname(from), spec);
    // normalize without extension
    return path.relative(ROOT, resolved);
  }
  return spec;
}

function analyzeFile(filePath: string): Calls {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const importMap = new Map<string, string>();
  const calls: Record<string, Set<string>> = {};

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
          if (!calls[mod]) calls[mod] = new Set();
          calls[mod].add(expr.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  });

  const callRecord: Record<string, string[]> = {};
  for (const [mod, set] of Object.entries(calls)) {
    callRecord[mod] = Array.from(set).sort();
  }

  return { source: path.relative(ROOT, filePath), calls: callRecord };
}

walk(SOURCE_DIR);
fs.writeFileSync(path.join(ROOT, 'call-graph.json'), JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} entries to call-graph.json`);
