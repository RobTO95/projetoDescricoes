const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    janela: {
        minimizar: () => ipcRenderer.send("janela:minimizar"),
        maximizarOuRestaurar: () =>
            ipcRenderer.send("janela:maximizarOuRestaurar"),
        fechar: () => ipcRenderer.send("janela:fechar"),

        getProdutos: () => ipcRenderer.invoke("get-produtos"),
        filtrarProdutos: (filtros) =>
            ipcRenderer.invoke("filtrar-produtos", filtros),
        getProdutoDetalhado: (codigo) =>
            ipcRenderer.invoke("get-produto-detalhado", codigo),
    },
});
