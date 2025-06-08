import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { execSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'utils', 'unvalidatedUtils');

interface Result {
  source: string;
  exports: string[];
  usedIn: string[];
}

const results: Result[] = [];

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

function analyzeFile(filePath: string): Result {
  const relativePath = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const exported: string[] = [];

  sourceFile.forEachChild(node => {
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) exported.push(node.name.getText());
    }
    if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(d => {
        if (ts.isIdentifier(d.name)) exported.push(d.name.getText());
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

  return { source: relativePath, exports: exported, usedIn };
}

walk(SOURCE_DIR);
fs.writeFileSync(path.join(ROOT, 'migration-plan.json'), JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} entries to migration-plan.json`);
