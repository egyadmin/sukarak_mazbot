import { spawn } from 'child_process';
import path from 'path';

// Run start.sh
const startScript = path.resolve(process.cwd(), 'start.sh');
const child = spawn('bash', [startScript], { stdio: 'inherit' });

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
