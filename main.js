const { app, Menu, Tray, BrowserWindow, globalShortcut } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const objc = require("objc");
const stringSimilarity = require("string-similarity");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const inactiveIcon = path.join(assetsDirectory, "gray@2x.png");
const activeIcon = path.join(assetsDirectory, "black@2x.png");
const availableShortcuts = fs.readdirSync(shortcutsDirectory);
const menu = new Menu();
let currentAppFile;
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

  let matches = stringSimilarity.findBestMatch(currentApp, availableShortcuts);
  // when window is open, currentapp is electron
  // which prevents the window to hide on clicking app icon
  if (currentApp === "Electron") {
    return true;
  }

  if (matches.bestMatch.rating > 0.5) {
    currentAppFile = matches.bestMatch.target;
    return true;
  } else {
    return false;
  }
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
    height: 400,
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
    win.setVisibleOnAllWorkspaces(true);
    win.focus();

    fs.access(
      path.join(shortcutsDirectory, currentAppFile),
      fs.constants.R_OK,
      err => {
        if (err) {
          win.webContents.send("noShortcuts", currentAppFile);
        } else {
          win.webContents.send("currentApp", currentAppFile);
        }
      }
    );
  });

  win.on("hide", () => {
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
  tray = new Tray(inactiveIcon);

  createWindow();
  setInterval(() => {
    hasShortcuts() ? tray.setImage(activeIcon) : tray.setImage(inactiveIcon);
  }, 1000);

  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);
  tray.on("click", toggleWindow);

  globalShortcut.register("Command+1", toggleWindow);
});
