const settings = require("electron-settings");

const getShortcut = function() {
  return settings.get("user-shortcut");
};

const setShortcut = function(shortcut) {
  console.log(shortcut);
  settings.set("user-shortcut", shortcut);
};

exports.getShortcut = getShortcut;
exports.setShortcut = setShortcut;
