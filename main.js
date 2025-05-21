const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const setupJanelaHandlers = require("./src/ipc/janelaHandlers");
const setupProdutosHandlers = require("./src/ipc/produtosHandlers");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "src", "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile(path.join(__dirname, "src", "index.html"));
}

app.whenReady().then(() => {
    createWindow();
    setupJanelaHandlers();
    setupProdutosHandlers();
});

// informações produto ---------------------------------------------------------------------------------
const Produto = require("./src/models/Produto");
ipcMain.handle("get-produto-detalhado", (event, codigo) => {
    try {
        const produto = Produto.buscarPorCodigo(codigo);
        return produto;
    } catch (err) {
        console.error("Erro ao buscar detalhes do produto:", err.message);
        throw err;
    }
});
// ---------------------------------------------------------------------------------

app.on("window-all-closed", () => {
    // Em sistemas que NÃO sejam macOS, sai do app completamente
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // No macOS, recria a janela se o app for reativado (ícone no dock clicado)
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
