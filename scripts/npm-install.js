import { execSync } from 'child_process';

console.log('Installing dependencies with npm...');

try {
  execSync('npm install', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
