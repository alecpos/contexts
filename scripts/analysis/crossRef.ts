import fs from 'fs';
import path from 'path';

interface MigrationEntry { source: string; exports?: string[] }
interface CallSite { callee: string; module: string }
interface CallEntry { source: string; calls: CallSite[]; reachableEndpoints?: string[] }

const ROOT = path.join(__dirname, '..', '..');
const docPath = path.join(ROOT, 'docs', 'b12-injection-flow.md');
const migrationPath = path.join(ROOT, 'migration-plan.json');
const callGraphPath = path.join(ROOT, 'call-graph.json');

const docText = fs.readFileSync(docPath, 'utf8');
const migration = JSON.parse(fs.readFileSync(migrationPath, 'utf8')) as MigrationEntry[];
const callGraph = JSON.parse(fs.readFileSync(callGraphPath, 'utf8')) as CallEntry[];

const functionRegex = /`([a-zA-Z0-9_]+)\(\)`/g;
const rootFunctions = new Set<string>();
let m: RegExpExecArray | null;
while ((m = functionRegex.exec(docText))) rootFunctions.add(m[1]);

const fileByFunc = new Map<string, string>();
for (const entry of migration) {
  if (!entry.exports) continue;
  for (const fn of entry.exports) if (rootFunctions.has(fn)) fileByFunc.set(fn, entry.source);
}

const graph = new Map<string, CallEntry>();
for (const entry of callGraph) graph.set(entry.source, entry);

function gatherModules(file: string, visited = new Set<string>()): Set<string> {
  if (visited.has(file)) return new Set();
  visited.add(file);
  const entry = graph.get(file);
  const out = new Set<string>();
  if (!entry) return out;
  for (const c of entry.calls) {
    out.add(c.module);
    gatherModules(c.module, visited).forEach(mod => out.add(mod));
  }
  return out;
}

const output: Record<string, string[]> = {};
for (const [fn, file] of fileByFunc.entries()) {
  output[fn] = Array.from(gatherModules(file));
}

fs.writeFileSync(path.join(ROOT, 'docs', 'b12-api-modules.json'), JSON.stringify(output, null, 2));
console.log('Wrote docs/b12-api-modules.json');
