const settings = require("electron-settings");

const getShortcut = function() {
  return settings.get("user-shortcut");
};

const setShortcut = function(shortcut) {
  console.log(shortcut);
  settings.set("user-shortcut", shortcut);
};

const getTheme = function() {
  return settings.get("theme");
};

const setTheme = function(theme) {
  settings.set("theme", theme);
};

exports.getShortcut = getShortcut;
exports.setShortcut = setShortcut;
exports.getTheme = getTheme;
exports.setTheme = setTheme;
