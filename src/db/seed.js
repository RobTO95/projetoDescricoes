const db = require("./db");

// Dados para seed
const acoes = [
    { id: 1, acao: "Alterar" },
    { id: 2, acao: "Bloquear" },
    { id: 3, acao: "Eliminar" },
    { id: 4, acao: "Realocar" },
];

const campos = [
    { id: 1, campo: "Descrição", tabela: "baseProdutos", coluna: "Descricao" },
    { id: 2, campo: "Código", tabela: "baseProdutos", coluna: "Codigo" },
    { id: 3, campo: "Grupo", tabela: "baseProdutos", coluna: "Grupo" },
    {
        id: 4,
        campo: "Blq de tela",
        tabela: "baseProdutos",
        coluna: "Blq_de_Tela",
    },
];

const status = [
    { id: 1, status: "Pendente" },
    { id: 2, status: "Executado" },
];

// Função para inserir os dados se ainda não existirem
function seedTable(tableName, rows, keyColumn = "id") {
    const exists = db
        .prepare(`SELECT COUNT(*) as total FROM ${tableName}`)
        .get();
    if (exists.total === 0) {
        const keys = Object.keys(rows[0]);
        const placeholders = keys.map((k) => `@${k}`).join(", ");
        const stmt = db.prepare(
            `INSERT INTO ${tableName} (${keys.join(
                ", "
            )}) VALUES (${placeholders})`
        );

        const insertMany = db.transaction((rows) => {
            for (const row of rows) stmt.run(row);
        });

        insertMany(rows);
        console.log(`✅ ${tableName} populada com sucesso.`);
    } else {
        console.log(
            `ℹ️  ${tableName} já contém dados. Nenhuma inserção realizada.`
        );
    }
}

// Executa o seed
seedTable("tabAcao", acoes);
seedTable("tabCampo", campos);
seedTable("tabStatus", status);
