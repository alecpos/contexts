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
  dependsOn: string[];
  importedBy: string[];
}

const results: Result[] = [];
const dependencyMap = new Map<string, string[]>();

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
  const dependsOn: string[] = [];

  sourceFile.forEachChild(node => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.startsWith('.')
    ) {
      const spec = node.moduleSpecifier.text;
      const base = path.resolve(path.dirname(filePath), spec);
      const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')];
      const target = candidates.find(c => fs.existsSync(c));
      if (target && target.startsWith(SOURCE_DIR)) {
        dependsOn.push(path.relative(ROOT, target));
      }
    }
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

  dependencyMap.set(relativePath, dependsOn);

  return { source: relativePath, exports: exported, usedIn, dependsOn, importedBy: [] };
}

walk(SOURCE_DIR);
for (const result of results) {
  const dependents: string[] = [];
  for (const [file, deps] of dependencyMap.entries()) {
    if (deps.includes(result.source)) {
      dependents.push(file);
    }
  }
  result.importedBy = dependents;
}
fs.writeFileSync(path.join(ROOT, 'migration-plan.json'), JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} entries to migration-plan.json`);
