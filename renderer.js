// default node packages
const path = require("path");
const fs = require("fs");
// third party
const { ipcRenderer, remote, shell } = require("electron");
const yaml = require("js-yaml");
const hotkeys = require("hotkeys-js");
const setting = require("./setting");
// variables
const appName = get(".app-name");
const shortcutsContainer = get(".shortcuts-container");
const search = get("#search");
const allAppsBtn = get("#show-all-apps");
const quitAppBtn = get("#quit-app");
const settingAppBtn = get("#setting-app");
const toggleBtn = get(".toggle-container");
const cancelSettingBtn = get(".cancel");
const body = get("body");
const saveAndRelaunchBtn = get(".save-and-relaunch");
const readmeUrl =
  "https://github.com/amiechen/pretzel/blob/master/README.md#add-a-shortcut";
const allAppsUrl = "https://www.amie-chen.com/pretzel/supported-apps";
let shortcutArray = "";

function get(selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
}

function getAll(selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
}

function searchShortcuts() {
  let filter = search.value.toUpperCase();
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
    // hide the title if all shortcuts are hidden
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

function setPretzelTheme() {
  const theme = setting.getTheme() || "dark";
  body.classList = "";
  body.classList.add(theme);
  theme === "dark" ? get(".toggle").classList.add("active") : null;
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
  search.style.display = "none";
  shortcutsContainer.innerHTML = html;
});

ipcRenderer.on("currentApp", (event, name) => {
  const shortcuts = getShortcutConfig(name);
  let html = "";

  search.focus();

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
  search.style.display = "";
});

search.addEventListener("keyup", () => {
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
  body.style.overflow = "hidden";
});

cancelSettingBtn.addEventListener("click", () => {
  get("#keymodifier").value = setting.getKeymodifier();
  get("#keycode").value = setting.getKeycode();
  body.style.overflow = "auto";
  get(".user-settings").style.display = "none";
});

saveAndRelaunchBtn.addEventListener("click", () => {
  const keymodifier = get("#keymodifier").options[
    get("#keymodifier").selectedIndex
  ].value;
  const keycode = get("#keycode").value;
  setting.setKeycode(keycode);
  setting.setKeymodifier(keymodifier);

  body.classList.contains("light")
    ? setting.setTheme("light")
    : setting.setTheme("dark");
  body.style.overflow = "auto";
  get(".user-settings").style.display = "none";
  remote.app.relaunch();
  remote.app.exit(0);
});

toggleBtn.addEventListener("click", event => {
  if (event.target.classList.contains("active")) {
    body.classList.remove("dark");
    body.classList.add("light");
    event.target.classList.remove("active");
  } else {
    event.target.classList.add("active");
    body.classList.remove("light");
    body.classList.add("dark");
  }
});

setPretzelTheme();
get("#keymodifier").value = setting.getKeymodifier();
get("#keycode").value = setting.getKeycode();
