const { app, BrowserWindow, webContents, ipcMain, screen, Menu, dialog, protocol } = require("electron");

const path = require("path");

const electronDl = require('electron-dl');
electronDl()
// const { machineId, machineIdSync } = require('node-machine-id');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// http 请求服务
import httpServe from './http/index.js'

import { checkForUpdates } from './utils/index.js'

const createWindow = () => {
  // 这个需要在app.ready触发之后使用
  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)
    callback(decodeURI(path.normalize(url)))
  })
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_VITE_DEV_SERVER_URL ? 900 : screen.getPrimaryDisplay().workAreaSize.width,
    height: MAIN_WINDOW_VITE_DEV_SERVER_URL ? 600 : screen.getPrimaryDisplay().workAreaSize.height,
    // frame: false,
    fullscreen: MAIN_WINDOW_VITE_DEV_SERVER_URL ? false : true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true
    },
    // frame: false,
    // transparent: true
  });
  // Menu.setApplicationMenu(null)
  // and load the index.html of the app.


  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }



  ipcMain.handle("ExitFullScreen", (content, value) => {
    // 发送信息
    // to do
    mainWindow.setFullScreen(true);

  });

  return mainWindow
  // Open the DevTools.
  // 全屏
  // mainWindow.maximize()
  // mainWindow.webContents.setWindowOpenHandler(details => {
  //   mainWindow.loadURL(details.url);
  // })
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", () => {
  const mainWindow = createWindow()
  httpServe({ mainWindow })
  checkForUpdates(mainWindow, BrowserWindow)
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
