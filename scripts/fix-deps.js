import { execSync } from 'child_process';
import { chdir } from 'process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const projectDir = dirname(__dirname);
  
  chdir(projectDir);
  console.log('[v0] Current directory:', process.cwd());
  
  // Run npm install
  console.log('[v0] Running npm install...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('[v0] Dependencies installed successfully!');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error installing dependencies:', error instanceof Error ? error.message : error);
  process.exit(1);
}
