const { ipcMain, BrowserWindow } = require("electron");

module.exports = function setupJanelaHandlers() {
    ipcMain.on("janela:minimizar", () => {
        BrowserWindow.getFocusedWindow()?.minimize();
    });

    ipcMain.on("janela:maximizarOuRestaurar", () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
    });

    ipcMain.on("janela:fechar", () => {
        BrowserWindow.getFocusedWindow()?.close();
    });
};
