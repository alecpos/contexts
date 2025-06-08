import fs from 'fs';
import path from 'path';

// Resolve project root two levels up from this file
const ROOT = path.join(__dirname, '..', '..');
const callGraphPath = path.join(ROOT, 'call-graph.json');

interface GraphEntry {
  source: string;
  calls: Record<string, string[]>;
}

let graphData: GraphEntry[] = [];
try {
  graphData = JSON.parse(fs.readFileSync(callGraphPath, 'utf8')) as GraphEntry[];
} catch {
  console.error('call-graph.json not found. Run call-graph.ts first.');
  process.exit(1);
}

const adjacency = new Map<string, Set<string>>();
const endpoints = new Set<string>();

for (const entry of graphData) {
  const modules = new Set<string>(Object.keys(entry.calls));
  adjacency.set(entry.source, modules);
  if (entry.source.includes('/pages/api/') || entry.source.includes('/app/api/')) {
    endpoints.add(entry.source);
  }
}

function trace(start: string, visited: Set<string> = new Set()): Set<string> {
  if (visited.has(start)) return new Set();
  visited.add(start);
  const out = new Set<string>();

  if (endpoints.has(start)) out.add(start);

  const calls = adjacency.get(start);
  if (calls) {
    for (const mod of calls) {
      if (endpoints.has(mod)) {
        out.add(mod);
      } else {
        for (const ep of trace(mod, visited)) out.add(ep);
      }
    }
  }
  return out;
}

const traces: Record<string, string[]> = {};
for (const file of adjacency.keys()) {
  traces[file] = Array.from(trace(file));
}

fs.writeFileSync(path.join(ROOT, 'endpoint-trace.json'), JSON.stringify(traces, null, 2));
console.log('Wrote endpoint-trace.json');
