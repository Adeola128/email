import { execSync } from 'child_process';
import { chdir } from 'process';

try {
  const projectDir = '/vercel/share/v0-project';
  
  chdir(projectDir);
  console.log('[v0] Changed to directory:', process.cwd());
  
  // Run npm install with cwd option
  console.log('[v0] Running npm install...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: projectDir 
  });
  
  console.log('[v0] Dependencies installed successfully!');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error installing dependencies:', error instanceof Error ? error.message : error);
  process.exit(1);
}
