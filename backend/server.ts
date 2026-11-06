import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { app, initializeBackend } from './app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  await initializeBackend();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, '../frontend/vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in development mode');
  } else {
    app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] HRM Full Stack Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[Server] Fatal startup error:', error);
});
