const { app, Menu, Tray, BrowserWindow, globalShortcut } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const shortcutsDirectory = path.join(__dirname, "shortcuts");
const inactiveIcon = path.join(assetsDirectory, "shortcuts-gray@2x.png");
const activeIcon = path.join(assetsDirectory, "shortcuts@2x.png");
const availableShortcuts = fs.readdirSync(shortcutsDirectory);
const menubar = require("menubar");
const mb = menubar({ icon: inactiveIcon });
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
  console.log(currentApp);

  // workaround for Electron stealing the app focus
  // if (currentApp === "Electron") {
  //   return true;
  // }
  return availableShortcuts.indexOf(`${currentApp}.yml`) > -1;
}

function toggleWindow() {
  if (hasShortcuts()) {
    win.isVisible() ? win.hide() : win.show();
  }
}

mb.on("ready", function ready() {
  // setInterval(() => {
  //   hasShortcuts()
  //     ? mb.tray.setImage(activeIcon)
  //     : mb.tray.setImage(inactiveIcon);
  // }, 1000);

  mb.on("click", toggleWindow);
  // mb.tray.on("click", () => {
  //   console.log("tray is clicked");
  //   toggleWindow();
  // });
});
