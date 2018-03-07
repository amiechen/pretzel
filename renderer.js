const ipcRenderer = require("electron").ipcRenderer;
const el = document.querySelector(".app-name");

ipcRenderer.on("currentApp", function(currentApp) {
  el.innerHTML = currentApp;
  console.log(currentApp);
});

console.log("a renderer is launched");
