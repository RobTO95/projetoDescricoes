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
