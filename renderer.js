const ipcRenderer = require("electron").ipcRenderer;
const yaml = require("js-yaml");
const fs = require("fs");
const appName = document.querySelector(".app-name");
const shortcutsContainer = document.querySelector(".shortcuts-container");
const input = document.querySelector("#search");

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

  get("#search").style.display = "";
  shortcutsContainer.classList.remove('no-shortcuts');

  for (var prop in shortcuts) {
    html += `<div class="shortcuts__group"><h3 class="shortcuts__title">${prop}</h3>`;
    shortcuts[prop].forEach(element => {
      html += `<div class="shortcut">
        <label class="shortcut__key">${Object.keys(element)}</label>
        <label class="shortcut__name">${Object.values(element)[0]}</label>
      </div>`;
    });
    html += "</div>";
  }

  appName.innerHTML = name;
  shortcutsContainer.innerHTML = html;
});

ipcRenderer.on("noShortcuts", (event, name) => {
  get("#search").style.display = "none";
  appName.innerHTML = "Shortcuts Not Found";
  shortcutsContainer.classList.add('no-shortcuts');
  shortcutsContainer.innerHTML = `
    <p class="no-shortcuts__text">Check our list of existing apps, or add one for <span class="label">${name}</span>.</p>
    <button class="no-shortcuts__button button--primary">See List</button>
    <button class="no-shortcuts__button button--secondary">Contribute</button>
  `;
});

input.addEventListener("keyup", () => {
  searchShortcuts();
  toggleTitles();
});
