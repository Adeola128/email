import { execSync } from 'child_process';

console.log('Installing dependencies with pnpm...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
