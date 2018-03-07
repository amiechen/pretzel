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
  width: 800,
  height: 300,
  showDockIcon: false,
  resizable: false,
  preloadWindow: true
};

let mb = menubar(opts);

objc.import("AppKit");

mb.on("show", () => {
  console.log("mb is showing");
  const { NSWorkspace, js } = objc;
  let currentAppProxy = NSWorkspace.sharedWorkspace()
    .frontmostApplication()
    .localizedName();
  let currentApp = js(currentAppProxy);
  mb.window.webContents.send("currentApp", currentApp);
});

mb.on("after-create-window", () => {
  mb.window.openDevTools();
});
