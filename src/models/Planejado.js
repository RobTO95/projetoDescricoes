// models/Planejado.js
const db = require("../db/db");

class Planejado {
    constructor(data = {}) {
        // propriedades privadas (convenção _nome)
        this._id = data.id || null;
        this._codProduto = data.codProduto || "";
        this._acao = data.acao || null;
        this._campo = data.campo || null;
        this._valorAntigo = data.valorAntigo || null;
        this._valorNovo = data.valorNovo || null;
        this._dataLancamento = data.dataLancamento || null;
        this._status = data.status || null;
        this._observacao = data.observacao || null;
        this._autorLancamento = data.autorLancamento || null;
    }

    // --- Getters e Setters ---
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }

    get codProduto() {
        return this._codProduto;
    }
    set codProduto(val) {
        this._codProduto = val;
    }

    get acao() {
        return this._acao;
    }
    set acao(val) {
        this._acao = val;
    }

    get campo() {
        return this._campo;
    }
    set campo(val) {
        this._campo = val;
    }

    get valorAntigo() {
        return this._valorAntigo;
    }
    set valorAntigo(val) {
        this._valorAntigo = val;
    }

    get valorNovo() {
        return this._valorNovo;
    }
    set valorNovo(val) {
        this._valorNovo = val;
    }

    get dataLancamento() {
        return this._dataLancamento;
    }
    set dataLancamento(val) {
        this._dataLancamento = val;
    }

    get status() {
        return this._status;
    }
    set status(val) {
        this._status = val;
    }

    get observacao() {
        return this._observacao;
    }
    set observacao(val) {
        this._observacao = val;
    }

    get autorLancamento() {
        return this._autorLancamento;
    }
    set autorLancamento(val) {
        this._autorLancamento = val;
    }

    // --- Métodos CRUD ---

    // Create/Insert - salva o registro no banco e atualiza o id da instância
    save() {
        if (this._id) {
            // Se já existe id, atualiza
            return this.update();
        } else {
            const stmt = db.prepare(
                `INSERT INTO tabPlanejado (
          codProduto, acao, campo, valorAntigo, valorNovo, dataLancamento, status, observacao, autorLancamento
        ) VALUES (
          @codProduto, @acao, @campo, @valorAntigo, @valorNovo, @dataLancamento, @status, @observacao, @autorLancamento
        )`
            );

            const info = stmt.run({
                codProduto: this._codProduto,
                acao: this._acao,
                campo: this._campo,
                valorAntigo: this._valorAntigo,
                valorNovo: this._valorNovo,
                dataLancamento: this._dataLancamento,
                status: this._status,
                observacao: this._observacao,
                autorLancamento: this._autorLancamento,
            });

            this._id = info.lastInsertRowid;
            return info;
        }
    }

    // Read - busca pelo id e retorna uma instância da classe
    static findById(id) {
        const stmt = db.prepare("SELECT * FROM tabPlanejado WHERE id = ?");
        const row = stmt.get(id);
        if (row) {
            return new Planejado(row);
        }
        return null;
    }

    // Read all - retorna um array de instâncias (com joins para descritivos)
    static findAll() {
        const stmt = db.prepare(
            `SELECT p.*, a.acao AS acaoDescricao, c.campo AS campoDescricao, s.status AS statusDescricao
       FROM tabPlanejado p
       LEFT JOIN tabAcao a ON p.acao = a.id
       LEFT JOIN tabCampo c ON p.campo = c.id
       LEFT JOIN tabStatus s ON p.status = s.id`
        );
        const rows = stmt.all();
        return rows.map((row) => new Planejado(row));
    }

    // Update - atualiza o registro no banco
    update() {
        if (!this._id) {
            throw new Error("ID é obrigatório para update");
        }
        const stmt = db.prepare(
            `UPDATE tabPlanejado SET 
         codProduto = @codProduto,
         acao = @acao,
         campo = @campo,
         valorAntigo = @valorAntigo,
         valorNovo = @valorNovo,
         dataLancamento = @dataLancamento,
         status = @status,
         observacao = @observacao,
         autorLancamento = @autorLancamento
       WHERE id = @id`
        );
        return stmt.run({
            id: this._id,
            codProduto: this._codProduto,
            acao: this._acao,
            campo: this._campo,
            valorAntigo: this._valorAntigo,
            valorNovo: this._valorNovo,
            dataLancamento: this._dataLancamento,
            status: this._status,
            observacao: this._observacao,
            autorLancamento: this._autorLancamento,
        });
    }

    // Delete - exclui o registro do banco
    delete() {
        if (!this._id) {
            throw new Error("ID é obrigatório para delete");
        }
        const stmt = db.prepare("DELETE FROM tabPlanejado WHERE id = ?");
        return stmt.run(this._id);
    }
}

module.exports = Planejado;
