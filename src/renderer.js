document.getElementById("min-btn")?.addEventListener("click", () => {
    window.api.janela.minimizar();
});

document.getElementById("max-btn")?.addEventListener("click", () => {
    window.api.janela.maximizarOuRestaurar();
});

document.getElementById("close-btn")?.addEventListener("click", () => {
    window.api.janela.fechar();
});
