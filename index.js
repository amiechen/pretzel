const { app, globalShortcut, Menu, systemPreferences } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const menubar = require("menubar");
let previousApp;
let mb = menubar({
    dir: __dirname,
    index: path.join("file://", __dirname, "index.html"),
    icon: path.join(assetsDirectory, "shortcuts-gray@2x.png"),
    tooltip: "Shortcuts",
    width: 1000,
    height: 500,
    showDockIcon: false,
    resizable: false,
    preloadWindow: true
  });

objc.import("AppKit");
const { NSWorkspace, js } = objc;

function activateWindow(currentApp) {
  mb.tray.setImage(path.join(assetsDirectory, "shortcuts@2x.png"));
  previousApp = currentApp;
}

function deactivateWindow(currentApp) {
  mb.tray.setImage(path.join(assetsDirectory, "shortcuts-gray@2x.png"));
  previousApp = currentApp;
}

mb.on("show", () => {
  let currentAppProxy = NSWorkspace.sharedWorkspace()
    .frontmostApplication()
    .localizedName();
  let currentApp = js(currentAppProxy);

  fs.access(
    path.join(shortcutsDirectory, `${currentApp}.yml`),
    fs.constants.R_OK,
    err => {
      if (err) {
        mb.window.webContents.send("noShortcuts", currentApp);
      } else {
        mb.window.webContents.send("currentApp", currentApp);
      }
    }
  );
});

mb.on("after-create-window", () => {
  //mb.window.openDevTools();
});

// return window focus back to the previous app, like the behavior on mac app
mb.on("after-hide", () => {
  Menu.sendActionToFirstResponder("hide:");
});

app.on("ready", () => {
  const availableShortcuts = fs.readdirSync(shortcutsDirectory);

  // do pulling every second
  setInterval(() => {
    let currentAppProxy = NSWorkspace.sharedWorkspace()
      .frontmostApplication()
      .localizedName();
    let currentApp = js(currentAppProxy);

    if (currentApp !== previousApp) {
      availableShortcuts.indexOf(`${currentApp}.yml`) > -1 ? activateWindow(currentApp) : deactivateWindow(currentApp);
    }
  }, 1000);

  // display window on shortcut
  globalShortcut.register("Command+1", () => {
    mb.window.isVisible() ? mb.hideWindow() : mb.showWindow();
  });
});
