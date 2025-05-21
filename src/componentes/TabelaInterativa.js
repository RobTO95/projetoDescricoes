export class TabelaInterativa {
    constructor(tbodySelector, { onRowClick = null } = {}) {
        this.tbody = document.querySelector(tbodySelector);
        this.onRowClick = onRowClick;
        this.selectedIndex = -1;
        this.linhaSelecionada = null; // ✅ nova propriedade

        if (!this.tbody) {
            console.warn(
                `TabelaInterativa: tbody '${tbodySelector}' não encontrado.`
            );
            return;
        }

        this._bindEvents();
    }

    _bindEvents() {
        this.tbody.addEventListener("click", (event) => {
            const tr = event.target.closest("tr");
            if (tr) this._selecionarLinha(tr);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                this._navegarComSetas(event.key === "ArrowDown" ? 1 : -1);
            }
        });
    }

    _selecionarLinha(tr) {
        this.tbody
            .querySelectorAll(".selected-item-table")
            .forEach((row) => row.classList.remove("selected-item-table"));

        tr.classList.add("selected-item-table");

        this.selectedIndex = [...this.tbody.rows].indexOf(tr);
        this.linhaSelecionada = tr; // ✅ atualiza a propriedade

        if (this.onRowClick) this.onRowClick(tr, this.selectedIndex);
    }

    _navegarComSetas(direcao) {
        const rows = Array.from(this.tbody.rows);
        if (!rows.length) return;

        this.selectedIndex = Math.min(
            rows.length - 1,
            Math.max(0, this.selectedIndex + direcao)
        );

        const tr = rows[this.selectedIndex];
        this._selecionarLinha(tr);
        tr.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
        });
    }

    limparSelecao() {
        this.tbody
            .querySelectorAll(".selected-item-table")
            .forEach((row) => row.classList.remove("selected-item-table"));

        this.selectedIndex = -1;
        this.linhaSelecionada = null; // ✅ limpa a seleção
    }
}
