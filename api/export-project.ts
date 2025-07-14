import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="fish-donation-logistics-app.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => { throw err; });
    archive.pipe(res);
    const projectRoot = process.cwd();
    archive.directory(path.join(projectRoot, 'client'), 'client');
    archive.directory(path.join(projectRoot, 'server'), 'server');
    archive.directory(path.join(projectRoot, 'shared'), 'shared');
    archive.file(path.join(projectRoot, 'package.json'), { name: 'package.json' });
    archive.file(path.join(projectRoot, 'tsconfig.json'), { name: 'tsconfig.json' });
    archive.file(path.join(projectRoot, 'vite.config.ts'), { name: 'vite.config.ts' });
    archive.file(path.join(projectRoot, 'tailwind.config.ts'), { name: 'tailwind.config.ts' });
    archive.file(path.join(projectRoot, 'postcss.config.js'), { name: 'postcss.config.js' });
    archive.file(path.join(projectRoot, 'components.json'), { name: 'components.json' });
    archive.file(path.join(projectRoot, 'drizzle.config.ts'), { name: 'drizzle.config.ts' });
    archive.file(path.join(projectRoot, 'replit.md'), { name: 'replit.md' });
    const readmeContent = `# Fish Donation Logistics Platform\n\n## Overview\nThis is a full-stack React application that connects fishing communities worldwide through a fish donation platform. The system helps reduce food waste by matching surplus fish donations with communities in need.\n...\nBuilt with ❤️ for fishing communities worldwide.\n`;
    archive.append(readmeContent, { name: 'README.md' });
    await archive.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project zip file' });
  }
} 