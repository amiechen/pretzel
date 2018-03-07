const ipcRenderer = require("electron").ipcRenderer;
const el = document.querySelector(".app-name");

ipcRenderer.on("currentApp", (event, message) => {
  el.innerHTML = message;
  console.log(message);
});
