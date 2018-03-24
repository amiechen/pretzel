const { Menu, globalShortcut } = require("electron");
const autoUpdater = require("electron-updater").autoUpdater;
const fs = require("fs");
const url = require("url");
const path = require("path");
const objc = require("objc");
const stringSimilarity = require("string-similarity");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const menubar = require("menubar");
const mb = menubar({
  icon: path.join(__dirname, "/assets/icon.png"),
  width: 300,
  height: 400,
  resizable: false,
  showDockIcon: false,
  preloadWindow: true
});

// setup objc bridge
objc.import("AppKit");
const { NSWorkspace, js } = objc;

function getCurrentApp() {
  const currentAppProxy = NSWorkspace.sharedWorkspace()
    .frontmostApplication()
    .localizedName();
  return js(currentAppProxy);
}

function hasShortcut() {
  const availableShortcuts = fs.readdirSync(shortcutsDirectory);
  const matches = stringSimilarity.findBestMatch(
    getCurrentApp(),
    availableShortcuts
  );
  return matches.bestMatch.rating > 0.5 ? true : false;
}

function toggleWindow() {
  mb.window.isVisible() ? mb.hideWindow() : mb.showWindow();
}

mb.on("ready", function ready() {
  // mb.window.webContents.toggleDevTools();
  autoUpdater.checkForUpdatesAndNotify();
  globalShortcut.register("CommandOrControl+`", toggleWindow);
});

mb.on("show", () => {
  const currentApp = getCurrentApp();
  const currentAppFile = `${currentApp}.yml`;
  mb.tray.setHighlightMode("always");
  fs.access(
    path.join(shortcutsDirectory, currentAppFile),
    fs.constants.R_OK,
    err => {
      if (err) {
        mb.window.webContents.send("noShortcuts", currentApp);
      } else {
        mb.window.webContents.send("currentApp", currentAppFile);
      }
    }
  );
});

mb.on("hide", () => {
  mb.tray.setHighlightMode("never");
  Menu.sendActionToFirstResponder("hide:");
});

mb.app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  mb.app.quit();
});

autoUpdater.on("update-downloaded", info => {
  autoUpdater.quitAndInstall();
});
