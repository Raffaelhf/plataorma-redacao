import { execSync } from 'node:child_process';

const isVercelBuild = process.env.VERCEL === '1';

if (isVercelBuild) {
  execSync('prisma generate', { stdio: 'inherit' });
}

execSync('next build', { stdio: 'inherit' });
