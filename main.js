// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')

let mainWindow
// 01、创建一个窗口
// 02：让窗口加载一个界面，这个界面用web 技术实现，这个界面运行在渲染进程中
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  handleIPC()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function handleIPC() {
  ipcMain.handle('work-notification', async function () {
    const res = await new Promise((resolve, reject) => {
      const notification = new Notification({
        title: '任务结束',
        body: '是否开始休息',
        actions: [{ text: '开始休息', type: 'button' }],
        closeButtonText: '继续工作',
      })

      notification.show()
      notification.on('action', () => {
        resolve('rest')
      })
      notification.on('close', () => {
        resolve('work')
      })
    })
    return res
  })
}

app.on('ready', () => {
  createWindow()
})
