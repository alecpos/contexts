import { execSync } from 'child_process';
import path from 'path';

const SCRIPTS = [
  'call-graph.ts',
  'endpoint-trace.ts',
  'audit-utils.ts',
  'check-links.ts',
  'audit-dashboard.ts'
];

const root = path.join(__dirname);
for (const script of SCRIPTS) {
  console.log(`Running ${script}...`);
  execSync(`ts-node ${path.join(root, script)}`, { stdio: 'inherit' });
}
