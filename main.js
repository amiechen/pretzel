const { app, Menu, Tray, BrowserWindow, globalShortcut } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const availableShortcuts = fs.readdirSync(shortcutsDirectory);
const menu = new Menu();
let currentApp;
let position;
let win;
let tray;

// setup objc bridge
objc.import("AppKit");
const { NSWorkspace, js } = objc;

function hasShortcuts() {
  let currentAppProxy = NSWorkspace.sharedWorkspace()
    .frontmostApplication()
    .localizedName();
  currentApp = js(currentAppProxy);

  // workaround for Electron stealing the app focus
  if (currentApp === "Electron") {
    return true;
  }

  return availableShortcuts.indexOf(`${currentApp}.yml`) > -1;
}

function getWindowPosition() {
  const windowBounds = win.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window right below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height);
  return { x: x, y: y };
}

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 500,
    frame: false,
    show: false
  });

  win.loadURL(
    url.format({
      pathname: path.join("file://", __dirname, "index.html")
    })
  );

  position = getWindowPosition();
  win.setPosition(position.x, position.y, false);

  win.on("show", () => {
    fs.access(
      path.join(shortcutsDirectory, `${currentApp}.yml`),
      fs.constants.R_OK,
      err => {
        if (err) {
          win.webContents.send("noShortcuts", currentApp);
        } else {
          win.webContents.send("currentApp", currentApp);
        }
      }
    );
  });

  win.on("blur", () => {
    Menu.sendActionToFirstResponder("hide:");
  });

  win.on("close", () => {
    delete win;
  });
}

function toggleWindow() {
  if (hasShortcuts()) {
    win.isVisible() ? win.hide() : win.show();
  }
}

app.dock.hide();
app.on("ready", () => {
  tray = new Tray(path.join(assetsDirectory, "shortcuts-gray@2x.png"));

  createWindow();
  setInterval(() => {
    hasShortcuts()
      ? tray.setImage(path.join(assetsDirectory, "shortcuts@2x.png"))
      : tray.setImage(path.join(assetsDirectory, "shortcuts-gray@2x.png"));
  }, 1000);

  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);
  tray.on("click", toggleWindow);
  globalShortcut.register("Command+1", toggleWindow);
});
