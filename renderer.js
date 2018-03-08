const ipcRenderer = require("electron").ipcRenderer;
const yaml = require("js-yaml");
const fs = require("fs");
const appNameHTML = document.querySelector(".app-name");
const shortcutsHTML = document.querySelector(".shortcuts-container");

function getShortcutConfig(name) {
  try {
    const config = yaml.safeLoad(
      fs.readFileSync(`shortcuts/${name}.yml`, "utf8")
    );
    return config;
  } catch (e) {
    console.log(e);
  }
}

ipcRenderer.on("currentApp", (event, name) => {
  const shortcuts = getShortcutConfig(name);
  let html = "";

  for (var prop in shortcuts) {
    html += `<h3 class="shortcuts__title">${prop}</h3>`;
    shortcuts[prop].forEach(element => {
      html += `<div class="shortcut">
        <label class="shortcut__key">${Object.keys(element)}</label>
        <label class="shortcut__name">${Object.values(element)[0]}</label>
      </div>`;
    });
  }

  appNameHTML.innerHTML = name;
  shortcutsHTML.innerHTML = html;
});

ipcRenderer.on("noShortcuts", (event, name) => {
  console.log("hey do you want to add some shortcuts for us");
  appNameHTML.innerHTML = name;
  shortcutsHTML.innerHTML = `<p>There is no shortcuts for your application. Add some here for the future.</p>`;
});
