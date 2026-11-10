const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");
const { createStaticServer } = require("./server.cjs");

let server;
let mainWindow;

async function start() {
  const root = app.getAppPath();
  server = createStaticServer(root);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: "#151515",
    title: "Cartoon Short Kit",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.removeMenu();
  await mainWindow.loadURL(`http://127.0.0.1:${address.port}/index.html`);
  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(start).catch(async (error) => {
  await dialog.showMessageBox({
    type: "error",
    title: "Cartoon Short Kit could not start",
    message: error.message
  });
  app.quit();
});

app.on("window-all-closed", () => {
  if (server) server.close();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (server) server.close();
});
