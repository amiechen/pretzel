const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')
const url = require('url')
const assetsDirectory = path.join(__dirname, 'assets')

// global references
let tray
let win

function toggleWindow () {
  if (win.isVisible()) {
    win.hide()
  } else {
    win.show()
    win.focus()
  }
}

function createTray () {
  tray = new Tray(path.join(assetsDirectory, 'dot.png'))
  tray.setTitle('hi')
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()
    win.openDevTools({mode: 'detach'})

    // Show devtools when command clicked
    // if (win.isVisible() && process.defaultApp && event.metaKey) {
    // }
  })
}

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide
    }
  })
}

app.dock.hide()

// called when Electron has finished initialization and is ready to create browser windows.
app.on('ready', () => {
  createTray()
})

app.on('window-all-closed', () => {
  app.quit()
})