const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  startCamera: (newCamera) => ipcRenderer.send('start-camera', newCamera),
  onSendAlert: (callback) => ipcRenderer.on('send-alert', (_event, alert) => callback(alert)),
  onCameraStopped: (callback) => ipcRenderer.on("camera-stopped", (_event, camera) => callback(camera)),
  addSubject: (newSubject) => ipcRenderer.invoke('add-subject', newSubject),
  uploadImage: (base64image, subjectName) => ipcRenderer.invoke('upload-image', base64image, subjectName),
  deleteSubject: (subject) => ipcRenderer.invoke('delete-subject', subject)
});