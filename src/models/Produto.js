const db = require("../db/db");

class Produto {
    codProduto;
    grupo = null;
    descricao = null;
    estoque = [];
    notasFiscais = [];
    ondeUsado = [];
    fornecedores = [];

    constructor(codProduto = null) {
        this.codProduto = codProduto;
    }

    carregarDadosPrincipais() {
        const stmt = db.prepare(`
            SELECT Grupo, Descricao FROM baseProdutos WHERE Codigo = ?
        `);
        const data = stmt.get(this.codProduto);
        if (data) {
            this.grupo = data.Grupo;
            this.descricao = data.Descricao;
        }
    }

    carregarEstoque() {
        const stmt = db.prepare(`
            SELECT 
                e.Filial, e.Armazem, e.Saldo_Atual, p.Unidade, e.Mapa 
            FROM 
                baseEstoque AS e 
            INNER JOIN baseProdutos as p ON e.Produto = p.Codigo 
            WHERE e.Produto = ?
        `);
        this.estoque = stmt.all(this.codProduto);
    }

    carregarNotasFiscais() {
        const stmt = db.prepare(`
            SELECT * FROM baseNotasFiscais WHERE Produto = ?
        `);
        this.notasFiscais = stmt.all(this.codProduto);
    }

    carregarOndeUsado() {
        const stmt = db.prepare(`
            SELECT * FROM baseOndeUsado WHERE Componente = ?
        `);
        this.ondeUsado = stmt.all(this.codProduto);
    }

    carregarFornecedores() {
        const stmt = db.prepare(`
            SELECT * FROM baseProdutosFornecedores WHERE Produto = ?
        `);
        this.fornecedores = stmt.all(this.codProduto);
    }

    carregarTudo() {
        this.carregarDadosPrincipais();
        this.carregarEstoque();
        this.carregarNotasFiscais();
        this.carregarOndeUsado();
        this.carregarFornecedores();
    }

    static buscarPorCodigo(codigo) {
        const produto = new Produto(codigo);
        produto.carregarTudo();
        return produto;
    }
}

module.exports = Produto;
