import { validarDescricaoPorGrupo } from "../utils/validacoes.js";
import { TabelaInterativa } from "../componentes/TabelaInterativa.js";

let tabela;

export function initProdutosPage() {
    const tbody = document.querySelector("#table-body");
    const atualizarBtn = document.querySelector("#atualizar-btn");
    const pesquisarBtn = document.querySelector(
        "#filters button:nth-of-type(1)"
    );
    const limparBtn = document.querySelector("#filters button:nth-of-type(2)");

    const inputProduto = document.querySelector("input[name='produto']");
    const inputDescricao = document.querySelector("input[name='descricao']");
    const inputGrupo = document.querySelector("input[name='grupo']");

    const detalhesBtn = document.querySelector("#detalhes-btn");

    if (!tbody || !atualizarBtn) {
        console.warn("Elementos da página de produtos não encontrados.");
        return;
    }

    // Clique no botão Detalhes
    detalhesBtn.addEventListener("click", async () => {
        const tr = tabela?.linhaSelecionada;
        if (!tr) {
            alert("Selecione um produto na tabela.");
            return;
        }

        const codigo = tr.cells[0]?.textContent?.trim();
        if (!codigo) return;

        try {
            const produto = await window.api.janela.getProdutoDetalhado(codigo);
            mostrarDetalhesProduto(produto);
        } catch (err) {
            console.error("Erro ao carregar detalhes do produto:", err);
        }
    });

    // Duplo clique na tabela
    tbody.addEventListener("dblclick", async (event) => {
        const tr = event.target.closest("tr");
        if (!tr) return;

        tabela._selecionarLinha(tr); // força sincronização com a instância
        const codigo = tr.cells[0]?.textContent?.trim();
        if (!codigo) return;

        try {
            const produto = await window.api.janela.getProdutoDetalhado(codigo);
            mostrarDetalhesProduto(produto);
        } catch (err) {
            console.error("Erro ao carregar detalhes do produto:", err);
        }
    });

    function mostrarDetalhesProduto(produto) {
        const msg = `
                    Produto: ${produto.codProduto}
                    Descrição: ${produto.descricao}
                    Grupo: ${produto.grupo}

                    Estoque: ${produto.estoque.length} registros
                    Fornecedores: ${produto.fornecedores.length} registros
                    Notas Fiscais: ${produto.notasFiscais.length} registros
                    Onde Usado: ${produto.ondeUsado.length} registros
        `;

        alert(msg); // substitua por modal se desejar
    }

    atualizarBtn.addEventListener("click", carregarTabela);
    pesquisarBtn.addEventListener("click", aplicarFiltros);
    limparBtn.addEventListener("click", () => {
        inputProduto.value = "";
        inputDescricao.value = "";
        inputGrupo.value = "";
        carregarTabela();
    });

    async function carregarTabela() {
        try {
            const produtos = await window.api.janela.getProdutos();
            preencherTabela(produtos);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
        }
    }

    async function aplicarFiltros() {
        const filtros = {
            produto: inputProduto.value.trim(),
            descricao: inputDescricao.value.trim(),
            grupo: inputGrupo.value.trim(),
        };

        try {
            const produtos = await window.api.janela.filtrarProdutos(filtros);
            preencherTabela(produtos);
        } catch (err) {
            console.error("Erro ao filtrar produtos:", err);
        }
    }

    function preencherTabela(produtos) {
        tbody.innerHTML = "";
        for (const produto of produtos) {
            const tr = document.createElement("tr");

            const temErro = !validarDescricaoPorGrupo(
                produto.Descricao,
                produto.Grupo
            );

            if (temErro) {
                tr.classList.add("erro-descricao");
            }

            tr.innerHTML = `
                <td>${produto.Codigo}</td>
                <td>${produto.Descricao}</td>
                <td>${produto.Grupo}</td>
            `;

            tbody.appendChild(tr);
        }
    }

    tabela = new TabelaInterativa("#table-body", {
        onRowClick: (tr, index) => {
            // console.log("Linha clicada:", index);
        },
    });

    carregarTabela();
}
