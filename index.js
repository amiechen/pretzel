const path = require("path");
const url = require("url");
const objc = require("objc");
const assetsDirectory = path.join(__dirname, "assets");
const menubar = require("menubar");

let opts = {
  dir: __dirname,
  index: path.join("file://", __dirname, "index.html"),
  icon: path.join(assetsDirectory, "shortcuts@2x.png"),
  tooltip: "Shortcuts",
  width: 300,
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
  mb.window.webContents.send("currentApp", currentApp);
});

mb.on("after-create-window", () => {
  //mb.window.openDevTools();
});
