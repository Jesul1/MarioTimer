const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  resetTime: (callback) => ipcRenderer.on('reset-time', (_event, game) => callback(game)),
  resetTimes: (callback) => ipcRenderer.on('reset-times', (_event) => callback()),
  saveTimes: (callback) => ipcRenderer.on('save-times', (_event, close) => callback(close)),
  closeApp: () => ipcRenderer.send('close-app'),
})