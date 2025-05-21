const db = require("../db/db");

class Execucao {
    constructor({
        id = null,
        id_planejado,
        dataExecucao = null,
        autorExecucao = null,
    } = {}) {
        this.id = id;
        this.id_planejado = id_planejado;
        this.dataExecucao = dataExecucao;
        this.autorExecucao = autorExecucao;
    }

    // Getter/Setter para as propriedades (opcional, pode acessar direto)

    // --- CRUD Execucao ---

    // Inserir nova execução e atualizar this.id
    save() {
        if (this.id) {
            // Update
            const stmt = db.prepare(`
        UPDATE tabExecutado SET
          id_planejado = @id_planejado,
          dataExecucao = @dataExecucao,
          autorExecucao = @autorExecucao
        WHERE id = @id
      `);
            stmt.run(this);
        } else {
            // Insert
            const stmt = db.prepare(`
        INSERT INTO tabExecutado (id_planejado, dataExecucao, autorExecucao)
        VALUES (@id_planejado, @dataExecucao, @autorExecucao)
      `);
            const info = stmt.run(this);
            this.id = info.lastInsertRowid;
        }
    }

    // Buscar execução por id
    static getById(id) {
        const row = db
            .prepare(`SELECT * FROM tabExecutado WHERE id = ?`)
            .get(id);
        return row ? new Execucao(row) : null;
    }

    // Deletar execução (e cascata nos relacionados)
    delete() {
        if (!this.id) throw new Error("Execucao não tem id para deletar.");
        const stmt = db.prepare(`DELETE FROM tabExecutado WHERE id = ?`);
        stmt.run(this.id);
    }

    // --- Métodos para tabNotasFiscais ---

    addNotaFiscal(notaFiscal) {
        if (!this.id)
            throw new Error(
                "Execucao deve ser salva antes de adicionar nota fiscal."
            );
        const stmt = db.prepare(`
      INSERT INTO tabNotasFiscais
        (id_execucao, filial, itemNF, unidade, quantidade, codFornecedorCliente, data)
      VALUES
        (@id_execucao, @filial, @itemNF, @unidade, @quantidade, @codFornecedorCliente, @data)
    `);
        const info = stmt.run({ id_execucao: this.id, ...notaFiscal });
        return info.lastInsertRowid;
    }

    getNotasFiscais() {
        return db
            .prepare(`SELECT * FROM tabNotasFiscais WHERE id_execucao = ?`)
            .all(this.id);
    }

    deleteNotaFiscal(idNotaFiscal) {
        const stmt = db.prepare(
            `DELETE FROM tabNotasFiscais WHERE id = ? AND id_execucao = ?`
        );
        stmt.run(idNotaFiscal, this.id);
    }

    // --- Métodos para tabOndeUsado ---

    addOndeUsado(ondeUsado) {
        if (!this.id)
            throw new Error(
                "Execucao deve ser salva antes de adicionar OndeUsado."
            );
        const stmt = db.prepare(`
      INSERT INTO tabOndeUsado (id_execucao, codManufatura, nivel)
      VALUES (@id_execucao, @codManufatura, @nivel)
    `);
        const info = stmt.run({ id_execucao: this.id, ...ondeUsado });
        return info.lastInsertRowid;
    }

    getOndeUsado() {
        return db
            .prepare(`SELECT * FROM tabOndeUsado WHERE id_execucao = ?`)
            .all(this.id);
    }

    deleteOndeUsado(idOndeUsado) {
        const stmt = db.prepare(
            `DELETE FROM tabOndeUsado WHERE id = ? AND id_execucao = ?`
        );
        stmt.run(idOndeUsado, this.id);
    }

    // --- Métodos para tabProdutoFornecedor ---

    addProdutoFornecedor(produtoFornecedor) {
        if (!this.id)
            throw new Error(
                "Execucao deve ser salva antes de adicionar ProdutoFornecedor."
            );
        const stmt = db.prepare(`
      INSERT INTO tabProdutoFornecedor
        (id_execucao, codFornecedor, razaoSocial, loja, codProdFor, codProdCat)
      VALUES
        (@id_execucao, @codFornecedor, @razaoSocial, @loja, @codProdFor, @codProdCat)
    `);
        const info = stmt.run({ id_execucao: this.id, ...produtoFornecedor });
        return info.lastInsertRowid;
    }

    getProdutosFornecedor() {
        return db
            .prepare(`SELECT * FROM tabProdutoFornecedor WHERE id_execucao = ?`)
            .all(this.id);
    }

    deleteProdutoFornecedor(idProdutoFornecedor) {
        const stmt = db.prepare(
            `DELETE FROM tabProdutoFornecedor WHERE id = ? AND id_execucao = ?`
        );
        stmt.run(idProdutoFornecedor, this.id);
    }

    // --- Métodos para tabEstoque ---

    addEstoque(estoque) {
        if (!this.id)
            throw new Error(
                "Execucao deve ser salva antes de adicionar Estoque."
            );
        const stmt = db.prepare(`
      INSERT INTO tabEstoque (id_execucao, filial, produto, armazem, saldoAtual, mapa)
      VALUES (@id_execucao, @filial, @produto, @armazem, @saldoAtual, @mapa)
    `);
        const info = stmt.run({ id_execucao: this.id, ...estoque });
        return info.lastInsertRowid;
    }

    getEstoques() {
        return db
            .prepare(`SELECT * FROM tabEstoque WHERE id_execucao = ?`)
            .all(this.id);
    }

    deleteEstoque(idEstoque) {
        const stmt = db.prepare(
            `DELETE FROM tabEstoque WHERE id = ? AND id_execucao = ?`
        );
        stmt.run(idEstoque, this.id);
    }
}

module.exports = Execucao;
