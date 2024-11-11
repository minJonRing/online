// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 渲染器-主进程 全屏
  ExitFullScreen: (key) => {
    ipcRenderer.invoke('ExitFullScreen', key)
  },
})
