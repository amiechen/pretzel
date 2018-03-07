const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");
const url = require("url");
const Positioner = require("electron-positioner");
const assetsDirectory = path.join(__dirname, "assets");

function toggleWindow(win) {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
    win.focus();
  }
}

app.dock.hide();

// called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", () => {
  const tray = new Tray(path.join(assetsDirectory, "dot.png"));
  const win = new BrowserWindow({
    width: 250,
    height: 300,
    frame: false,
    resizable: false,
    movable: false
  });
  const positioner = new Positioner(win);
  const trayBounds = tray.getBounds();
  const winPosition = positioner.calculate("trayCenter", trayBounds);

  win.setPosition(winPosition.x, winPosition.y);

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  tray.on("click", function(event) {
    toggleWindow(win);
    //win.openDevTools({ mode: "detach" });
  });

  win.on("show", () => {
    tray.setHighlightMode("always");
  });

  win.on("hide", () => {
    tray.setHighlightMode("never");
  });

  win.on("blur", () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide;
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
