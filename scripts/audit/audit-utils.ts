import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { execSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'utils', 'unvalidatedUtils');

interface ExportDetails {
  name: string;
  kind: string;
  signature?: string;
}

interface Result {
  source: string;
  exports: ExportDetails[];
  usedIn: string[];
  httpEntry?: boolean;
}

const results: Result[] = [];

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

function analyzeFile(filePath: string): Result {
  const relativePath = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const exported: ExportDetails[] = [];
  const isHttpEntry = filePath.includes('/pages/api/') || filePath.includes('/app/api/');

  sourceFile.forEachChild(node => {
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const name = node.name?.getText() || '<anonymous>';
      const typeChecker = ts.createProgram([filePath], {}).getTypeChecker();
      exported.push({
        name,
        kind: 'function',
        signature: node.getText()
      });
    }
    if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(d => {
        if (ts.isIdentifier(d.name)) {
          exported.push({
            name: d.name.getText(),
            kind: 'variable',
            signature: d.getText()
          });
        }
      });
    }
  });

  let usedIn: string[] = [];
  try {
    const grep = execSync(
      `grep -Rl "${relativePath}" --exclude-dir=node_modules --exclude-dir=.git --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx'`,
      { encoding: 'utf8' }
    );
    usedIn = grep.split('\n').filter(Boolean).map(p => path.relative(ROOT, p));
  } catch {
    usedIn = [];
  }

  return { source: relativePath, exports: exported, usedIn, httpEntry: isHttpEntry || undefined };
}

walk(SOURCE_DIR);
fs.writeFileSync(path.join(ROOT, 'migration-plan.json'), JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} entries to migration-plan.json`);