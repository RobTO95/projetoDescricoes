const routes = {
    "/home": "./view/home.html",
    "/produtos": "./view/produtos.html",
    "/config": "./view/config.html",
    "/outras": "./view/outras.html",
};

async function loadRoute(route) {
    const app = document.getElementById("app");
    const path = routes[route] || routes["/home"];

    const html = await fetch(path).then((res) => res.text());
    app.innerHTML = html;

    // Executa o script correspondente
    if (route === "/produtos") {
        const { initProdutosPage } = await import("./controllers/produtos.js");
        initProdutosPage();
    }
}

window.addEventListener("hashchange", () => {
    loadRoute(location.hash.slice(1));
});

window.addEventListener("DOMContentLoaded", () => {
    loadRoute(location.hash.slice(1) || "/home");
});
