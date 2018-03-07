const ipcRenderer = require("electron").ipcRenderer;
const yaml = require("js-yaml");
const _ = require("underscore");
const fs = require("fs");
const appName = document.querySelector(".app-name");
const shortcutsContainer = document.querySelector(".shortcuts-container");

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

function findShortcutsByName(name) {
  try {
    const config = yaml.safeLoad(
      fs.readFileSync(`shortcuts/${name}.yml`, "utf8")
    );
    const indentedJson = JSON.stringify(config, null, 4);
    return indentedJson;
  } catch (e) {
    console.log(e);
  }
}

ipcRenderer.on("currentApp", (event, name) => {
  const appNameTemplate = _.template("Hello {{ name }}!");
  appName.innerHTML = appNameTemplate({ name: name });
  shortcutsContainer.innerHTML = findShortcutsByName(name);
});
