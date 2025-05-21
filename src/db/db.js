const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

// Garante que a pasta existe
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Caminho completo do arquivo do banco
const dbPath = path.join(dbDir, "data.db");

// Conecta ao banco (cria se não existir)
const db = new Database(dbPath);

// Ativabdo chave estrangeira
db.pragma("foreign_keys = ON");

// Criação de tabelas

// -------------------------- criação da tabAcao
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabAcao (
        id INTEGER PRIMARY KEY,  
        acao TEXT NOT NULL
        )
        `
).run();

// -------------------------- criação da tabCampo
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabCampo (
        id INTEGER PRIMARY KEY, 
        campo TEXT NOT NULL, 
        tabela TEXT NOT NULL, 
        coluna TEXT NOT NULL 
        )
        `
).run();

// -------------------------- criação da tabStatus
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabStatus (
        id INTEGER PRIMARY KEY, 
        status TEXT NOT NULL
        )
        `
).run();

// -------------------------- criação da tabPlanejado
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabPlanejado (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        codProduto TEXT NOT NULL, 
        acao INTEGER NOT NULL REFERENCES tabAcao(id), 
        campo INTEGER NOT NULL REFERENCES tabCampo(id), 
        valorAntigo TEXT, 
        valorNovo TEXT, 
        dataLancamento TEXT, 
        status INTEGER NOT NULL REFERENCES tabStatus(id), 
        observacao TEXT, 
        autorLancamento INTEGER
        )
        `
).run();

// -------------------------- criação da tabExecutado
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabExecutado (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        id_planejado INTEGER NOT NULL, 
        dataExecucao TEXT, 
        autorExecucao INTEGER, 
        FOREIGN KEY (id_planejado) REFERENCES tabPlanejado(id) ON DELETE CASCADE
        )
        `
).run();

// -------------------------- criação da tabNotasFiscais
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabNotasFiscais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_execucao INTEGER NOT NULL, 
        filial TEXT, 
        itemNF TEXT, 
        unidade TEXT, 
        quantidade REAL, 
        codFornecedorCliente  TEXT, 
        data TEXT, 
        FOREIGN KEY (id_execucao) REFERENCES tabExecutado(id) ON DELETE CASCADE
        )
        `
).run();

// -------------------------- criação da tabOndeUsado
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabOndeUsado (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_execucao INTEGER NOT NULL, 
        codManufatura TEXT, 
        nivel TEXT, 
        FOREIGN KEY (id_execucao) REFERENCES tabExecutado(id) ON DELETE CASCADE
        )
        `
).run();

// -------------------------- criação da tabProdutoFornecedor
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabProdutoFornecedor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_execucao INTEGER NOT NULL, 
        codFornecedor TEXT, 
        razaoSocial TEXT, 
        loja TEXT, 
        codProdFor TEXT, 
        codProdCat TEXT, 
        FOREIGN KEY (id_execucao) REFERENCES tabExecutado(id) ON DELETE CASCADE
        )
        `
).run();

// -------------------------- criação da tabEstoque
db.prepare(
    `CREATE TABLE IF NOT EXISTS tabEstoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_execucao INTEGER NOT NULL, 
        filial TEXT, 
        produto TEXT, 
        armazem TEXT, 
        saldoAtual REAL, 
        mapa TEXT, 
        FOREIGN KEY (id_execucao) REFERENCES tabExecutado(id) ON DELETE CASCADE
        )
        `
).run();

module.exports = db;
console.log("Banco criado com sucesso!");
