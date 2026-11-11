import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    push,
    get,
    update,
    remove,
    child
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { auth, db } from "./firebase.js";

// ============================================================
// ARRAY PRINCIPAL
// ============================================================

let produtos = [];

// ============================================================
// ELEMENTOS
// ============================================================

const arquivoExcel = document.getElementById("arquivoExcel");

const tabelaProdutos = document.getElementById("tabelaProdutos");

const SelectCidade = document.getElementById('SelectCidade')

const contador = document.getElementById("contador");

const registrosExibidos =
    document.getElementById("registrosExibidos");

const folhasEncontradas =
    document.getElementById("folhasEncontradas");

const mensagemVazia =
    document.getElementById("mensagemVazia");

const pesquisa =
    document.getElementById("pesquisa");

const filtroFolha =
    document.getElementById("filtroFolha");

const btnLimpar =
    document.getElementById("btnLimpar");

const btnEnviarPedidoSeparacao = document.getElementById('btnEnviarPedidoSeparacao')


// ============================================================
// MARCAS
// ============================================================

const marcasExterno = [
    "CONCREBOX",
    "IRMAOS CORSO",
    "FORTLEV",
    "CORSO"
];

const marcasGalpao2 = [
    "COSTA VICENTE",
    "COZIMAX",
    "GHEL PLUS",
    "LA GRANITOS",
    "LUX TELHAS",
    "AGATA",
    "BOTAFOGO",
    "RORATO",
    "PERFIL LIDER",
    "DALKA",
    "VOTORANTIM",
    "BAKOF",
    "AMANCO"
];

const marcasTubos = [
    "KRONA",
    "MAXTUBOS",
    "UNITUBOS",
    "MADEX",
    "MXTUBOS"
];

const marcasDiversos = [
    "ADTEX",
    "ALUAN",
    "APOLOPLAST",
    "BOEING",
    "BOTAFOGO",
    "BRASFORMA",
    "BRASILIT",
    "CORTAG",
    "DECA",
    "FIMAP",
    "GALO",
    "GRIFT",
    "HYDRA",
    "ILUMI",
    "IMARC",
    "INFINITY",
    "JACUZZI",
    "KARCHER",
    "LORENZETTI",
    "MADPORTAS",
    "MAKITA",
    "MONTANA",
    "MOR",
    "NEGRAO",
    "PADRE BENTO",
    "PORTAL RJ",
    "SAO RAFAEL",
    "STECK",
    "TAF",
    "TECNOPRADO",
    "TRAMONTINA",
    "TRON",
    "UNIPEL-NIKI",
    "VENTISOL",
    "VONDER",
    "BLUMENAU",
    "CELITE",
    "DURATEX",
    "NOELI",
    "MBO",
    "STARRET",
    "DIVERSOS",
    "GRIFIT",
    "ITAP",
    "PICCOLI",
    "KANAFLEX",
    "SOMAR",
    "KOHLER",
    "RAMADA",
    "MULTIVISAO",
    "MERGEN",
    "BLACK&DECKER",
    "IPUMIRIM",
    "FORTHPLAS",
    "3M",
    "CANAL"
];

const marcasValidade = [
    "CORAL",
    "CRISAGUA",
    "ELGIN",
    "GENCO",
    "HTH",
    "HYDRONORTH",
    "ITAQUA",
    "OTTO",
    "PORTOKOLL",
    "QUARTZOLIT",
    "SAO JOAO DISTR.",
    "SIKA",
    "SPARLACK",
    "SUVINIL",
    "VIAPOL",
    "WD 40",
    "WD40",
    "SHERWIN WILLIANS",
    "HIDROAZUL",
    "FUTURA"
];

const folhasDisponiveis = [
    "1",
    "1,1",
    "1,2",
    "2",
    "2,1",
    "2,2",
    "3",
    "3,1",
    "3,2",
    "4",
    "5",
    "5,1",
    "5,2",
    "6"
];




// ============================================================
// ENVIAR PEDIDO PARA SEPARÇÃO
// ============================================================
btnEnviarPedidoSeparacao.addEventListener('click', async () => {
    if (produtos.length == 0 || produtos == null) {
        alert('Não existe nenhum pedido na tabela')
    } else {
        if (SelectCidade.value == "") {
            alert("Selecione a cidade que fez o pedido")
        } else {
            const pedidosRef = ref(db, `pedidos`)
            const novoPedidoRef = push(pedidosRef);
            await set(novoPedidoRef, {
                loja: SelectCidade.value,
                status: "aguardar",
                conferencia: "aguardar",
                autorizado: false,
                pedido: produtos,
                aberto: true,
                criadoEm: new Date().toISOString()
            })

            location.href = "gerenciarSeparacao.html"
        }
    }
})



// ============================================================
// DESCOBRIR GRUPO
// ============================================================

function descobrirGrupo(marca) {

    const marcaUpper = String(marca || "")
        .toUpperCase()
        .trim();


    // IMPORTANTE:
    // A ordem precisa ser mantida igual à do Python.

    if (
        marcasValidade.some(
            item => marcaUpper.includes(item)
        )
    ) {
        return "validade";
    }


    if (
        marcasDiversos.some(
            item => marcaUpper.includes(item)
        )
    ) {
        return "diversos";
    }


    if (
        marcasGalpao2.some(
            item => marcaUpper.includes(item)
        )
    ) {
        return "galpao2";
    }


    if (
        marcasTubos.some(
            item => marcaUpper.includes(item)
        )
    ) {
        return "tubos";
    }


    if (
        marcasExterno.some(
            item => marcaUpper.includes(item)
        )
    ) {
        return "externo";
    }


    if (marcaUpper.includes("TIGRE")) {
        return "tigre";
    }


    return null;
}


// ============================================================
// CALCULAR FOLHA
// ============================================================

function calcularFolha(marca, local, descricao) {

    const descricaoUpper = String(descricao || "")
        .toUpperCase()
        .trim();

    // REGRA ESPECIAL:
    // Todo produto com 20KG na descrição vai para a folha 5,1

    console.log(descricaoUpper)
    if (descricaoUpper.includes("20KG") || descricaoUpper.includes("20Kg") || descricaoUpper.includes("20kg") || descricaoUpper.includes("GRAUTE")) {
        return "5,1";
    }

    const grupo = descobrirGrupo(marca);

    const localUpper = String(local || "")
        .toUpperCase()
        .trim();

    if (!grupo) {
        return "";
    }


    // ========================================================
    // VALIDADE
    // ========================================================

    if (grupo === "validade") {

        // GALPAO 4
        if (localUpper.includes("GALPAO 4")) {
            return "5,2";
        }

        // GALPAO / RUA7 / RUA07
        if (
            localUpper.includes("GALPAO") ||
            localUpper.includes("RUA7") ||
            localUpper.includes("RUA07")
        ) {
            return "5";
        }

        if (
            localUpper.includes("J09-N3") ||
            localUpper.includes("J10-N3")
        ) {
            return "1";
        }



        if (
            localUpper.includes("J01-N2") ||
            localUpper.includes("J02-N2") ||
            localUpper.includes("J03-N2") ||
            localUpper.includes("J04-N2") ||
            localUpper.includes("J05-N2") ||
            localUpper.includes("J07-N2") ||
            localUpper.includes("J08-N2") ||
            localUpper.includes("I06-N2") ||
            localUpper.includes("I07-N2") ||
            localUpper.includes("I08-N2") ||
            localUpper.includes("I16") ||
            localUpper.includes("I17-N2") ||
            localUpper.includes("I18-N2") ||
            localUpper.includes("I19-N2") ||
            localUpper.includes("I20-N2") ||
            localUpper.includes("I21-N2") ||
            localUpper.includes("F16") ||
            localUpper.includes("E16") ||
            localUpper.includes("E17-N2") ||
            localUpper.includes("E18-N2") ||
            localUpper.includes("E19-N2") ||
            localUpper.includes("E20-N2") ||
            localUpper.includes("E21-N2") ||
            localUpper.includes("E22-N2") ||
            localUpper.includes("F01-N2") ||
            localUpper.includes("F02-N2") ||
            localUpper.includes("F03-N2") ||
            localUpper.includes("F04-N2")
        ) {
            return "1,1";
        }

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "1";
        }

        // CIMENTO
        if (localUpper.includes("CIMENTO")) {
            return "5,1";
        }

        return "1,1";
    }


    // ========================================================
    // DIVERSOS
    // ========================================================

    if (grupo === "diversos") {

        // GALPAO 3 / EXTERNO
        if (
            localUpper.includes("GALPAO 3") ||
            localUpper.includes("EXTERNO") ||
            localUpper.includes("CIMENTO COLA")
        ) {
            return "5,1";
        }

        // GALPAO / RUA7 / RUA07
        if (
            localUpper.includes("GALPAO") ||
            localUpper.includes("RUA7") ||
            localUpper.includes("RUA07")
        ) {
            return "5";
        }

        for (let i = 0; i < 25; i++) {
            if (localUpper.includes(`M${i}-N2`)) {
                if (i !== 5 && i !== 6 && i !== 8) {
                    return "2,1";
                }
            } else if (localUpper.includes(`L${i}-N2`)) {
                return "2,1";
            }
        }

        if (
            localUpper.includes("H03-N2") ||
            localUpper.includes("H04-N2") ||
            localUpper.includes("H05-N2") ||
            localUpper.includes("H06-N2") ||
            localUpper.includes("H07-N2") ||
            localUpper.includes("H08-N2") ||
            localUpper.includes("H09-N2") ||
            localUpper.includes("H10-N2") ||
            localUpper.includes("H11-N2") ||
            localUpper.includes("H12-N2") ||
            localUpper.includes("H13-N2") ||
            localUpper.includes("H14-N2") ||
            localUpper.includes("H15-N2") ||
            localUpper.includes("H16-N2") ||
            localUpper.includes("H17-N2") ||
            localUpper.includes("H18-N2") ||
            localUpper.includes("H19-N2") ||
            localUpper.includes("H20-N2") ||
            localUpper.includes("H21-N2") ||
            localUpper.includes("H22-N2")
        ) {
            return "2,1";
        }

        if (
            localUpper.includes("C15") ||
            localUpper.includes("D16")
        ) {
            return "2,1";
        }

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "2";
        }

        // TUBO
        if (localUpper.includes("TUBO")) {
            return "4";
        }

        return "2,1";
    }


    // ========================================================
    // GALPAO 2
    // ========================================================

    if (grupo === "galpao2") {
        if (localUpper.includes("EXTERNO")) {
            return "5,2";
        }
        if (localUpper.includes("CIMENTO")) {
            return "5,1"
        }
        if (localUpper.includes("MEZANINO")) {
            return "5"
        }
        return "5";
    }


    // ========================================================
    // TUBOS
    // ========================================================

    if (grupo === "tubos") {

        if (marca === "KRONA") {
            if (localUpper.includes("RUA")) {
                return "2"
            } else {
                return "4"
            }
        }

        // GAVETA / GAV
        if (
            localUpper.includes("GAVETA") ||
            localUpper.includes("GAV")
        ) {
            return "5";
        }

        // TUBOS
        if (localUpper.includes("TUBOS")) {
            return "4";
        }

        // GALPAO 4
        if (localUpper.includes("GALPAO 4")) {
            return "4";
        }

        // GALPAO
        if (localUpper.includes("GALPAO")) {
            return "4";
        }

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "2";
        }

        return "4";
    }


    // ========================================================
    // EXTERNO
    // ========================================================

    if (grupo === "externo") {

        // IRMAOS CORSO possui regra específica
        if (
            marca === "IRMAOS CORSO"
        ) {
            return "5,2";
        }

        return "5,2";
    }


    // ========================================================
    // TIGRE
    // ========================================================

    if (grupo === "tigre") {

        // GAVETA
        if (localUpper.includes("GAVETA")) {
            return "5";
        }

        if (
            localUpper.includes("B14") ||
            localUpper.includes("A10")
        ) {
            return "3,1";
        }


        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "3";
        }

        // TUBO
        if (localUpper.includes("TUBO")) {
            return "4";
        }

        // GALPAO 4
        if (localUpper.includes("GALPAO 4")) {
            return "5,2";
        }

        // GALPAO
        if (localUpper.includes("GALPAO")) {
            return "5";
        }

        return "3,1";
    }


    return "";
}



// ============================================================
// LER ARQUIVO EXCEL
// ============================================================

arquivoExcel.addEventListener("change", function (event) {

    const arquivo = event.target.files[0];

    if (!arquivo) {

        return;

    }


    const leitor = new FileReader();


    leitor.onload = function (e) {

        try {

            const dados = new Uint8Array(
                e.target.result
            );


            const workbook = XLSX.read(
                dados,
                {
                    type: "array"
                }
            );


            // Primeira aba da planilha

            const nomeAba =
                workbook.SheetNames[0];


            const aba =
                workbook.Sheets[nomeAba];


            // Converte Excel para array

            const dadosExcel =
                XLSX.utils.sheet_to_json(
                    aba,
                    {
                        header: 1,
                        defval: ""
                    }
                );


            console.log(
                "Dados originais da planilha:",
                dadosExcel
            );


            importarDados(dadosExcel);


        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao ler a planilha."
            );

        }

    };


    leitor.readAsArrayBuffer(arquivo);

});


// ============================================================
// IMPORTAR DADOS
// ============================================================

function importarDados(dadosExcel) {

    produtos = [];
    let primeiraLinha = true
    dadosExcel.forEach((linha, index) => {

        // Ignora linha completamente vazia
        if (linha.every(valor => String(valor || "").trim() === "")) {
            return;
        }

        if (primeiraLinha) {
            // FAZ NADA
            primeiraLinha = false
        } else {
            const produto = {

                id: index + 1,

                // COLUNA A = PEDIDO
                pedido: String(linha[0] ?? "").trim(),

                // COLUNA C = CÓDIGO
                codigo: String(linha[2] ?? "").trim(),

                // COLUNA D = DESCRIÇÃO
                produto: String(linha[3] ?? "").trim(),

                descricao: String(linha[3] ?? "").trim(),

                // COLUNA F = IDENTIF
                identificacao: String(linha[5] ?? "").trim(),

                // COLUNA E = MARCA
                marca: String(linha[4] ?? "").trim(),

                // COLUNA G = LOCAL
                local: String(linha[6] ?? "").trim(),

                // COLUNA J = QUANT.
                atual: String(linha[9] ?? "").trim(),

                // COLUNA H = CÓDIGO DE BARRAS
                codigoBarras: String(linha[7] ?? "").trim(),

                // COLUNA I = UN
                unidade: String(linha[8] ?? "").trim(),

                // COLUNA K = DEVOL.
                devolucao: String(linha[10] ?? "").trim(),

                // COLUNA L = VALIDADE
                validade: String(linha[11] ?? "").trim(),

                // atributo para saber se o produto foi separado ou não
                separado: false,

                aguardandoSeparacao: true,

                conferido: false,

                impresso: false,

                lote: 1,

                folha: ""

            };


            // Calcula a folha
            produto.folha = calcularFolha(
                produto.marca,
                produto.local,
                produto.descricao
            );


            produtos.push(produto);

        }
    });


    console.log("Array final:", produtos);

    renderizarTabela(produtos);
}


// ============================================================
// PEGAR COLUNA
// ============================================================

function pegarColuna(linha, nomesPossiveis) {

    for (const nome of nomesPossiveis) {

        if (
            Object.prototype.hasOwnProperty.call(
                linha,
                nome
            )
        ) {

            return String(
                linha[nome] ?? ""
            ).trim();

        }

    }


    // Tentativa mais flexível:
    // ignora maiúsculas/minúsculas e acentos

    const chaveEncontrada =
        Object.keys(linha).find(chave => {

            return normalizarTexto(chave) ===
                normalizarTexto(nomesPossiveis[0]);

        });


    if (chaveEncontrada) {

        return String(
            linha[chaveEncontrada] ?? ""
        ).trim();

    }


    return "";
}


// ============================================================
// NORMALIZAR TEXTO
// ============================================================

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


// ============================================================
// RENDERIZAR TABELA
// ============================================================

function renderizarTabela(lista) {

    tabelaProdutos.innerHTML = "";


    if (lista.length === 0) {

        mensagemVazia.style.display = "block";

        atualizarInformacoes([]);

        return;

    }


    mensagemVazia.style.display = "none";


    lista.forEach(produto => {
        const numeroPedido = produto.pedido.split(" - ")[0];

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${escaparHTML(numeroPedido)}
            </td>

            <td>
                ${escaparHTML(produto.codigo)}
            </td>

            <td>
                ${escaparHTML(produto.descricao)}
            </td>

            <td>
                ${escaparHTML(produto.identificacao)}
            </td>

            <td>
                ${escaparHTML(produto.marca)}
            </td>

            <td>
                ${escaparHTML(produto.local)}
            </td>

            <td>
                ${escaparHTML(produto.atual)}
            </td>

            <td>

                    ${produto.folha

                ? `
                            <select
                                class="form-select form-select-sm fw-bold ${classeFolha(produto.folha)}"
                                id="Select${produto.id}"
                                style="min-width: 90px;"
                            >
                    
                                ${folhasDisponiveis.map(folha => `
                                    <option
                                        value="${folha}"
                                        ${produto.folha === folha ? "selected" : ""}
                                    >
                                        ${folha}
                                    </option>
                                `).join("")}
                                
                            </select>
                        `

                : `
                            <select
                                data-produto-id="${produto.id}"
                                class="form-select form-select-sm fw-bold ${classeFolha(produto.folha)}"
                                id="Select${produto.id}"
                                style="min-width: 90px;"
                            >
                                
                                <option value="" selected>
                                    Escolher
                                </option>
                                
                                ${folhasDisponiveis.map(folha => `
                                    <option value="${folha}">
                                        ${folha}
                                    </option>
                                `).join("")}
                                
                            </select>
                        `
            }

            </td>

        `;

        tr.querySelector(`#Select${produto.id}`).addEventListener('change', () => {
            alterarFolha(produto.id, tr.querySelector(`#Select${produto.id}`).value)
        })

        tabelaProdutos.appendChild(tr);

    });


    atualizarInformacoes(lista);

}


// ============================================================
// ATUALIZAR INFORMAÇÕES
// ============================================================

function atualizarInformacoes(lista) {

    contador.textContent =
        `${produtos.length} registro${produtos.length !== 1 ? "s" : ""}`;


    registrosExibidos.textContent =
        lista.length;


    const folhas = new Set();


    lista.forEach(produto => {

        if (produto.folha) {

            folhas.add(produto.folha);

        }

    });


    folhasEncontradas.textContent =
        folhas.size;

}


// ============================================================
// PESQUISA
// ============================================================

pesquisa.addEventListener(
    "input",
    aplicarFiltros
);


filtroFolha.addEventListener(
    "change",
    aplicarFiltros
);


function aplicarFiltros() {

    const termo =
        normalizarTexto(
            pesquisa.value
        );


    const folhaSelecionada =
        filtroFolha.value;


    const resultado =
        produtos.filter(produto => {

            const textoProduto = [

                produto.pedido,
                produto.codigo,
                produto.produto,
                produto.descricao,
                produto.identificacao,
                produto.marca,
                produto.local,
                produto.atual,
                produto.folha

            ].join(" ").toLowerCase();


            const correspondePesquisa =
                textoProduto.includes(termo);


            const correspondeFolha =
                folhaSelecionada === "" ||
                produto.folha === folhaSelecionada;


            return (
                correspondePesquisa &&
                correspondeFolha
            );

        });


    renderizarTabela(resultado);

}


// ============================================================
// LIMPAR
// ============================================================

// btnLimpar.addEventListener(
//     "click",
//     function () {
//         if (confirm('Tem certeza que deseja limpar a tabela?')) {
//             produtos = [];

//             pesquisa.value = "";

//             filtroFolha.value = "";

//             tabelaProdutos.innerHTML = "";

//             mensagemVazia.style.display =
//                 "block";

//             mensagemVazia.textContent =
//                 "Importe uma planilha para começar.";

//             atualizarInformacoes([]);

//             arquivoExcel.value = "";
//         }
//     }
// );


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ============================================================
// COR DA FOLHA
// ============================================================

function classeFolha(folha) {

    switch (String(folha).trim()) {

        case "1":
        case "1,1":
            return "bg-danger text-white";

        case "2":
        case "2,1":
            return "bg-success text-white";

        case "3":
        case "3,1":
            return "bg-warning text-dark";

        case "4":
            return "bg-secondary text-white";

        case "5":
        case "5,1":
            return "bg-primary text-white";

        default:
            return "bg-light text-dark";
    }
}

// ============================================================
// ALTERAR FOLHA MANUALMENTE
// ============================================================

function alterarFolha(id, novaFolha) {

    const produto = produtos.find(
        item => item.id === id
    );

    if (!produto) {
        return;
    }

    produto.folha = novaFolha;

    const select = document.querySelector(
        `select[data-produto-id="${id}"]`
    );

    if (select) {

        select.className =
            `form-select form-select-sm fw-bold ${classeFolha(novaFolha)}`;

        select.value = novaFolha;
    }

    atualizarInformacoes(
        produtos.filter(produto => {

            const termo =
                normalizarTexto(pesquisa.value);

            const folhaSelecionada =
                filtroFolha.value;

            const textoProduto = [

                produto.pedido,
                produto.codigo,
                produto.produto,
                produto.descricao,
                produto.identificacao,
                produto.marca,
                produto.local,
                produto.atual,
                produto.folha

            ].join(" ").toLowerCase();

            return (
                textoProduto.includes(termo) &&
                (
                    folhaSelecionada === "" ||
                    produto.folha === folhaSelecionada
                )
            );
        })
    );
}

// ============================================================
// COR DA LOJA
// ============================================================

SelectCidade.addEventListener('change', () => {

    corLoja(SelectCidade)

})

function corLoja(select) {
    if (select.value == "caraguatatuba") {
        select.classList.remove('bg-primary')
        select.classList.remove('bg-info')
        select.classList.remove('bg-warning')
        select.classList.remove('text-white')
        select.classList.add("form-select")
        select.classList.add("text-center")
        select.classList.add("bg-danger")
        select.classList.add("text-white")

    } else if (select.value == "SaoSeba") {
        select.classList.remove('bg-primary')
        select.classList.remove('bg-info')
        select.classList.remove('bg-danger')
        select.classList.remove('text-white')
        select.classList.add("form-select")
        select.classList.add("text-center")
        select.classList.add("text-black")
        select.classList.add("bg-warning")

    } else if (select.value == "maranduba") {
        select.classList.remove('bg-warning')
        select.classList.remove('bg-info')
        select.classList.remove('bg-danger')
        select.classList.remove('text-white')
        select.classList.add("form-select")
        select.classList.add("text-center")
        select.classList.add("bg-primary")
        select.classList.add("text-white")
    } else if (select.value == "parafusos") {
        select.classList.remove('bg-primary')
        select.classList.remove('bg-danger')
        select.classList.remove('bg-warning')
        select.classList.remove('text-white')
        select.classList.add("form-select")
        select.classList.add("text-center")
        select.classList.add("bg-info")

    } else {
        select.classList.remove('bg-primary')
        select.classList.remove('bg-danger')
        select.classList.remove('bg-warning')
        select.classList.remove('bg-info')
        select.classList.remove('text-white')
        select.classList.add("form-select")
        select.classList.add("text-center")
    }
}
