const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("fedshield", {
  platform: process.platform,
});
