const {
  app,
  globalShortcut,
  Menu,
  systemPreferences,
  Tray
} = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const menubar = require("menubar");
let previousApp;
let opts = {
  dir: __dirname,
  index: path.join("file://", __dirname, "index.html"),
  icon: path.join(assetsDirectory, "shortcuts-gray@2x.png"),
  tooltip: "Shortcuts",
  width: 1000,
  height: 500,
  showDockIcon: false,
  resizable: false,
  activated: false
};
let mb = menubar(opts);

objc.import("AppKit");
const { NSWorkspace, js } = objc;

function activateApp(currentApp) {
  opts.activated = true;
  mb.tray.setImage(path.join(assetsDirectory, "shortcuts@2x.png"));
  previousApp = currentApp;
}

function deactivateApp(currentApp) {
  opts.activated = false;
  mb.tray.setImage(path.join(assetsDirectory, "shortcuts-gray@2x.png"));
  previousApp = currentApp;
}

function activateWindow() {
  mb.showWindow();
}

function deactivateWindow() {
  mb.hideWindow();
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

  // pull every second for frontmost application
  setInterval(() => {
    let currentAppProxy = NSWorkspace.sharedWorkspace()
      .frontmostApplication()
      .localizedName();
    let currentApp = js(currentAppProxy);

    if (currentApp !== previousApp) {
      availableShortcuts.indexOf(`${currentApp}.yml`) > -1
        ? activateApp(currentApp)
        : deactivateApp(currentApp);
    }
  }, 1000);

  mb.tray.on("click", () => {
    opts.activated ? activateWindow() : deactivateWindow();
  });

  globalShortcut.register("Command+1", () => {
    mb.window.isVisible() ? deactivateWindow() : activateWindow();
  });
});
