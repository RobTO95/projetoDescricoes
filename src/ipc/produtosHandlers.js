const { ipcMain } = require("electron");
const db = require("../db/db");

module.exports = function setupProdutosHandlers() {
    ipcMain.handle("get-produtos", () => {
        try {
            const stmt = db.prepare(
                "SELECT codigo, descricao, grupo FROM baseProdutos"
            );
            return stmt.all();
        } catch (err) {
            console.error("Erro ao buscar produtos:", err.message);
            throw err;
        }
    });

    ipcMain.handle("filtrar-produtos", (event, filtros) => {
        try {
            let sql =
                "SELECT codigo, descricao, grupo FROM baseProdutos WHERE 1=1";
            const params = [];

            if (filtros.produto) {
                sql += " AND codigo LIKE ?";
                params.push(`%${filtros.produto}%`);
            }
            if (filtros.descricao) {
                sql += " AND descricao LIKE ?";
                params.push(`%${filtros.descricao}%`);
            }
            if (filtros.grupo) {
                sql += " AND grupo LIKE ?";
                params.push(`%${filtros.grupo}%`);
            }
            const stmt = db.prepare(sql);
            return stmt.all(...params);
        } catch (err) {
            console.error("Erro ao filtrar produtos:", err.message);
            throw err;
        }
    });
};
