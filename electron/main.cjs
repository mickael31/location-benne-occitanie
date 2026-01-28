const { app, BrowserWindow, dialog, shell } = require('electron');
const fs = require('fs');
const http = require('http');
const path = require('path');

const isDev = !app.isPackaged;

const PROD_PORT = 4173;

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'text/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json' || ext === '.config') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.ico') return 'image/x-icon';
  return 'application/octet-stream';
}

function startProdServer() {
  const distPath = path.resolve(app.getAppPath(), 'dist');

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://localhost');
        let pathname = decodeURIComponent(url.pathname || '/');
        if (pathname === '/') pathname = '/index.html';

        const requested = path.resolve(distPath, pathname.replace(/^\/+/, ''));
        const safeRequested = requested.startsWith(distPath) ? requested : path.join(distPath, 'index.html');

        const filePath = fs.existsSync(safeRequested) && fs.statSync(safeRequested).isFile()
          ? safeRequested
          : path.join(distPath, 'index.html');

        res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } catch {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal error');
      }
    });

    server.on('error', reject);
    server.listen(PROD_PORT, '127.0.0.1', () => resolve(server));
  });
}

function createWindow(baseUrl) {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    const allowed = isDev
      ? url.startsWith('http://localhost:3000')
      : url.startsWith(`http://localhost:${PROD_PORT}`) || url.startsWith(`http://127.0.0.1:${PROD_PORT}`);
    if (allowed) return;
    event.preventDefault();
    shell.openExternal(url);
  });

  win.loadURL(baseUrl);

  return win;
}

let prodServer = null;

app.whenReady().then(async () => {
  if (isDev) {
    createWindow('http://localhost:3000/#/');
    return;
  }

  try {
    prodServer = await startProdServer();
    createWindow(`http://localhost:${PROD_PORT}/#/`);
  } catch (err) {
    dialog.showErrorBox(
      'Impossible de lancer le site en local',
      `Le port ${PROD_PORT} est peut-être déjà utilisé.\n\nDétail: ${err instanceof Error ? err.message : String(err)}`,
    );
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const url = isDev ? 'http://localhost:3000/#/' : `http://localhost:${PROD_PORT}/#/`;
      createWindow(url);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (prodServer) {
    try {
      prodServer.close();
    } catch {
      // ignore
    }
  }
});
