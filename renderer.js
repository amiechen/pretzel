const ipcRenderer = require("electron").ipcRenderer;
const _ = require("underscore");
const appName = document.querySelector(".app-name");

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

ipcRenderer.on("currentApp", (event, name) => {
  // const shortcuts = findShortcutsByName(name)
  const template = _.template("Hello {{ name }}!");
  appName.innerHTML = template({ name: name });
});
