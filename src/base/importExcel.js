const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const Database = require("better-sqlite3");

// Caminho do arquivo Excel
const excelPath = path.join(__dirname, "dados.xlsx");
if (!fs.existsSync(excelPath)) {
    console.error("❌ Arquivo Excel não encontrado:", excelPath);
    process.exit(1);
}

// Caminho do banco de dados
const dbPath = path.join(__dirname, "..", "db", "data.db");
const db = new Database(dbPath);

// Remove caracteres que podem causar erros ao sqlite na coluna
function sanitizeColumnName(col) {
    return col
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "_");
}

// Garante que os nomes das colunas sejam únicos após sanitização
function getUniqueColumnNames(columns) {
    const seen = new Map();
    return columns.map((col) => {
        let base = sanitizeColumnName(col);
        let unique = base;
        let count = 1;
        while (seen.has(unique)) {
            unique = `${base}_${count}`;
            count++;
        }
        seen.set(unique, true);
        return unique;
    });
}
// Converte colunas data serial para formato data
function excelSerialToDate(serial) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel começa em 1900-01-01, mas precisa subtrair 1 + 1 dia (bug do Excel)
    const days = Math.floor(serial);
    const date = new Date(excelEpoch.getTime() + days * 86400 * 1000);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

// Lê o arquivo Excel
let workbook;
try {
    workbook = xlsx.readFile(excelPath);
} catch (err) {
    console.error("❌ Erro ao ler o arquivo Excel:", err.message);
    process.exit(1);
}

const sheetNames = workbook.SheetNames;

sheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    // Colunas que devem ser sempre texto
    const colunasTexto = ["Codigo", "Produto", "Componente", "Grupo"];
    const colunasData = [
        "Data",
        "Data_Entrada",
        "Data_Emissao",
        "DT_Digitacao",
        "Dt_Movimento",
        "DT_Ult_Saida",
        "Dt_Invent",
    ]; // adapte conforme suas planilhas

    // Pega a primeira linha para mapear índices das colunas
    const headerRow = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        range: 0,
        raw: false,
    })[0];

    // Sanitiza os nomes das colunas da primeira linha
    const sanitizedHeaders = headerRow.map(sanitizeColumnName);

    // Mapeia índice da coluna para nome sanitizado
    const colIndexToSanitizedName = {};
    sanitizedHeaders.forEach((name, idx) => {
        colIndexToSanitizedName[idx] = name;
    });

    // Converte para texto apenas as células das colunas específicas
    Object.keys(sheet).forEach((cell) => {
        if (cell[0] === "!") return; // ignora metadados

        const cellObj = sheet[cell];
        const match = cell.match(/^([A-Z]+)(\d+)$/);
        if (!match) return;

        const colLetters = match[1];
        const colIndex = xlsx.utils.decode_col(colLetters);

        const colName = colIndexToSanitizedName[colIndex];

        if (colunasTexto.includes(colName)) {
            if (cellObj.t === "n") {
                // Converte número para string sem .0
                cellObj.v = String(parseInt(cellObj.v, 10));
                cellObj.t = "s";
            } else if (cellObj.v != null) {
                cellObj.v = String(cellObj.v);
                cellObj.t = "s";
            }
        }
        // Se a coluna for uma data e o valor for numérico
        if (colunasData.includes(colName) && cellObj.t === "n") {
            cellObj.v = excelSerialToDate(cellObj.v);
            cellObj.t = "s";
        }
    });

    const rawData = xlsx.utils.sheet_to_json(sheet, {
        defval: "", // mantém célula vazia como string vazia
    });

    if (!rawData.length) {
        console.warn(`⚠️  Planilha '${sheetName}' está vazia. Pulando...`);
        return;
    }

    const tableName = sheetName.replace(/\s+/g, "_");

    const originalColumns = Object.keys(rawData[0]);
    const sanitizedColumns = getUniqueColumnNames(originalColumns);
    const columnDefs = sanitizedColumns
        .map((col) => `"${col}" TEXT`)
        .join(", ");

    // Cria a tabela se não existir
    const createSQL = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs});`;
    db.prepare(createSQL).run();

    // Apaga os dados antigos
    db.prepare(`DELETE FROM "${tableName}"`).run();

    // Prepara o insert
    const insertSQL = `INSERT INTO "${tableName}" (${sanitizedColumns
        .map((c) => `"${c}"`)
        .join(", ")}) VALUES (${sanitizedColumns
        .map((c) => `@${c}`)
        .join(", ")})`;
    const insertStmt = db.prepare(insertSQL);

    // Adapta os dados para os nomes sanitizados
    const sanitizedData = rawData.map((row) => {
        const sanitizedRow = {};
        originalColumns.forEach((original, i) => {
            sanitizedRow[sanitizedColumns[i]] = row[original];
        });
        return sanitizedRow;
    });

    const insertMany = db.transaction((rows) => {
        for (const row of rows) {
            insertStmt.run(row);
        }
    });

    insertMany(sanitizedData);

    console.log(
        `✅ Tabela '${tableName}' atualizada com ${sanitizedData.length} registros.`
    );
});

db.close();
console.log("Script finalizado -----------------------------------------");
