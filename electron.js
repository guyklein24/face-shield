const { app, BrowserWindow, ipcMain } = require('electron');
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

// IPC event handler to start a camera
ipcMain.on('start-camera', (event, camera) => {
  // Process the new camera data as needed
  const spawn = require('child_process').spawn;
  const pythonScriptPath = path.join(__dirname, 'python', 'start_camera.py');
  const pythonArgs = ['-u', pythonScriptPath, '--camera-name', camera.name];

  if (camera.rtspUrl) {
    pythonArgs.push('--rtsp-url', camera.rtspUrl);
  }
  
  const pythonProcess = spawn('python3', pythonArgs);

  // Event listeners for Python process
  pythonProcess.stdout.on('data', async function(data) {
    const alert = JSON.parse(data.toString());

    console.log('Received alert:', alert);
    mainWindow.webContents.send('send-alert', alert)

    const users = await fetchUsers();
    const recipients = users.filter(user => user.subscribeAlerts).map(user => user.email);

    // Send email when alert is received
    sendEmailAlert(alert, recipients);

    // Create alert in the API
    await createAlert(alert)
  });

  pythonProcess.on('error', function (err) {
    console.error('Error executing Python script:', err);
  });
  
  pythonProcess.on('exit', function (code) {
    if (code == 1) {
      pythonProcess.stderr.on('data', data => {
        console.log(data.toString);
      })
    }
    mainWindow.webContents.send('camera-stopped', camera)
  });  
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});