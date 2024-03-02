const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { fetchSubjects, updateAllCamerasStates, fetchUsers, createSubject, deleteSubject, createAlert} = require('./src/utils/api');
const { sendEmailAlert } = require('./src/utils/sendEmail');
const { deleteSubjectFile, writeSubjectEncodingToFile, writeSubjectImageToFile } = require('./src/utils/fileOperations')

let mainWindow;

// Function to create the main window
function createMainWindow() {
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
      ? 'http://localhost:8080' // Development server URL
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize the app
app.whenReady().then(async () => {
  try {
    // Fetch subjects data from the API
    const subjects = await fetchSubjects();
    
    // Write subjects data to the filesystem
    subjects.forEach(subject => {
      writeSubjectEncodingToFile(subject);
    });
    
    // Set all cameras' state to disabled
    await updateAllCamerasStates(false);
    
    // Create the main window
    createMainWindow();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// IPC event handler to add a new subject
ipcMain.handle('add-subject', async (event, newSubject) => {
  return new Promise((resolve, reject) => {
    let createdSubject;

    try {
      // Handle the script output and create a file
      const spawn = require('child_process').spawn;
      const pythonScriptPath = path.join(__dirname, 'python', 'add_subject.py');
      const pythonArgs = ['-u', pythonScriptPath, '--image-path', newSubject.imagePath];
      console.log('Python Args:', pythonArgs);
      const pythonProcess = spawn('python3', pythonArgs);

      let scriptOutput = '';

      // Listen for data from the Python script's stdout
      pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
      });

      // Handle script exit
      pythonProcess.on('close', async (code) => {
        if (code === 0) {
          // Parse the script output to get subject name and encodings
          const subjectEncoding = JSON.parse(scriptOutput);

          // Create the subject
          createdSubject = await createSubject({
            name: newSubject.name,
            description: newSubject.description,
            faceEncoding: subjectEncoding.encoding,
          });

          // Write subject encoding data to file
          writeSubjectEncodingToFile(createdSubject);
          
          console.log('Subject created:', createdSubject);
          
          resolve(createdSubject); // Resolve the promise with the createdSubject
        } else {
          console.error('Python script execution failed with code:', code);
          reject(new Error(`Python script execution failed with code: ${code}`));
        }
      });

      // Handle errors
      pythonProcess.on('error', (err) => {
        console.error('Error executing Python script:', err);
        reject(err);
      });

    } catch (error) {
      console.error('Error adding subject:', error);
      reject(error);
    }
  });
});


// IPC event handler to upload an image
gipcMain.handle('upload-image', async (event, base64image, subjectName) => {
  const imagePath = await writeSubjectImageToFile(base64image, subjectName);
  return imagePath;
});

// Define an object to store started cameras and their corresponding Python processes
const startedCameras = {};

// IPC event handler to start a camera
ipcMain.on('start-camera', (event, camera) => {
  // Process the new camera data as needed
  const spawn = require('child_process').spawn;
  const pythonScriptPath = path.join(__dirname, 'python', 'start_camera.py');
  const pythonArgs = ['-u', pythonScriptPath, '--camera-name', camera.name];

  if (camera.rtspUrl) {
    pythonArgs.push('--rtsp-url', camera.rtspUrl);
  }
  
 // Execute the Python script
  const pythonProcess = execFile('python3', pythonArgs);

  // Store the Python process object in the map
  startedCameras[camera.name] = pythonProcess;

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
    delete startedCameras[camera.name]; // Remove the camera from the map when its process exits
  });
  
  pythonProcess.on('exit', function (code) {
    console.error('Python script exited with code:', code);
    delete startedCameras[camera.name]; // Remove the camera from the map when its process exits
    mainWindow.webContents.send('camera-stopped', camera);    
  });  
});

// IPC event handler to stop a camera
ipcMain.handle('stop-camera', async (event, cameraName) => {
  // Check if the camera is currently running
  if (startedCameras[cameraName]) {
    // Kill the Python process associated with the camera name
    startedCameras[cameraName].kill();
    console.log(`Stopped camera: ${cameraName}`);
    return true; // Return true to indicate success
  } else {
    console.log(`Camera ${cameraName} is not running`);
    return false; // Return false to indicate the camera was not running
  }
});

// IPC event handler to delete a subject
ipcMain.handle('delete-subject', async (event, subject) => {
  // Delete the subject from the database and delete its file
  await deleteSubject(subject);
  deleteSubjectFile(subject.name);
});

// Event handler for app activate event
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});