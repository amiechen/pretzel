const path = require("path");
const fs = require("fs");

const { ipcRenderer, remote, shell } = require("electron");
const yaml = require("js-yaml");
const hotkeys = require("hotkeys-js");
const setting = require("./setting");
const appName = get(".app-name");
const shortcutsContainer = get(".shortcuts-container");
const input = get("#search");
const allAppsBtn = get("#show-all-apps");
const quitAppBtn = get("#quit-app");
const settingAppBtn = get("#setting-app");
const nightModeBtn = get(".toggle");
const cancelSettingBtn = get(".cancel");
const saveAndRelaunchBtn = get(".save-and-relaunch");
const readmeUrl =
  "https://github.com/amiechen/pretzel/blob/master/README.md#add-a-shortcut";
const allAppsUrl = "https://www.amie-chen.com/pretzel/supported-apps";

function get(selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
}

function getAll(selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
}

function searchShortcuts() {
  let filter = input.value.toUpperCase();
  let shortcuts = getAll(".shortcut");

  for (var i = 0; i < shortcuts.length; i++) {
    let label = get("label", shortcuts[i]);
    if (label.innerHTML.toUpperCase().indexOf(filter) > -1) {
      shortcuts[i].classList.remove("hide");
    } else {
      shortcuts[i].classList.add("hide");
    }
  }
}

function toggleTitles() {
  getAll(".shortcuts__group").forEach(group => {
    // if all shortcuts are hidden
    // we hide the title
    // otherwise we show the title
    if (
      getAll(".shortcut.hide", group).length ===
      getAll(".shortcut", group).length
    ) {
      get(".shortcuts__title", group).classList.add("hide");
    } else {
      get(".shortcuts__title", group).classList.remove("hide");
    }
  });
}

function getShortcutConfig(name) {
  try {
    const config = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, `shortcuts/${name}`), "utf8")
    );
    return config;
  } catch (e) {
    console.log(e);
  }
}

function openReadmeURL() {
  shell.openExternal(readmeUrl);
}

function onChange(event) {
  if (event.target.classList.contains("active")) {
    this.classList.remove("active");
  } else {
    var toggledItems = getAll(".toggle.active");

    if (toggledItems.length >= 2) {
      toggledItems[Math.floor(Math.random() * 2)].classList.remove("active");
    }
    this.classList.add("active");
  }
}

ipcRenderer.on("noShortcuts", (event, name) => {
  const html = `<div class="no-shortcuts">
    <div class="no-shortcuts__text">
      <p>No shortcuts found for <br><span class="app-name">${name}</span></p>
    </div>
    <div class="add-shortcut-btn" onClick="openReadmeURL()">Add shortcuts for ${name}</div>
  </div>`;
  const addShortcutBtn = document.querySelector(".add-shortcut-btn");

  appName.style.display = "none";
  input.style.display = "none";
  shortcutsContainer.innerHTML = html;
});

ipcRenderer.on("currentApp", (event, name) => {
  const shortcuts = getShortcutConfig(name);
  let html = "";

  get("#search").focus();

  for (var prop in shortcuts) {
    html += `<div class="shortcuts__group"><h3 class="shortcuts__title">${prop}</h3>`;
    shortcuts[prop].forEach(element => {
      html += `<div class="shortcut">
        <label class="shortcut__key"><span>${Object.keys(
          element
        )}</span></label>
        <label class="shortcut__name"><span>${
          Object.values(element)[0]
        }</span></label>
      </div>`;
    });
    html += "</div>";
  }

  appName.innerHTML = name.split(".yml")[0];
  shortcutsContainer.innerHTML = html;
  appName.style.display = "";
  input.style.display = "";
});

input.addEventListener("keyup", () => {
  searchShortcuts();
  toggleTitles();
});

allAppsBtn.addEventListener("click", () => {
  shell.openExternal(allAppsUrl);
});

quitAppBtn.addEventListener("click", () => {
  remote.app.quit();
});

settingAppBtn.addEventListener("click", () => {
  get(".user-settings").style.display = "block";
  get("body").style.overflow = "hidden";
  setting.setShortcut("Cmd+1");
});

nightModeBtn.addEventListener("click", () => {});

cancelSettingBtn.addEventListener("click", () => {
  console.log("wipe out all the input");
  get("body").style.overflow = "auto";
  get(".user-settings").style.display = "none";
});

saveAndRelaunchBtn.addEventListener("click", () => {
  console.log("saved");
  get("body").style.overflow = "auto";
  get(".user-settings").style.display = "none";
});

Array.from(getAll(".toggle")).forEach(function(toggle) {
  return toggle.addEventListener("click", onChange);
});
