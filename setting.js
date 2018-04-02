const settings = require("electron-settings");

const getKeycode = function() {
  return settings.get("user-keycode") || "`";
};

const setKeycode = function(code) {
  // default to backtick
  code = code || "`";
  settings.set("user-keycode", code);
};

const getKeymodifier = function() {
  return settings.get("user-keymodifier") || "Cmd";
};

const setKeymodifier = function(code) {
  settings.set("user-keymodifier", code);
};

const getTheme = function() {
  return settings.get("theme");
};

const setTheme = function(theme) {
  settings.set("theme", theme);
};

exports.getKeymodifier = getKeymodifier;
exports.setKeymodifier = setKeymodifier;
exports.getKeycode = getKeycode;
exports.setKeycode = setKeycode;
exports.getTheme = getTheme;
exports.setTheme = setTheme;
