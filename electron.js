const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000' // Development server URL
      : `file://${path.join(__dirname, '../build/index.html')}` // Build output path
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Listen for messages from the renderer process
ipcMain.on('message-from-renderer', (event, arg) => {
  console.log('Message from renderer:', arg);

  // Process the message and send a response back to the renderer
  const response = 'Message received in the main process!';
  event.sender.send('message-to-renderer', response);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
