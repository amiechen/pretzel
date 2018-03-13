const { app, Menu, Tray, BrowserWindow, globalShortcut } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const availableShortcuts = fs.readdirSync(shortcutsDirectory);
const menu = new Menu();
let win;

// setup objc bridge
objc.import("AppKit");
const { NSWorkspace, js } = objc;

function hasShortcuts() {
  let currentAppProxy = NSWorkspace.sharedWorkspace()
    .frontmostApplication()
    .localizedName();
  let currentApp = js(currentAppProxy);

  // workaround for Electron stealing the app focus
  if (currentApp === "Electron") {
    return true;
  }

  return availableShortcuts.indexOf(`${currentApp}.yml`) > -1;
}

function createWindow() {
  console.log("create window");
  win = new BrowserWindow({
    width: 1000,
    height: 500,
    frame: false
  });
  win.loadURL(
    url.format({
      pathname: path.join("file://", __dirname, "index.html")
    })
  );

  win.on("blur", () => {
    Menu.sendActionToFirstResponder("hide:");
  });

  win.on("close", () => {
    delete win;
  });
}

function toggleWindow() {
  if (hasShortcuts()) {
    if (win) {
      win.isVisible() ? win.hide() : win.show();
    } else {
      createWindow();
    }
  }
}

app.on("ready", () => {
  const tray = new Tray(path.join(assetsDirectory, "shortcuts@2x.png"));

  // setInterval(() => {
  //   hasShortcuts();
  // }, 1000);

  tray.on("click", toggleWindow);
  globalShortcut.register("Command+1", toggleWindow);
});
