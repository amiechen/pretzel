const { app, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const menubar = require("menubar");

let opts = {
  dir: __dirname,
  index: path.join("file://", __dirname, "index.html"),
  icon: path.join(assetsDirectory, "shortcuts@2x.png"),
  tooltip: "Shortcuts",
  width: 1000,
  height: 500,
  showDockIcon: false,
  resizable: false,
  preloadWindow: true
};

let mb = menubar(opts);

objc.import("AppKit");

mb.on("show", () => {
  const { NSWorkspace, js } = objc;
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
  mb.window.openDevTools();
});

// display window on shortcut
app.on("ready", () => {
  globalShortcut.register("Command+1", () => {
    mb.window.isVisible() ? mb.hideWindow() : mb.showWindow();
  });
});
