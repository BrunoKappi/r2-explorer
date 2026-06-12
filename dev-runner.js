import { spawn } from 'child_process';

console.log('Starting R2 Explorer development environment...');

// Start Vite frontend dev server
const frontend = spawn('npx vite', { shell: true, stdio: 'inherit' });

// Start Backend Express server
const backend = spawn('npx tsx backend/api/index.ts', { shell: true, stdio: 'inherit' });

const handleExit = () => {
  console.log('Stopping development servers...');
  frontend.kill();
  backend.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);
