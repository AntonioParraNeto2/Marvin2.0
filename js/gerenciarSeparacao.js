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
// MODAIS
// ============================================================

const modalCentralPedido = new bootstrap.Modal(document.getElementById('modalCentralPedido'))
const modalMostrarPedido = new bootstrap.Modal(document.getElementById('modalMostrarPedido'))
const modalMostrarPedidoFechado = new bootstrap.Modal(document.getElementById('modalMostrarPedidoFechado'))
const modalConferirQtd = new bootstrap.Modal(document.getElementById('modalConferirQtd'))
const modalSelecionarMarcasConf = new bootstrap.Modal(document.getElementById('modalSelecionarMarcasConf'))



// ============================================================
// ELEMENTOS
// ============================================================

// ============================================================
// ELEMENTOS DO MODAL
// ============================================================

const modalTitleMostrarPedido =
    document.getElementById("modalTitleMostrarPedido");

const modalLojaMostrarPedido =
    document.getElementById("modalLojaMostrarPedido");

const modalDataMostrarPedido =
    document.getElementById("modalDataMostrarPedido");

const tabelaMostrarPedido =
    document.getElementById("tabelaMostrarPedido");

const tabelaMostrarPedidoFechado =
    document.getElementById("tabelaMostrarPedidoFechado");

const modalTitleMostrarPedidoFechado =
    document.getElementById("modalTitleMostrarPedidoFechado");

const modalLojaMostrarPedidoFechado =
    document.getElementById("modalLojaMostrarPedidoFechado");

const modalDataMostrarPedidoFechado =
    document.getElementById("modalDataMostrarPedidoFechado");

const totalProdutosPedido =
    document.getElementById("totalProdutosPedido");

const totalSeparadosPedido =
    document.getElementById("totalSeparadosPedido");

const totalPendentesPedido =
    document.getElementById("totalPendentesPedido");

const totalFolhasPedido =
    document.getElementById("totalFolhasPedido");

const btnImprimirPedido =
    document.getElementById("btnImprimirPedido");


const btnImprimirFolha4 =
    document.getElementById("btnImprimirFolha4");


const btnImprimirFolhaConf =
    document.getElementById("btnImprimirFolhaConf");


const btnCompararQtd = document.getElementById('btnCompararQtd')

const btnAddProduto = document.getElementById('btnAddProduto')

const tabelaPedidos = document.getElementById('tabelaPedidos')

const listaMarcasConf = document.getElementById("listaMarcasConf");
const chkTodasMarcasConf = document.getElementById("chkTodasMarcasConf");
const btnConfirmarMarcasConf = document.getElementById("btnConfirmarMarcasConf");


let pedidoAtualParaImprimir = null;

let produtosLoteVisualizado = null;

// Produtos completos do pedido atualmente aberto
let produtosPedido = [];

// ID do pedido atualmente aberto
let pedidoAtualId = null;

// Lote atualmente sendo visualizado no modal
let loteAtualVisualizado = null;

let salvamentoQuantidadePendente = Promise.resolve();


// ============================================================
// FILTRO DE FOLHAS
// ============================================================

const filtroFolhaPedido =
    document.getElementById("filtroFolhaPedido");

const filtroStatusPedido =
    document.getElementById("filtroStatusPedido");

filtroFolhaPedido.addEventListener(
    "change",
    aplicarFiltrosPedido
);
filtroStatusPedido.addEventListener(
    "change",
    aplicarFiltrosPedido
);




await carregarPedidos()

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
    "MULTIVISÇO",
    "MERGEN",
    "BLACK&DECKER",
    "IPUMIRIM"
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
// TODOS OS PRODUTOS EM SEPARAÇÃO
// ============================================================

btnTodosEmSeparacao.addEventListener(
    "click",
    async function () {

        const confirmar =
            confirm(
                "Deseja colocar TODOS os produtos deste pedido em 'Em separação'?"
            );

        if (!confirmar) {
            return;
        }

        await alterarStatusTodos(
            pedidoAtualParaImprimir.id,
            "Em separação"
        );

    }
);


// ============================================================
// TODOS OS PRODUTOS SEPARADOS
// ============================================================

btnTodosSeparados.addEventListener(
    "click",
    async function () {

        const confirmar =
            confirm(
                "Deseja colocar TODOS os produtos deste pedido como 'Separado'?"
            );

        if (!confirmar) {
            return;
        }

        await alterarStatusTodos(
            pedidoAtualParaImprimir.id,
            "Separado"
        );

    }
);


// ============================================================
// TODOS OS PRODUTOS CONFERIDOS
// ============================================================

btnTodosConferidos.addEventListener(
    "click",
    async function () {

        const confirmar =
            confirm(
                "Deseja colocar TODOS os produtos deste pedido como 'Conferido'?"
            );

        if (!confirmar) {
            return;
        }

        await alterarStatusTodos(
            pedidoAtualParaImprimir.id,
            "Conferido"
        );

    }
);



btnImprimirPedido.addEventListener("click", () => {

    if (!pedidoAtualParaImprimir) {
        alert("Nenhum pedido aberto.");
        return;
    }

    // Se um lote foi selecionado, imprime somente ele.
    // Caso contrário, imprime todos os produtos do pedido.
    const produtosParaImprimir =
        produtosLoteVisualizado !== null
            ? produtosLoteVisualizado
            : produtosPedido;

    if (produtosParaImprimir.length === 0) {
        alert("Este lote não possui produtos para imprimir.");
        return;
    }

    imprimirFolhas(
        pedidoAtualParaImprimir.id,
        pedidoAtualParaImprimir.dados,
        produtosParaImprimir
    );

});

btnImprimirFolhaConf.addEventListener("click", () => {
    if (!pedidoAtualParaImprimir) {
        alert("Nenhum pedido aberto.");
        return;
    }
    modalCentralPedido.hide()
    mostrarMarcasDisponiveis(pedidoAtualParaImprimir.dados);
    modalSelecionarMarcasConf.show();
});

btnConfirmarMarcasConf.addEventListener("click", () => {
    if (!pedidoAtualParaImprimir) {
        alert("Nenhum pedido aberto.");
        return;
    }

    const marcasSelecionadas = [
        ...listaMarcasConf.querySelectorAll(
            ".marca-conf-checkbox:checked"
        )
    ].map(checkbox => checkbox.value);

    if (marcasSelecionadas.length === 0) {
        alert("Selecione pelo menos uma marca para imprimir.");
        return;
    }

    imprimirConferencia(
        pedidoAtualParaImprimir.id,
        pedidoAtualParaImprimir.dados,
        marcasSelecionadas
    );

    modalSelecionarMarcasConf.hide();
});

btnImprimirFolha4.addEventListener("click", () => {
    if (!pedidoAtualParaImprimir) {
        alert("Nenhum pedido aberto.");
        return;
    }

    ImprimirFolha4(
        pedidoAtualParaImprimir.id,
        pedidoAtualParaImprimir.dados
    )
})

btnCompararQtd.addEventListener("change", async function (event) {

    const arquivo = event.target.files[0];

    if (!arquivo) {

        return;

    }


    const leitor = new FileReader();


    leitor.onload = async function (e) {

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


            await importarDados(dadosExcel);


        } catch (erro) {
            console.error(erro);
            alert(
                "Erro ao ler a planilha."
            );
        }
    };


    leitor.readAsArrayBuffer(arquivo);

});

btnAddProduto.addEventListener('change', (event) => {

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


            importarDadosAddPedido(dadosExcel);


        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao ler a planilha."
            );

        }

    };


    leitor.readAsArrayBuffer(arquivo);

})




function mostrarMarcasDisponiveis(pedido) {
    listaMarcasConf.replaceChildren();

    const produtos = Array.isArray(pedido?.pedido)
        ? pedido.pedido
        : Object.values(pedido?.pedido || {});

    // Considera somente produtos que podem entrar na folha de conferência.
    const marcas = [...new Set(
        produtos
            .filter(produto => {
                const folha = String(produto.folha ?? "").trim();
                const marca = String(produto.marca ?? "").trim();

                return folha !== "" && folha !== "4" && marca !== "";
            })
            .map(produto => String(produto.marca).trim())
    )].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
    );

    if (marcas.length === 0) {
        listaMarcasConf.textContent =
            "Nenhuma marca com produtos disponíveis para conferência.";
        chkTodasMarcasConf.checked = false;
        chkTodasMarcasConf.disabled = true;
        return;
    }

    chkTodasMarcasConf.disabled = false;
    chkTodasMarcasConf.checked = true;

    marcas.forEach((marca, indice) => {
        const wrapper = document.createElement("div");
        wrapper.className = "form-check";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input marca-conf-checkbox";
        checkbox.id = `marcaConf${indice}`;
        checkbox.value = marca;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = checkbox.id;
        label.textContent = marca;

        wrapper.append(checkbox, label);
        listaMarcasConf.appendChild(wrapper);
    });
}

// Marcar ou desmarcar todas as marcas
chkTodasMarcasConf.addEventListener("change", () => {
    document.querySelectorAll(".marca-conf-checkbox").forEach(checkbox => {
        checkbox.checked = chkTodasMarcasConf.checked;
    });
});

// Atualizar o estado de "Selecionar todas" ao alterar marcas individuais
listaMarcasConf.addEventListener("change", () => {
    const checkboxes = [
        ...listaMarcasConf.querySelectorAll(".marca-conf-checkbox")
    ];

    chkTodasMarcasConf.checked =
        checkboxes.length > 0 &&
        checkboxes.every(checkbox => checkbox.checked);
});


async function importarDadosAddPedido(dadosExcel) {
    try {
        const novosProdutos = [];
        let primeiraLinha = true;

        // 1. Ler os produtos da planilha
        dadosExcel.forEach(linha => {
            // Ignorar linhas vazias
            if (
                linha.every(
                    valor => String(valor ?? "").trim() === ""
                )
            ) {
                return;
            }

            // Ignorar cabeçalho
            if (primeiraLinha) {
                primeiraLinha = false;
                return;
            }

            const produto = {
                id: null,
                pedido: String(linha[0] ?? "").trim(),
                codigo: String(linha[2] ?? "").trim(),
                produto: String(linha[3] ?? "").trim(),
                descricao: String(linha[3] ?? "").trim(),
                identificacao: String(linha[5] ?? "").trim(),
                marca: String(linha[4] ?? "").trim(),
                local: String(linha[6] ?? "").trim(),
                atual: String(linha[9] ?? "").trim(),
                codigoBarras: String(linha[7] ?? "").trim(),
                unidade: String(linha[8] ?? "").trim(),
                devolucao: String(linha[10] ?? "").trim(),
                validade: String(linha[11] ?? "").trim(),

                separado: false,
                aguardandoSeparacao: true,
                conferido: false,
                impresso: false,

                folha: ""
            };

            // Manter o cálculo original das folhas
            produto.folha = calcularFolha(
                produto.marca,
                produto.local,
                produto.descricao
            );

            novosProdutos.push(produto);
        });

        if (novosProdutos.length === 0) {
            alert("Nenhum produto válido foi encontrado na planilha.");
            return;
        }

        // 2. Buscar os produtos já existentes no pedido
        const pedidoRef = ref(
            db,
            `pedidos/${pedidoAtualId}/pedido`
        );

        const snapshot = await get(pedidoRef);

        let produtosExistentes = [];

        if (snapshot.exists()) {
            const dadosExistentes = snapshot.val();

            produtosExistentes = Array.isArray(dadosExistentes)
                ? dadosExistentes
                : Object.values(dadosExistentes);
        }
        // ========================================================
        // DESCOBRIR O PRÓXIMO LOTE
        // ========================================================

        const maiorLote =
            produtosExistentes.reduce(
                (maior, produto) => {

                    const lote =
                        Number(produto.lote ?? 1);

                    return lote > maior
                        ? lote
                        : maior;

                },
                1
            );

        const novoLote =
            maiorLote + 1;

        // 3. Atribuir IDs aos novos produtos e adicioná-los
        let proximoIndice = produtosExistentes.length;

        novosProdutos.forEach(produto => {

            produto.id = proximoIndice + 1;

            produto.lote = novoLote;

            produto.impresso = false;

            proximoIndice++;

            produtosExistentes.push(produto);

        });

        // 4. Salvar o pedido atualizado no Firebase
        await set(pedidoRef, produtosExistentes);

        console.log("Produtos adicionados:", novosProdutos);

        // 5. Buscar os dados completos do pedido para o cabeçalho
        const pedidoCompletoRef = ref(
            db,
            `pedidos/${pedidoAtualId}`
        );

        const pedidoSnapshot = await get(pedidoCompletoRef);

        if (!pedidoSnapshot.exists()) {
            alert(
                "Os produtos foram salvos, mas não foi possível " +
                "encontrar os dados do pedido para imprimir."
            );
            return;
        }

        const pedidoCompleto = pedidoSnapshot.val();

        // 6. Imprimir somente os produtos desta importação
        // que continuam aguardando separação
        const produtosDaImportacao = novosProdutos.filter(
            produto =>
                produto.separado !== true &&
                produto.aguardandoSeparacao !== false
        );

        if (produtosDaImportacao.length === 0) {
            alert("Não há produtos aguardando separação para imprimir.");
            return;
        }

        // imprimirFolhas(
        //     pedidoAtualId,
        //     pedidoCompleto,
        //     produtosDaImportacao
        // );

        // Não redirecionar aqui: a impressão deve abrir primeiro.
        mostrarCentralPedido(pedidoAtualId)

    } catch (erro) {
        console.error(
            "Erro ao adicionar produtos ao pedido:",
            erro
        );

        alert(
            "Não foi possível adicionar os produtos ao pedido. " +
            "Verifique o console para mais detalhes."
        );
    }
}


function calcularFolha(marca, local, descricao) {
    const descricaoUpper = String(descricao || "")
        .toUpperCase()
        .trim();

    // REGRA ESPECIAL:
    // Todo produto com 20KG na descrição vai para a folha 5,1

    console.log(descricaoUpper)
    if (descricaoUpper.includes("20KG") || descricaoUpper.includes("20Kg") || descricaoUpper.includes("20kg")) {
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

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "2,2";
        }

        // TUBO
        if (localUpper.includes("TUBO")) {
            return "4,1";
        }

        return "2,2";
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

        return "5";
    }


    // ========================================================
    // TUBOS
    // ========================================================

    if (grupo === "tubos") {

        if (marca === "KRONA") {
            if (localUpper.includes("RUA")) {
                return "2,2"
            } else {
                return "4,1"
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
            return "4,1";
        }

        // GALPAO 4
        if (localUpper.includes("GALPAO 4")) {
            return "4,1";
        }

        // GALPAO
        if (localUpper.includes("GALPAO")) {
            return "4,1";
        }

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "2,2";
        }

        return "4,1";
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

        // N1 / N2
        if (
            localUpper.includes("N1") ||
            localUpper.includes("N2")
        ) {
            return "3,2";
        }

        // TUBO
        if (localUpper.includes("TUBO")) {
            return "4,1";
        }

        // GALPAO 4
        if (localUpper.includes("GALPAO 4")) {
            return "5,2";
        }

        // GALPAO
        if (localUpper.includes("GALPAO")) {
            return "5";
        }

        return "3,2";
    }


    return "";
}

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


async function importarDados(dadosExcel) {

    await salvamentoQuantidadePendente;

    let produtos = [];
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
            };

            produtos.push(produto);
        }
    });

    console.log("Array final:", produtos);


    const pedidoRef = ref(db, `pedidos/${pedidoAtualId}/pedido`)
    const snapshot = await get(pedidoRef)

    if (!snapshot.exists()) {
        return;
    }

    const pedidoCompleto = snapshot.val();

    let produtoDiferentes = []
    console.log("PEDIDO ABERTO: ", pedidoCompleto)
    pedidoCompleto.forEach(produtoSis => {
        produtos.forEach(produto => {
            if (produto.codigo == produtoSis.codigo) {
                if (produto.atual != produtoSis.atual) {
                    console.log(produto.atual)
                    console.log(produtoSis.atual)
                    produtoDiferentes.push({
                        codigo: produtoSis.codigo,
                        descricao: produtoSis.descricao,
                        qtdPlanilha: produto.atual,
                        qtdSis: produtoSis.atual
                    })
                }
            }
        });
    });
    mostrarProdDiferentes(produtoDiferentes)
    modalConferirQtd.show()
}

function mostrarProdDiferentes(produtosDiferentes = []) {
    let tbodyProdDiferentes = document.getElementById('tbodyProdDiferentes')
    tbodyProdDiferentes.innerHTML = ""

    if (produtosDiferentes.length === 0) {
        tbodyProdDiferentes.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">Todas as quantidades estão corretas</td>
            </tr>
        `
        return
    }

    produtosDiferentes.forEach(produto => {
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td>
                ${produto.codigo}
            </td>
            <td>
                ${produto.descricao}
            </td>
            <td>
                ${produto.qtdPlanilha}
            </td>
            <td>
                ${produto.qtdSis}
            </td>
        `
        tbodyProdDiferentes.appendChild(tr)
    });
}

async function carregarPedidos() {
    const pedidosRef = ref(db, `pedidos`)
    const snapshot = await get(pedidosRef)

    if (!snapshot.exists()) return;

    tabelaPedidos.innerHTML = ''

    Object.entries(snapshot.val())
        .sort(([, pedidoA], [, pedidoB]) => {
            // Pedidos abertos primeiro
            return Number(pedidoB.aberto === true) - Number(pedidoA.aberto === true)
        })
        .forEach(([id, pedido]) => {

            let tr = document.createElement('tr')

            tr.innerHTML = `
                <td>${pedido.loja}</td>
                <td>${pedido.criadoEm}</td>
                <td>${pedido.status}</td>
                <td>${pedido.conferencia}</td>
                <td>${pedido.autorizado == false ? "Aguardar" : "Liberado"}</td>
                <td>
                    ${pedido.aberto == true
                    ? "<span class='text-success'>Aberto</span>"
                    : "<span class='text-danger'>Fechado</span>"
                }
                </td>

                ${pedido.aberto == true
                    ? `<td>
                        <button class='btn btn-warning' id='btnVerPedido${id}'>
                            <i class="bi bi-file-spreadsheet"></i> Ver
                        </button>
                       </td>`
                    : `<td>
                        <button class='btn btn-danger' id='btnVerPedidoFechado${id}'>
                            <i class="bi bi-file-spreadsheet"></i> Visualizar
                        </button>
                       </td>`
                }

                ${pedido.aberto == true
                    ? `<td>
                        <button class='btn btn-danger' id='btnFecharPedido${id}'>
                            Fechar Pedido
                        </button>
                       </td>`
                    : ''
                }
            `

            if (pedido.aberto == true) {

                tr.querySelector(`#btnFecharPedido${id}`).addEventListener('click', async () => {

                    if (confirm('Deseja mesmo fechar esse pedido?')) {

                        await update(ref(db, `pedidos/${id}`), {
                            aberto: false
                        })

                        await carregarPedidos()
                    }
                })

                tr.querySelector(`#btnVerPedido${id}`).addEventListener('click', async () => {
                    await mostrarPedido(id)
                    // modalMostrarPedido.show()
                    await mostrarCentralPedido(id)
                    modalCentralPedido.show()
                })

            } else {

                tr.querySelector(`#btnVerPedidoFechado${id}`).addEventListener('click', async () => {
                    await mostrarPedidoFechado(id, true)
                    modalMostrarPedidoFechado.show()
                })
            }

            tabelaPedidos.appendChild(tr)
        })
}


async function mostrarCentralPedido(id) {

    try {

        const pedidoRef =
            ref(db, `pedidos/${id}`);

        const snapshot =
            await get(pedidoRef);

        if (!snapshot.exists()) {

            console.error(
                "Pedido não encontrado:",
                id
            );

            return;
        }

        const pedidoCompleto =
            snapshot.val();

        const produtos =
            Array.isArray(pedidoCompleto.pedido)
                ? pedidoCompleto.pedido
                : Object.values(
                    pedidoCompleto.pedido || {}
                );

        // ====================================================
        // TÍTULO
        // ====================================================

        const titulo =
            document.querySelector(
                "#modalCentralPedido .modal-title"
            );

        if (titulo) {
            titulo.textContent =
                `Central do Pedido ${id}`;
        }

        // ====================================================
        // MOSTRAR LOJA
        // ====================================================
        const tituloPedido = document.getElementById('tituloPedido')

        if (tituloPedido) {
            tituloPedido.textContent =
                `Loja - ${pedidoCompleto.loja || "-"}`;
        }

        // ====================================================
        // AGRUPAR PRODUTOS POR LOTE
        // ====================================================

        const lotes = {};

        produtos.forEach(produto => {

            const lote =
                Number(produto.lote ?? 1);

            if (!lotes[lote]) {
                lotes[lote] = [];
            }

            lotes[lote].push(produto);

        });




        // ====================================================
        // TABELA DA CENTRAL
        // ====================================================

        const tbody =
            document.querySelector(
                "#modalCentralPedido tbody"
            );

        if (!tbody) {

            console.error(
                "Tabela da Central não encontrada."
            );

            return;
        }

        tbody.innerHTML = "";


        // ====================================================
        // RENDERIZAR LOTES
        // ====================================================

        Object.keys(lotes)
            .sort((a, b) => Number(a) - Number(b))
            .forEach(lote => {

                const produtosDoLote =
                    lotes[lote];


                // --------------------------------------------
                // PEDIDOS DO LOTE
                // --------------------------------------------

                const pedidos = [...new Set(
                    produtosDoLote.flatMap(produto => {

                        const valor = String(produto.pedido ?? "").trim();

                        // Separar os números caso estejam no mesmo campo
                        return valor
                            .split(" - ")
                            .map(parte => parte.trim().slice(0, 6).replace(/\D/g, ""))
                            .filter(Boolean);

                    })
                )];

                // --------------------------------------------
                // LINHA
                // --------------------------------------------

                const tr =
                    document.createElement("tr");


                tr.innerHTML = `

                    <td>
                        ${String(lote).padStart(3, "0")}
                    </td>

                    <td>
                        ${pedidos.join(", ")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-info btn-sm btnVerLote"
                        >
                            <i class="bi bi-eye"></i>
                        </button>

                    </td>

                `;


                // --------------------------------------------
                // BOTÃO VER LOTE
                // --------------------------------------------

                tr.querySelector(".btnVerLote").addEventListener(
                    "click",
                    async () => {

                        // Guarda o número do lote selecionado
                        loteAtualVisualizado = Number(lote);

                        // Fecha a Central
                        modalCentralPedido.hide();

                        // Carrega somente os produtos do lote selecionado
                        await mostrarPedido(
                            id,
                            true,
                            Number(lote)
                        );

                        // Guarda os produtos para a impressão
                        produtosLoteVisualizado = produtosDoLote;

                        // Abre o modal de produtos
                        modalMostrarPedido.show();

                    }
                );


                tbody.appendChild(tr);

            });


        // ====================================================
        // NENHUM LOTE
        // ====================================================

        if (
            Object.keys(lotes).length === 0
        ) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="text-center text-muted"
                    >
                        Nenhum lote encontrado.
                    </td>

                </tr>

            `;

        }


    } catch (error) {

        console.error(
            "Erro ao carregar Central do Pedido:",
            error
        );

    }

}

// ============================================================
// MOSTRAR PEDIDO
// ============================================================

async function mostrarPedido(
    id,
    resetarFiltro = false,
    lote = null
) {

    try {

        const pedidoRef =
            ref(db, `pedidos/${id}`);

        const snapshot =
            await get(pedidoRef);

        if (!snapshot.exists()) {
            return;
        }

        const pedidoCompleto =
            snapshot.val();


        // ========================================================
        // PEDIDO ATUAL
        // ========================================================

        pedidoAtualId = id;

        produtosLoteVisualizado = null;

        pedidoAtualParaImprimir = {
            id: id,
            dados: pedidoCompleto
        };


        // ========================================================
        // PRODUTOS
        // ========================================================

        produtosPedido =
            Array.isArray(pedidoCompleto.pedido)
                ? pedidoCompleto.pedido
                : Object.values(pedidoCompleto.pedido || {});

        // Define o lote que será visualizado
        loteAtualVisualizado =
            lote !== null
                ? Number(lote)
                : null;


        // ========================================================
        // CABEÇALHO
        // ========================================================

        modalTitleMostrarPedido.textContent =
            `PEDIDO ${id}`;

        modalLojaMostrarPedido.textContent =
            pedidoCompleto.loja || "-";

        modalDataMostrarPedido.textContent =
            pedidoCompleto.criadoEm || "-";


        // ========================================================
        // RESUMO
        // ========================================================

        atualizarResumoPedido();


        // ========================================================
        // FILTRO
        // ========================================================

        if (resetarFiltro) {

            filtroFolhaPedido.value = "todas";

        }

        preencherFiltroFolhas();


        // ========================================================
        // RENDERIZA TABELA
        // ========================================================

        aplicarFiltrosPedido();

    }

    catch (error) {

        console.error(
            "Erro ao carregar pedido:",
            error
        );

    }
}


// ============================================================
// ATUALIZAR RESUMO DO PEDIDO
// ============================================================

function atualizarResumoPedido() {

    const produtos =
        produtosPedido;


    const totalProdutos =
        produtos.length;


    const totalSeparados =
        produtos.filter(
            produto => produto.separado === true
        ).length;


    const totalPendentes =
        totalProdutos - totalSeparados;


    const folhas =
        new Set(
            produtos
                .map(produto => produto.folha)
                .filter(
                    folha =>
                        folha !== undefined &&
                        folha !== null &&
                        folha !== ""
                )
        );


    totalProdutosPedido.textContent =
        totalProdutos;

    totalSeparadosPedido.textContent =
        totalSeparados;

    totalPendentesPedido.textContent =
        totalPendentes;

    totalFolhasPedido.textContent =
        folhas.size;
}

// ============================================================
// PREENCHER FILTRO DE FOLHAS
// ============================================================

function preencherFiltroFolhas() {

    const valorAtual =
        filtroFolhaPedido.value;


    const folhas = [
        ...new Set(
            produtosPedido
                .map(produto => produto.folha)
                .filter(
                    folha =>
                        folha !== undefined &&
                        folha !== null &&
                        folha !== ""
                )
        )
    ];


    // Ordena usando a mesma lógica das folhas
    folhas.sort(
        (a, b) =>
            normalizarFolha(a) -
            normalizarFolha(b)
    );


    filtroFolhaPedido.innerHTML = `
        <option value="todas">
            Todas as folhas
        </option>
    `;


    folhas.forEach(folha => {

        const option =
            document.createElement("option");

        option.value =
            folha;

        option.textContent =
            `Folha ${folha}`;

        filtroFolhaPedido.appendChild(
            option
        );

    });


    // Tenta manter a folha selecionada
    if (
        folhas.some(
            folha =>
                String(folha) ===
                String(valorAtual)
        )
    ) {

        filtroFolhaPedido.value =
            valorAtual;

    } else {

        filtroFolhaPedido.value =
            "todas";

    }
}

// ============================================================
// APLICAR FILTRO DE FOLHA
// ============================================================

function aplicarFiltrosPedido() {

    const filtroFolha =
        filtroFolhaPedido.value;

    const filtroStatus =
        filtroStatusPedido.value;


    // Começa com todos os produtos
    let produtosFiltrados =
        [...produtosPedido];

    // ========================================================
    // FILTRO DE LOTE
    // ========================================================

    if (loteAtualVisualizado !== null) {

        produtosFiltrados =
            produtosFiltrados.filter(
                produto =>
                    Number(produto.lote ?? 1) ===
                    Number(loteAtualVisualizado)
            );

    }


    // ========================================================
    // FILTRO DE FOLHA
    // ========================================================

    if (filtroFolha !== "todas") {

        produtosFiltrados =
            produtosFiltrados.filter(
                produto =>
                    String(produto.folha) ===
                    String(filtroFolha)
            );

    }


    // ========================================================
    // FILTRO DE STATUS
    // ========================================================

    if (filtroStatus !== "todos") {

        produtosFiltrados =
            produtosFiltrados.filter(
                produto =>
                    (produto.status || "Em separação") ===
                    filtroStatus
            );

    }


    // ========================================================
    // ORDENAR POR FOLHA
    // ========================================================

    produtosFiltrados.sort(
        (a, b) =>
            normalizarFolha(a.folha) -
            normalizarFolha(b.folha)
    );


    // ========================================================
    // RENDERIZAR
    // ========================================================

    renderizarTabelaPedido(
        produtosFiltrados
    );

}

// ============================================================
// RENDERIZAR TABELA DO PEDIDO
// ============================================================

function renderizarTabelaPedido(produtos) {

    tabelaMostrarPedido.innerHTML = "";


    produtos.forEach((produto, index) => {

        const tr =
            document.createElement("tr");


        // ====================================================
        // QUANTIDADES
        // ====================================================

        const quantidadeOriginal =
            produto.qtdAnterior ?? produto.atual;


        const quantidadeAlterada =
            produto.alt ?? "";


        const quantidadeFinal =
            quantidadeAlterada !== ""
                ? quantidadeAlterada
                : quantidadeOriginal;


        // ====================================================
        // ALTERAÇÃO
        // ====================================================

        const possuiAlteracao =
            produto.alt !== undefined &&
            produto.alt !== null &&
            produto.alt !== "";


        // ====================================================
        // STATUS
        // ====================================================

        const statusAtual =
            produto.status ||
            "Em separação";


        if (statusAtual === "Alteração") {

            tr.classList.add(
                "linha-alteracao"
            );

        }


        if (statusAtual === "Alterado") {

            tr.classList.add(
                "linha-alterado"
            );

        }


        const opcoesStatus = [
            "Em separação",
            "Separado",
            "Conferido",
            "Alteração",
            "Alterado"
        ];


        const statusHTML = `
            <select
                class="select-status ${classeStatus(statusAtual)}"
                data-pedido-id="${pedidoAtualId}"
                data-produto-id="${produto.id}"
            >

                ${opcoesStatus.map(status => `
                    <option
                        value="${status}"
                        ${statusAtual === status ? "selected" : ""}
                    >
                        ${status}
                    </option>
                `).join("")}

            </select>
        `;


        // ====================================================
        // FOLHA
        // ====================================================

        const classeFolhaAtual =
            classeFolha(produto.folha);


        const opcoesFolha =
            folhasDisponiveis
                .map(folha => {

                    return `
                        <option
                            value="${folha}"
                            ${String(produto.folha) === String(folha)
                            ? "selected"
                            : ""}
                        >
                            ${folha}
                        </option>
                    `;

                })
                .join("");


        // ====================================================
        // HTML DA LINHA
        // ====================================================

        tr.innerHTML = `

            <td class="text-center">
                ${statusHTML}
            </td>


            <td class="text-center fw-bold">
                ${produto.codigo ?? ""}
            </td>


            <td>
                ${produto.descricao ?? ""}
            </td>


            <td class="text-center">
                ${produto.identificacao ?? ""}
            </td>


            <td class="text-center">
                ${produto.marca ?? ""}
            </td>


            <td class="text-center text-danger">
                ${produto.local ?? ""}
            </td>


            <td class="qtd-original">
                ${quantidadeOriginal}
            </td>


            <td class="${possuiAlteracao ? "qtd-alteracao" : ""}">

                <input
                    type="number"
                    class="input-alteracao"
                    value="${possuiAlteracao ? quantidadeAlterada : ""}"
                    placeholder="-"
                    min="0"
                    data-pedido-id="${pedidoAtualId}"
                    data-produto-id="${produto.id}"
                >

            </td>


            <td class="qtd-final">
                ${quantidadeFinal}
            </td>


            <td class="text-center">

                <select
                    class="select-folha ${classeFolhaAtual}"
                    data-pedido-id="${pedidoAtualId}"
                    data-produto-id="${produto.id}"
                >

                    <option value="">
                        -
                    </option>

                    ${opcoesFolha}

                </select>

            </td>

        `;


        // ====================================================
        // EVENTO DO STATUS
        // ====================================================

        const selectStatus =
            tr.querySelector(
                ".select-status"
            );


        selectStatus.addEventListener(
            "change",
            async function () {

                const novoStatus =
                    this.value;


                await alterarStatus(
                    pedidoAtualId,
                    produto.id,
                    novoStatus
                );

            }
        );


        // ====================================================
        // EVENTO DA FOLHA
        // ====================================================

        const selectFolha =
            tr.querySelector(
                ".select-folha"
            );


        selectFolha.addEventListener(
            "change",
            async function () {

                const novaFolha =
                    this.value;


                await alterarFolha(
                    pedidoAtualId,
                    produto.id,
                    novaFolha
                );

            }
        );


        // ====================================================
        // EVENTO DA ALTERAÇÃO
        // ====================================================

        const inputAlteracao =
            tr.querySelector(
                ".input-alteracao"
            );


        inputAlteracao.addEventListener(
            "change",
            async function () {

                const valor =
                    this.value.trim();


                salvamentoQuantidadePendente = salvamentoQuantidadePendente.then(
                    () => alterarQuantidade(
                        pedidoAtualId,
                        produto.id,
                        valor
                    )
                );

                await salvamentoQuantidadePendente;

            }
        );


        // ====================================================
        // ADICIONAR LINHA
        // ====================================================

        tabelaMostrarPedido.appendChild(
            tr
        );

    });
}



async function alterarFolha(
    pedidoId,
    produtoId,
    novaFolha
) {

    try {

        const produtosRef =
            ref(db, `pedidos/${pedidoId}/pedido`);

        const snapshot =
            await get(produtosRef);

        if (!snapshot.exists()) {
            return;
        }


        const produtos =
            snapshot.val();


        const index =
            produtos.findIndex(
                produto => produto.id == produtoId
            );


        if (index === -1) {

            console.error(
                "Produto não encontrado:",
                produtoId
            );

            return;
        }


        // --------------------------------------------------------
        // ATUALIZA FIREBASE
        // --------------------------------------------------------

        await update(
            ref(
                db,
                `pedidos/${pedidoId}/pedido/${index}`
            ),
            {
                folha: novaFolha
            }
        );


        // --------------------------------------------------------
        // ATUALIZA VISUALMENTE O SELECT
        // --------------------------------------------------------

        const select =
            document.querySelector(
                `.select-folha[data-produto-id="${produtoId}"]`
            );


        if (select) {

            select.className =
                `select-folha ${classeFolha(novaFolha)}`;

        }


        // --------------------------------------------------------
        // ATUALIZA RESUMO
        // --------------------------------------------------------

        tr.querySelector(`#btnVerPedido${id} `)
            .addEventListener("click", async () => {

                await mostrarPedido(id, true);

                modalMostrarPedido.show();

            });

    }

    catch (error) {

        console.error(
            "Erro ao alterar folha:",
            error
        );

    }

}


async function alterarStatus(
    pedidoId,
    produtoId,
    novoStatus
) {

    try {

        // ====================================================
        // REFERÊNCIA DOS PRODUTOS
        // ====================================================

        const produtosRef =
            ref(
                db,
                `pedidos/${pedidoId}/pedido`
            );


        // ====================================================
        // BUSCAR PRODUTOS
        // ====================================================

        const snapshot =
            await get(produtosRef);


        if (!snapshot.exists()) {

            console.error(
                "Pedido não possui produtos."
            );

            return;
        }


        const produtos =
            snapshot.val();


        // ====================================================
        // PROCURAR PRODUTO PELO ID
        // ====================================================

        const index =
            produtos.findIndex(
                produto => produto.id == produtoId
            );


        if (index === -1) {

            console.error(
                "Produto não encontrado:",
                produtoId
            );

            return;
        }


        // ====================================================
        // VALIDAR STATUS
        // ====================================================

        const statusPermitidos = [
            "Em separacao",
            "Separado",
            "Conferido",
            "Alteração",
            "Alterado"
        ];


        if (!statusPermitidos.includes(novoStatus)) {

            console.error(
                "Status inválido:",
                novoStatus
            );

            return;
        }


        // ====================================================
        // ATUALIZAR FIREBASE
        // ====================================================

        await update(
            ref(
                db,
                `pedidos/${pedidoId}/pedido/${index}`
            ),
            {
                status: novoStatus
            }
        );


        // ====================================================
        // ATUALIZAR MODAL
        // ====================================================

        await mostrarPedido(pedidoId);

    }

    catch (error) {

        console.error(
            "Erro ao alterar status:",
            error
        );

        alert(
            "Não foi possível alterar o status."
        );

    }
}


async function alterarQuantidade(
    pedidoId,
    produtoId,
    novaQuantidade
) {

    try {

        const produtosRef =
            ref(
                db,
                `pedidos/${pedidoId}/pedido`
            );

        const snapshot =
            await get(produtosRef);

        if (!snapshot.exists()) {

            console.error(
                "Pedido não possui produtos."
            );

            return;
        }


        const produtos = snapshot.val();


        // ====================================================
        // PROCURAR PRODUTO PELO ID
        // ====================================================

        const index =
            produtos.findIndex(
                produto => produto.id == produtoId
            );


        if (index === -1) {

            console.error(
                "Produto não encontrado:",
                produtoId
            );

            return;
        }


        const produtoRef =
            ref(
                db,
                `pedidos/${pedidoId}/pedido/${index}`
            );


        const produto =
            produtos[index];


        // ====================================================
        // LIMPAR ALTERAÇÃO
        // ====================================================

        if (novaQuantidade === "") {

            await update(
                produtoRef,
                {
                    alt: null,
                    qtdAnterior: null
                }
            );

            await mostrarPedido(pedidoId);

            return;
        }


        // ====================================================
        // VALIDAR QUANTIDADE
        // ====================================================

        const quantidade =
            Number(novaQuantidade);


        if (
            !Number.isFinite(quantidade) ||
            quantidade < 0
        ) {

            alert(
                "Digite uma quantidade válida."
            );

            await mostrarPedido(pedidoId);

            return;
        }


        // ====================================================
        // QUANTIDADE ORIGINAL
        // ====================================================

        const quantidadeOriginal =
            Number(produto.atual ?? 0);


        // ====================================================
        // SALVAR ALTERAÇÃO
        // ====================================================

        await update(
            produtoRef,
            {

                atual: quantidade,
                qtdAnterior:
                    produto.qtdAnterior ??
                    quantidadeOriginal,

                alt: quantidade

            }
        );


        // ====================================================
        // ATUALIZAR MODAL
        // ====================================================

        await mostrarPedido(pedidoId);

    }

    catch (error) {

        console.error(
            "Erro ao alterar quantidade:",
            error
        );

        alert(
            "Não foi possível alterar a quantidade."
        );

    }

}

function normalizarFolha(folha) {

    if (!folha) {
        return 999;
    }

    return parseFloat(
        String(folha).replace(",", ".")
    );

}


function classeStatus(status) {

    switch (status) {

        case "Em separação":
            return "status-em-separacao";

        case "Separado":
            return "status-separado";

        case "Conferido":
            return "status-conferido";

        case "Alteração":
            return "status-alteracao";

        case "Alterado":
            return "status-alterado";

        default:
            return "status-em-separacao";

    }

}

async function alterarStatusTodos(pedidoId, novoStatus) {

    try {

        const pedidoRef =
            ref(db, `pedidos/${pedidoId}/pedido`);

        const snapshot =
            await get(pedidoRef);


        if (!snapshot.exists()) {

            alert("Nenhum produto encontrado neste pedido.");

            return;
        }


        const produtos =
            snapshot.val();


        const atualizacoes = {};


        Object.keys(produtos).forEach(index => {

            atualizacoes[`${index}/status`] =
                novoStatus;

        });


        await update(
            pedidoRef,
            atualizacoes
        );


        // Atualiza o modal
        await mostrarPedido(pedidoId);


    } catch (error) {

        console.error(
            "Erro ao alterar status dos produtos:",
            error
        );

        alert(
            "Não foi possível alterar o status dos produtos."
        );

    }

}

function classeFolha(folha) {

    const valor =
        String(folha ?? "").trim();


    switch (valor) {

        case "1":
        case "1,1":
        case "1,2":

            return "folha-1";


        case "2":
        case "2,1":
        case "2,2":

            return "folha-2";


        case "3":
        case "3,1":
        case "3,2":

            return "folha-3";


        case "4":

            return "folha-4";


        case "5":
        case "5,1":
        case "5,2":

            return "folha-5";


        default:

            return "folha-default";

    }

}

function imprimirFolhas(pedidoId, pedidoCompleto, produtosParaImprimir = null) {

    let produtos = (
        produtosParaImprimir ?? pedidoCompleto.pedido ?? []
    ).filter(produto =>
        produto.status == null || produto.status == "" || produto.status == undefined
    );

    if (produtos.length === 0) {
        alert("Este pedido não possui produtos.");
        return;
    }


    // ========================================================
    // AGRUPAR PRODUTOS POR FOLHA
    // ========================================================

    const folhas = {};

    produtos.forEach(produto => {

        const folha = produto.folha;

        if (!folha) {
            return;
        }

        if (!folhas[folha]) {
            folhas[folha] = [];
        }

        folhas[folha].push(produto);

    });


    // ========================================================
    // ORDENAR FOLHAS
    // ========================================================

    const folhasOrdenadas = Object.keys(folhas).sort(
        (a, b) => normalizarFolha(a) - normalizarFolha(b)
    );

    const folhasParaImprimir = folhasOrdenadas.filter(folha => {

        const configuracao =
            obterConfiguracaoFolha(folha);

        return configuracao.imprimir === true;

    });


    if (folhasOrdenadas.length === 0) {

        alert(
            "Nenhum produto possui folha definida."
        );

        return;
    }


    // ========================================================
    // CRIAR HTML
    // ========================================================

    let corLoja = obterCorLoja(pedidoCompleto.loja)

    let html = `

        <!DOCTYPE html>

        <html lang="pt-br">

        <head>

            <meta charset="UTF-8">

            <title>
                Pedido ${pedidoId}
            </title>

            <style>

                ${cssImpressao()}

            </style>

        </head>

        <body>

    `;


    // ========================================================
    // CRIAR UMA PÁGINA PARA CADA FOLHA
    // ========================================================

    folhasParaImprimir.forEach((folha, index) => {

        const produtosFolha = folhas[folha];


        // ----------------------------------------------------
        // ORDENAR PRODUTOS DA FOLHA
        // ----------------------------------------------------

        produtosFolha.sort((a, b) => {

            const localA =
                String(a.local || "");

            const localB =
                String(b.local || "");

            return localA.localeCompare(
                localB,
                "pt-BR",
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        });


        // ----------------------------------------------------
        // TOTAL
        // ----------------------------------------------------

        const quantidadeTotal =
            produtosFolha.reduce(
                (total, produto) => {

                    const quantidade =
                        produto.alt !== undefined &&
                            produto.alt !== null &&
                            produto.alt !== ""
                            ? Number(produto.alt)
                            : Number(produto.atual || 0);

                    return total + quantidade;

                },
                0
            );


        // ----------------------------------------------------
        // HTML DA PÁGINA
        // ----------------------------------------------------
        const configuracaoFolha =
            obterConfiguracaoFolha(folha);

        html += `

            <div class="folha-print">

                <!-- CABEÇALHO SUPERIOR -->

                <div class="top-header">

                    <div class="galpao ${configuracaoFolha.classe}">
                        ${configuracaoFolha.titulo}
                    </div>

                    <div class="data">
                        ${pedidoCompleto.criadoEm || ""}
                    </div>

                </div>


                <!-- TÍTULO -->

                <div class="titulo-header ${corLoja}">

                    <div>
                        ${pedidoCompleto.loja ||
            pedidoCompleto.tipo ||
            "PEDIDO"}
                    </div>

                </div>


                <!-- INFORMAÇÕES -->

                <div class="informacoes">

                    <div>
                        <strong>PEDIDO:</strong>
                        ${pedidoId}
                    </div>

                    <div>
                        <strong>LOJA:</strong>
                        ${pedidoCompleto.loja || ""}
                    </div>

                    <div>
                        <strong>FOLHA:</strong>
                        <span class="folha-badge ${classeFolhaImpressao(folha)}">
                            ${folha}
                        </span>
                    </div>

                </div>


                <!-- TABELA -->

                <table>

                    <thead>

                        <tr>

                            <th class="pedido">
                                PEDIDO
                            </th>

                            <th class="codigo">
                                COD
                            </th>

                            <th class="descricao">
                                DESCRIÇÃO
                            </th>

                            <th class="marca">
                                MARCA
                            </th>

                            <th class="identificacao">
                                IDENTIFICAÇÃO
                            </th>

                            <th class="local">
                                LOCAL
                            </th>

                            <th class="un">
                                UN
                            </th>

                            <th class="qtd">
                                QT
                            </th>

                            <th class="alt">
                                ALT
                            </th>

                            <th class="conf">
                                CONF
                            </th>

                            <th class="folha">
                                FOLHA
                            </th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        // ====================================================
        // PRODUTOS
        // ====================================================

        produtosFolha.forEach(produto => {

            const alterado =
                produto.alt !== undefined &&
                produto.alt !== null &&
                produto.alt !== "";


            const quantidade =
                alterado
                    ? produto.qtdAnterior ?? produto.atual ?? ""
                    : produto.atual ?? "";


            const quantidadeFinal =
                alterado
                    ? produto.alt
                    : produto.atual ?? "";


            const status =
                produto.separado === true
                    ? "Separado"
                    : pedidoCompleto.status || "Em Separação";

            const descricao = String(produto.descricao ?? "").toLowerCase();

            const linhaAzul =
                descricao.includes("areia") ||
                descricao.includes("cimento cola");


            const numeroPedido = produto.pedido.split(" - ")[0];
            html += `

                <tr class="${linhaAzul ? "linha-azul" : ""}">   

                    <td class="center">
                        ${numeroPedido}
                    </td>

                    <td class="center codigo-cell">
                        ${produto.codigo ?? ""}
                    </td>

                    <td class="descricao-cell">
                        ${produto.descricao ?? ""}
                    </td>

                    <td>
                        ${produto.marca ?? ""}
                    </td>

                    <td class="center">
                        ${produto.identificacao ?? ""}
                    </td>

                    <td class="local-cell">
                        ${produto.local ?? ""}
                    </td>

                    <td class="center">
                        ${produto.un ??
                produto.unidade ??
                ""}
                    </td>

                    <td class="center qtd-cell">
                        ${quantidade}
                    </td>

                    <td class="center alt-cell">
                        ${alterado
                    ? quantidadeFinal
                    : ""}
                    </td>

                    <td class="conf-cell">
                    </td>

                    <td class="center folha-cell m-1">
                        <div class="${classeFolhaImpressao(folha)}">
                            ${folha}
                        </div>
                    </td>

                </tr>

            `;

        });


        // ====================================================
        // RODAPÉ DA TABELA
        // ====================================================

        html += `

                    </tbody>

                    <tfoot>

                        <tr>

                            <td colspan="8">
                                TOTAL
                            </td>

                            <td colspan="2">
                                ${quantidadeTotal}
                            </td>

                            <td colspan="2">
                            </td>

                        </tr>

                    </tfoot>

                </table>


                <!-- RODAPÉ -->

                <div class="rodape">

                    <span>
                        Pedido: ${pedidoId}
                    </span>

                    <span>
                        Folha ${folha}
                    </span>

                    <span>
                        ${produtosFolha.length} produtos
                    </span>

                </div>

            </div>

        `;

    });


    html += `

        </body>

        </html>

    `;


    // ========================================================
    // ABRIR JANELA
    // ========================================================

    const janela =
        window.open(
            "",
            "_blank",
            "width=1200,height=800"
        );


    if (!janela) {

        alert(
            "O navegador bloqueou a janela de impressão. Permita pop-ups para este site."
        );

        return;
    }


    janela.document.open();

    janela.document.write(html);

    janela.document.close();


    // ========================================================
    // ESPERAR CARREGAR E IMPRIMIR
    // ========================================================

    janela.onload = () => {

        setTimeout(() => {

            janela.focus();

            janela.print();

        }, 300);

    };

}

function ImprimirFolha4(pedidoId, pedidoCompleto) {

    let produtos = pedidoCompleto.pedido || [];

    if (produtos.length === 0) {
        alert("Este pedido não possui produtos.");
        return;
    }


    // ========================================================
    // PEGAR SOMENTE A FOLHA 4
    // ========================================================

    produtos = produtos.filter(produto =>
        String(produto.folha ?? "").trim() === "4"
    );


    if (produtos.length === 0) {
        alert("Este pedido não possui produtos na Folha 4.");
        return;
    }


    // ========================================================
    // ORDENAR POR LOCAL
    // ========================================================

    produtos.sort((a, b) => {

        const localA =
            String(a.local || "");

        const localB =
            String(b.local || "");

        return localA.localeCompare(
            localB,
            "pt-BR",
            {
                numeric: true,
                sensitivity: "base"
            }
        );

    });


    // ========================================================
    // COLUNAS DE FECHOS
    // ========================================================

    const fechados = [
        "3",
        "5",
        "7",
        "8",
        "10"
    ];


    // ========================================================
    // COLUNAS DE AMARRADOS
    // ========================================================

    const amarrados = [];

    for (let i = 1; i <= 20; i++) {
        amarrados.push(String(i));
    }


    // ========================================================
    // HTML
    // ========================================================

    let corLoja = obterCorLoja(pedidoCompleto.loja)

    console.log(corLoja)
    let html = `

        <!DOCTYPE html>

        <html lang="pt-br">

        <head>

            <meta charset="UTF-8">

            <title>
                Folha 4 - Pedido ${pedidoId}
            </title>

            <style>

                ${cssImpressaoFolha4()}

            </style>

        </head>

        <body>

            <div class="folha4">


                <!-- ==================================================
                     CABEÇALHO PRINCIPAL
                =================================================== -->

                <div class="cabecalho-principal">

                    <div class="numero-folha">
                        4
                    </div>

                    <div class="titulo-principal ${corLoja}">
                        ${pedidoCompleto.loja || "PEDIDO"}
                    </div>

                    <div class="data-impressao">
                        ${pedidoCompleto.criadoEm || ""}
                    </div>

                </div>


                <!-- ==================================================
                     CABEÇALHO SECUNDÁRIO
                =================================================== -->

                <div class="cabecalho-secundario">

                    <div class="titulo-carregamentos">
                        CARREGAMENTOS TUBOS
                    </div>

                    <div class="titulo-fechos">
                        FECHOS
                    </div>

                    <div class="titulo-amarrados">
                        TOTAL DE AMARRADOS CONTADOS
                    </div>

                </div>


                <!-- ==================================================
                     TABELA
                =================================================== -->

                <table class="tabela-folha4">

                    <thead>

                        <tr>

                            <th class="col-tipo">
                                TIPO
                            </th>

                            <th class="col-cod">
                                COD
                            </th>

                            <th class="col-hidref">
                                HIDREL
                            </th>

                            <th class="col-descricao">
                                DESCRIÇÃO
                            </th>

                            <th class="col-marca">
                                MARCA
                            </th>

                            <th class="col-un">
                                UN
                            </th>

                            <th class="col-qt">
                                QT
                            </th>

                            ${fechados.map(numero => `
                                <th class="col-fecho">
                                    ${numero}
                                </th>
                            `).join("")}

                            ${amarrados.map(numero => `
                                <th class="col-amarrado">
                                    ${numero}
                                </th>
                            `).join("")}

                            <th class="col-total">
                                TOTAL
                            </th>

                        </tr>

                    </thead>


                    <tbody>

    `;


    // ========================================================
    // PRODUTOS
    // ========================================================

    produtos.forEach(produto => {

        const tipo = obterTipoFolha4(produto.descricao);


        const codigo =
            produto.codigo ??
            "";


        const hidref =
            produto.hidref ??
            produto.identificacao ??
            "";


        const descricao =
            produto.descricao ??
            "";


        const marca =
            produto.marca ??
            "";


        const unidade =
            produto.un ??
            produto.unidade ??
            "";


        const quantidade =
            produto.alt !== undefined &&
                produto.alt !== null &&
                produto.alt !== ""
                ? produto.alt
                : produto.atual ?? "";

        const numeroPedido = produto.pedido.split(" - ")[0];


        html += `

            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <tr class="mb-1">
                
                <td class="tipo-cell ${tipo.classe}">
                    ${tipo.nome}
                </td>
                
                <td class="${tipo.classe}">
                    ${numeroPedido}
                </td>
                
                <td class="${tipo.classe}">
                    ${codigo}
                </td>
                
                <td class="${tipo.classe}">
                    ${descricao}
                </td>
                
                <td class="${tipo.classe}">
                    ${marca}
                </td>
                
                <td class="${tipo.classe}">
                    ${unidade}
                </td>
                
                <td class="col-qt ${tipo.classe}">
                    ${quantidade}
                </td>
                
                ${fechados.map(() => `          
        <td class="checkbox-cell fecho-cell">
            <span class="checkbox vermelho"></span>
        </td>
                `).join("")}
                
                ${amarrados.map(() => `
                    <td class="checkbox-cell">
                        <span class="checkbox"></span>
                    </td>
                `).join("")}
                
                <td class="total-cell">
                </td>
                
            </tr>

            `;

    });


    html += `

                    </tbody>

                </table>


            </div>

        </body>

        </html>

    `;


    // ========================================================
    // ABRIR JANELA
    // ========================================================

    const janela = window.open(
        "",
        "_blank",
        "width=1600,height=900"
    );


    if (!janela) {

        alert(
            "O navegador bloqueou a janela de impressão. Permita pop-ups para este site."
        );

        return;
    }


    janela.document.open();

    janela.document.write(html);

    janela.document.close();


    // ========================================================
    // IMPRIMIR
    // ========================================================

    janela.onload = () => {

        setTimeout(() => {

            janela.focus();

            janela.print();

        }, 500);

    };

}

function imprimirConferencia(pedidoId, pedidoCompleto, marcasSelecionadas = []) {

    let produtos = pedidoCompleto.pedido || [];

    // PEGAR PRODUTOS COM FOLHA VÁLIDA E DAS MARCAS SELECIONADAS

    const marcasNormalizadas = new Set(
        marcasSelecionadas.map(marca =>
            String(marca).trim().toLocaleLowerCase("pt-BR")
        )
    );


    // ========================================================
    // VALIDAR
    // ========================================================
    produtos = produtos.filter(produto => {
        const folha = String(produto.folha ?? "").trim();
        const marca = String(produto.marca ?? "")
            .trim()
            .toLocaleLowerCase("pt-BR");

        return (
            folha !== "" &&
            folha !== "4" &&
            marcasNormalizadas.has(marca)
        );
    });

    if (produtos.length === 0) {
        alert("Nenhum produto encontrado para as marcas selecionadas.");
        return;
    }


    // ========================================================
    // PEGAR APENAS PRODUTOS COM FOLHA
    // ========================================================

    produtos = produtos.filter(produto => {

        const folha = String(produto.folha ?? "").trim();

        return (
            folha !== "" &&
            folha !== "4"
        );

    });


    if (produtos.length === 0) {
        alert("Nenhum produto possui folha definida.");
        return;
    }


    // ========================================================
    // ORDENAR POR MARCA E AGRUPAR PRODUTOS DUPLICADOS
    // ========================================================

    produtos.sort((a, b) => {
        const marcaA = String(a.marca ?? "").trim();
        const marcaB = String(b.marca ?? "").trim();

        // Primeiro, ordenar por marca
        const ordemMarca = marcaA.localeCompare(
            marcaB,
            "pt-BR",
            {
                numeric: true,
                sensitivity: "base"
            }
        );

        if (ordemMarca !== 0) {
            return ordemMarca;
        }

        // Dentro da mesma marca, agrupar pelo código do produto
        const codigoA = String(a.codigo ?? "").trim();
        const codigoB = String(b.codigo ?? "").trim();

        const ordemCodigo = codigoA.localeCompare(
            codigoB,
            "pt-BR",
            {
                numeric: true,
                sensitivity: "base"
            }
        );

        if (ordemCodigo !== 0) {
            return ordemCodigo;
        }

        // Se o código for igual, ordenar pela descrição
        const descricaoA = String(a.descricao ?? "").trim();
        const descricaoB = String(b.descricao ?? "").trim();

        return descricaoA.localeCompare(
            descricaoB,
            "pt-BR",
            {
                numeric: true,
                sensitivity: "base"
            }
        );
    });



    // ========================================================
    // CALCULAR TOTAL
    // ========================================================

    const quantidadeTotal = produtos.reduce(
        (total, produto) => {

            const alterado =
                produto.alt !== undefined &&
                produto.alt !== null &&
                produto.alt !== "";


            const quantidade =
                alterado
                    ? Number(produto.alt)
                    : Number(produto.atual || 0);


            return total + quantidade;

        },
        0
    );


    // ========================================================
    // COR DA LOJA
    // ========================================================

    const corLoja =
        obterCorLoja(pedidoCompleto.loja);


    // ========================================================
    // CRIAR HTML
    // ========================================================

    let html = `

        <!DOCTYPE html>

        <html lang="pt-br">

        <head>

            <meta charset="UTF-8">

            <title>
                Conferência - Pedido ${pedidoId}
            </title>

            <style>

                ${cssImpressaoConferencia()}

            </style>

        </head>

        <body>


            <div class="documento-conferencia">


                <!-- ============================================
                     CABEÇALHO PRINCIPAL
                ============================================= -->

                <div class="top-header">

                    <div class="conferencia-header">
                        CONFERÊNCIA
                    </div>

                    <div class="data">
                        ${pedidoCompleto.criadoEm || ""}
                    </div>

                </div>


                <!-- ============================================
                     TÍTULO / LOJA
                ============================================= -->

                <div class="titulo-header ${corLoja}">

                    ${pedidoCompleto.loja ||
        pedidoCompleto.tipo ||
        "PEDIDO"}

                </div>


                <!-- ============================================
                     INFORMAÇÕES
                ============================================= -->

                <div class="informacoes">

                    <div>
                        <strong>PEDIDO:</strong>
                        ${pedidoId}
                    </div>

                    <div>
                        <strong>LOJA:</strong>
                        ${pedidoCompleto.loja || ""}
                    </div>

                    <div>
                        <strong>PRODUTOS:</strong>
                        ${produtos.length}
                    </div>

                    <div>
                        <strong>QT TOTAL:</strong>
                        ${quantidadeTotal}
                    </div>

                </div>


                <!-- ============================================
                     TABELA
                ============================================= -->

                <table>

                    <thead>

                        <tr>

                            <th class="pedido">
                                PEDIDO
                            </th>

                            <th class="codigo">
                                COD
                            </th>

                            <th class="descricao">
                                DESCRIÇÃO
                            </th>

                            <th class="marca">
                                MARCA
                            </th>

                            <th class="identificacao">
                                IDENTIFICAÇÃO
                            </th>

                            <th class="local">
                                LOCAL
                            </th>

                            <th class="un">
                                UN
                            </th>

                            <th class="qtd">
                                QT
                            </th>

                            <th class="alt">
                                ALT
                            </th>

                            <th class="conf">
                                1° CONF
                            </th>
                            <th class="conf">
                                2° CONF
                            </th>

                            <th class="folha">
                                FOLHA
                            </th>

                        </tr>

                    </thead>


                    <tbody>

    `;


    // ========================================================
    // PRODUTOS
    // ========================================================

    produtos.forEach(produto => {

        const alterado =
            produto.alt !== undefined &&
            produto.alt !== null &&
            produto.alt !== "";


        const quantidade =
            alterado
                ? produto.qtdAnterior ?? produto.atual ?? ""
                : produto.atual ?? "";


        const quantidadeFinal =
            alterado
                ? produto.alt
                : "";

        const numeroPedido = produto.pedido.split(" - ")[0];

        html += `

            <tr>

                <td class="center">
                    ${numeroPedido}
                </td>

                <td class="center codigo-cell">
                    ${produto.codigo ?? ""}
                </td>

                <td class="descricao-cell">
                    ${produto.descricao ?? ""}
                </td>

                <td>
                    ${produto.marca ?? ""}
                </td>

                <td class="center">
                    ${produto.identificacao ?? ""}
                </td>

                <td class="local-cell">
                    ${produto.local ?? ""}
                </td>

                <td class="center">
                    ${produto.un ??
            produto.unidade ??
            ""}
                </td>

                <td class="center qtd-cell">
                    ${quantidade}
                </td>

                <td class="center alt-cell">
                    ${quantidadeFinal}
                </td>

                <td class="conf-cell">
                </td>
                <td class="conf-cell">
                </td>

                <td class="center folha-cell m-1">
                    <div class="${classeFolhaImpressao(produto.folha)}">
                        ${produto.folha}
                    </div>
                </td>

            </tr>

        `;

    });


    // ========================================================
    // FECHAR TABELA
    // ========================================================

    html += `

                    </tbody>


                    <tfoot>

                        <tr>

                            <td colspan="7">
                                TOTAL DO PEDIDO
                            </td>

                            <td>
                                ${quantidadeTotal}
                            </td>

                            <td colspan="3">
                            </td>

                        </tr>

                    </tfoot>

                </table>


                <!-- ============================================
                     RODAPÉ
                ============================================= -->

                <div class="rodape">

                    <span>
                        Pedido: ${pedidoId}
                    </span>

                    <span>
                        ${produtos.length} produtos
                    </span>

                    <span>
                        CONFERÊNCIA
                    </span>

                </div>


            </div>


        </body>

        </html>

    `;


    // ========================================================
    // ABRIR JANELA
    // ========================================================

    const janela = window.open(
        "",
        "_blank",
        "width=1200,height=800"
    );


    if (!janela) {

        alert(
            "O navegador bloqueou a janela de impressão. Permita pop-ups para este site."
        );

        return;
    }


    janela.document.open();

    janela.document.write(html);

    janela.document.close();


    // ========================================================
    // IMPRIMIR
    // ========================================================

    janela.onload = () => {

        setTimeout(() => {

            janela.focus();

            janela.print();

        }, 300);

    };

}

function obterTipoFolha4(descricao) {

    const texto = String(descricao || "").toUpperCase();

    if (texto.includes("SOLD")) {
        return {
            nome: "SOLD",
            classe: "tipo-sold"
        };
    }

    if (texto.includes("ESG")) {
        return {
            nome: "ESG",
            classe: "tipo-esg"
        };
    }

    if (texto.includes("GALV")) {
        return {
            nome: "GALV",
            classe: "tipo-galv"
        };
    }

    if (texto.includes("COLETOR")) {
        return {
            nome: "COLETOR",
            classe: "tipo-coletor"
        };
    }

    if (texto.includes("ROSC")) {
        return {
            nome: "ROSC",
            classe: "tipo-rosc"
        };
    }

    if (texto.includes("FORRO")) {
        return {
            nome: "FORRO",
            classe: "tipo-forro"
        };
    }

    return {
        nome: "...",
        classe: "tipo-desconhecido"
    };
}

function cssImpressao() {

    return `

        * {
            box-sizing: border-box;
        }


        @page {

            size: A4 landscape;

            margin: 7mm;

        }


        html,
        body {

            margin: 0;

            padding: 0;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            background: white;

            color: #000;

            font-size: 8px;

        }


        /* ================================================
           PÁGINA DA FOLHA
        ================================================ */

        .folha-print {

            width: 100%;

            page-break-after: always;

            break-after: page;

        }


        .folha-print:last-child {

            page-break-after: auto;

            break-after: auto;

        }


        /* ================================================
           CABEÇALHO
        ================================================ */

        .top-header {

            height: 19px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            margin-bottom: 3px;

        }


        .galpao {

            flex: 1;

            height: 19px;

            background: #0757a5;

            color: white;

            text-align: center;

            font-size: 14px;

            font-weight: bold;

            line-height: 19px;

            border-radius: 3px;

        }


        .data {

            width: 90px;

            height: 19px;

            text-align: center;

            font-size: 13px;

            font-weight: bold;

            line-height: 19px;

            margin-left: 8px;

        }


        /* ================================================
           TÍTULO
        ================================================ */


        .text-white {
            color: #fff;
        }

        .bg-success {
            background-color: #198754;
        }
        .bg-danger {
            background-color: #dc3545;
        }
        .bg-info {
            background-color: #0dcaf0;
        }
        .bg-warning {
            background-color: #ffc107;
        }

        .titulo-header {

            height: 25px;

            border-radius: 4px;

            text-align: center;

            font-size: 16px;

            font-weight: bold;

            line-height: 25px;

            margin-bottom: 4px;

        }


        /* ================================================
           INFORMAÇÕES
        ================================================ */

        .informacoes {

            display: flex;

            align-items: center;

            gap: 25px;

            height: 22px;

            border: 1px solid #777;

            padding: 2px 6px;

            margin-bottom: 4px;

            font-size: 10px;

        }


        .folha-badge {

            display: inline-block;

            min-width: 30px;

            padding: 2px 8px;

            margin-left: 3px;

            text-align: center;

            border-radius: 4px;

            color: white;

            font-weight: bold;

        }


        /* ================================================
           TABELA
        ================================================ */

        .linha-azul td {
            background-color: lightblue !important;
        }


        table {

            width: 100%;

            border-collapse: collapse;
        }

        th {

            background: #d9e1df;

            border: 1px solid #777;

            height: 22px;

            padding: 5px;

            font-size: 15px;

            font-weight: bold;

            text-align: center;

        }


        td {

            border: 1px solid #777;

            height: 20px;

            padding: 5px 8px;

            font-size: 12px;

            overflow: hidden;

            white-space: nowrap;

            text-overflow: ellipsis;

        }


        thead {

            display: table-header-group;

        }


        tr {

            page-break-inside: avoid;

            break-inside: avoid;

        }


        .m-1 {
            margin: 2px;
        }


        /* ================================================
           LARGURAS
        ================================================ */

        th.status {
            width: 8%;
        }

        th.pedido {
            width: 7%;
        }

        th.codigo {
            width: 7%;
        }

        th.descricao {
            width: 22%;
        }

        th.marca {
            width: 10%;
        }

        th.identificacao {
            width: 9%;
        }

        th.local {
            width: 12%;
        }

        th.un {
            width: 3%;
        }

        th.qtd {
            width: 4%;
        }

        th.alt {
            width: 4%;
        }

        th.conf {
            width: 5%;

        }

        th.folha {
            width: 5%;
        }


        /* ================================================
           CÉLULAS
        ================================================ */

        .center {

            text-align: center;

        }


        .descricao-cell {

            font-weight: 500;

        }


        .codigo-cell {

            font-weight: bold;

        }


        .local-cell {

            color: #e00000;

            font-weight: bold;

        }


        .status-cell {

            background: #444;

            color: white;

            text-align: center;

            font-weight: bold;

        }


        .qtd-cell {

            font-weight: bold;

        }


        .alt-cell {

            background: #fff2cc;

            font-weight: bold;

        }


        .conf-cell {

            background: white;

        }


        /* ================================================
           CORES DAS FOLHAS
        ================================================ */

        .folha-1 {

            background: #ff0000 !important;

            color: white !important;
            
            border-radius: 5px;
        }


        .folha-2 {

            background: #008a4b !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-3 {

            background: #ffd800 !important;

            color: #000 !important;

            border-radius: 5px;
        }


        .folha-4 {

            background: #777 !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-5 {

            background: #0757a5 !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-default {

            background: #ddd !important;

            color: #000 !important;

            border-radius: 5px;
        }


        .folha-cell {

            text-align: center;

            font-weight: bold;

            border-radius: 5px;
        }


        /* ================================================
           RODAPÉ
        ================================================ */

        tfoot td {

            height: 22px;

            background: #e6e6e6;

            font-weight: bold;

            text-align: center;

        }


        .rodape {

            display: flex;

            justify-content: space-between;

            margin-top: 5px;

            padding-top: 3px;

            border-top: 1px solid #777;

            font-size: 8px;

        }


        /* ================================================
           IMPRESSÃO
        ================================================ */

        @media print {

            body {

                -webkit-print-color-adjust: exact;

                print-color-adjust: exact;

            }

        }

    `;

}

function cssImpressaoFolha4() {

    return `

        * {
            box-sizing: border-box;
        }


        @page {

            size: A4 landscape;

            margin: 4mm;

        }


        html,
        body {

            margin: 0;

            padding: 0;

            background: white;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            color: #000;

            font-size: 8px;

        }


        .folha4 {

            width: 100%;

        }


        /* =====================================================
           CABEÇALHO PRINCIPAL
        ====================================================== */

        .cabecalho-principal {

            display: grid;

            grid-template-columns: 95px 1fr 150px;

            height: 32px;

            border-top: 2px solid #000;

            border-left: 1px solid #000;

            border-right: 1px solid #000;

        }


        .numero-folha {

            background: #444;

            color: white;

            margin: 3px;

            border-radius: 5px;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 21px;

            font-weight: bold;

        }

        .text-white {
            color: #fff;
        }

        .bg-success {
            background-color: #198754;
        }
        .bg-danger {
            background-color: #dc3545;
        }
        .bg-info {
            background-color: #0dcaf0;
        }
        .bg-warning {
            background-color: #ffc107;
        }

        .titulo-principal {

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 17px;

            font-weight: bold;

            border-radius: 4px;

            margin: 3px 5px 3px 0;

        }


        .data-impressao {

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 16px;

            font-weight: bold;

            border-left: 1px solid #000;

        }


        /* =====================================================
           CABEÇALHO SECUNDÁRIO
        ====================================================== */

        .cabecalho-secundario {

            display: grid;

            grid-template-columns:
                50% 
                13%
                37%;

            height: 25px;

            border: 1px solid #000;

            border-bottom: none;

        }


        .titulo-carregamentos {

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 12px;

        }


        .titulo-fechos {

            display: flex;

            align-items: center;

            justify-content: center;

            background: #ff0000;

            color: white;

            font-size: 14px;

            font-weight: bold;

            border-left: 1px solid #000;

            border-right: 1px solid #000;

        }


        .titulo-amarrados {

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 11px;

            font-weight: bold;

        }


        /* =====================================================
           TABELA
        ====================================================== */

        .tabela-folha4 {

            width: 100%;

            border-collapse: collapse;

            table-layout: fixed;

        }


        .tabela-folha4 th {

            height: 21px;

            border: 1px solid #000;

            background: #d9d9d9;

            font-size: 10px;

            font-weight: bold;

            text-align: center;

            padding: 1px;

        }


        .tabela-folha4 td {

            height: 24px;

            border: 1px solid #000;

            padding: 2px;

            font-size: 9px;

            font-weight: 500;

            overflow: hidden;

            white-space: nowrap;

            text-overflow: ellipsis;
        }

        
        .mb-1 {
            margin-bottom: 1em;
        }


        /* =====================================================
           LARGURAS
        ====================================================== */

        .col-tipo {

            width: 6%;

        }


        .col-cod {

            width: 5%;

        }


        .col-hidref {

            width: 5%;

        }


        .col-descricao {

            width: 29%;

        }


        .col-marca {

            width: 7%;

        }


        .col-un {

            width: 3%;

            text-align: center;
            
        }
            
            
        .col-qt {
                
            width: 5%;
            
            text-align: center;
        }


        .col-fecho {

            width: 3%;

            background: #ff0000 !important;

            color: white;

        }


        .col-amarrado {

            width: 2.3%;

        }


        .col-total {

            width: 4%;
        }


        /* =====================================================
           PRODUTOS
        ====================================================== */

        .tipo-cell {

            font-weight: bold;

            text-align: center;

        }


        .codigo-cell {

            text-align: center;

        }


        .hidref-cell {

            font-weight: bold;

            text-align: center;

        }


        .descricao-cell {

            font-weight: bold;

        }


        .marca-cell {

            font-weight: bold;

        }


        .un-cell {

            padding: 1em;

            text-align: center;

            font-weight: bold;

        }


        .qt-cell {

            padding: 1em;

            text-align: center;

            font-weight: bold;

        }


        .total-cell {

            text-align: center;

            font-weight: bold;

        }


        /* =====================================================
           CHECKBOXES
        ====================================================== */

        .checkbox-cell {

            text-align: center;

            padding: 0 !important;

        }


        .checkbox {

            display: inline-block;

            width: 15px;

            height: 15px;

            border: 2px solid #111;

            background: white;

        }


        .checkbox.vermelho {

            border-color: #ff0000;

        }


        .fecho-cell {

            background: white;

        }


        /* =====================================================
           CORES DOS TIPOS
        ====================================================== */

        .tipo-cell {

            background: #fff;

        }


        .tabela-folha4 tbody tr:nth-child(even) {

            background: #f7f7f7;

        }


        /* =====================================================
           IMPRESSÃO
        ====================================================== */

        @media print {

            body {

                -webkit-print-color-adjust: exact;

                print-color-adjust: exact;

            }


            .folha4 {

                page-break-after: always;

                break-after: page;

            }


            tr {

                page-break-inside: avoid;

                break-inside: avoid;

            }

        }


        /* =====================================================
           CORES DOS TIPOS DA FOLHA 4
        ===================================================== */

        .tipo-sold {
            background: #a85a05 !important;
            color: white !important;
        }

        .tipo-esg {
            background: #fff000 !important;
            color: #000 !important;
        }

        .tipo-galv {
            background: #9e9e9e !important;
            color: #000 !important;
        }

        .tipo-coletor {
            background: #5b3507 !important;
            color: white !important;
        }

        .tipo-rosc {
            background: #ffe3a3 !important;
            color: #000 !important;
        }

        .tipo-forro {
            background: #ead9dd !important;
            color: #000 !important;
        }

        .tipo-desconhecido {
            background: #eeeeee !important;
            color: #333 !important;
        }

            `;

}

function cssImpressaoConferencia() {

    return `

        * {
            box-sizing: border-box;
        }


        @page {
            size: A4 landscape;
            margin: 7mm;
        }


        html,
        body {

            margin: 0;
            padding: 0;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            background: white;
            color: #000;

            font-size: 9px;

        }


        .documento-conferencia {

            width: 100%;

        }


        /* ================================================
           CABEÇALHO
        ================================================ */

        .top-header {

            display: grid;

            grid-template-columns: 1fr 100px;

            height: 25px;

            margin-bottom: 3px;

        }


        .conferencia-header {

            display: flex;

            align-items: center;

            justify-content: center;

            background: #343a40;

            color: white;

            font-size: 15px;

            font-weight: bold;

            letter-spacing: 1px;

            border-radius: 4px;

        }


        .data {

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 13px;

            font-weight: bold;

            margin-left: 5px;

            border: 1px solid #777;

        }


        .titulo-header {

            height: 25px;

            display: flex;

            align-items: center;

            justify-content: center;

            color: white;

            border-radius: 4px;

            margin-bottom: 4px;

            font-size: 15px;

            font-weight: bold;

        }


        /* ================================================
           INFORMAÇÕES
        ================================================ */

        .informacoes {

            display: flex;

            gap: 30px;

            align-items: center;

            min-height: 24px;

            border: 1px solid #777;

            padding: 3px 7px;

            margin-bottom: 4px;

            font-size: 10px;

        }


        /* ================================================
           TABELA
        ================================================ */

        table {

            width: 100%;

            border-collapse: collapse;

            table-layout: fixed;

        }


        thead {

            display: table-header-group;

        }


        tfoot {

            display: table-footer-group;

        }


        th {

            background: #d9e1df;

            border: 1px solid #777;

            min-height: 22px;

            padding: 5px;

            font-size: 10px;

            font-weight: bold;

            text-align: center;

        }


        td {

            border: 1px solid #777;

            height: 21px;

            padding: 4px 6px;

            font-size: 9px;

            overflow: hidden;

            white-space: nowrap;

            text-overflow: ellipsis;

        }


        tr {

            page-break-inside: avoid;

            break-inside: avoid;

        }

        .m-1 {
            margin: 5px;
        }

        /* ================================================
           LARGURAS
        ================================================ */

        th.pedido {
            width: 6%;
        }

        th.codigo {
            width: 5%;
        }

        th.descricao {
            width: 29%;
        }

        th.marca {
            width: 10%;
        }

        th.identificacao {
            width: 10%;
        }

        th.local {
            width: 12%;
        }

        th.un {
            width: 4%;
        }

        th.qtd {
            width: 4%;
        }

        th.alt {
            width: 5%;
        }

        th.conf {
            width: 7%;
        }

        th.folha {
            width: 5%;
        }


        /* ================================================
           CÉLULAS
        ================================================ */

        .center {

            text-align: center;

        }


        .codigo-cell {

            font-weight: bold;

        }


        .descricao-cell {

            font-weight: 500;

        }


        .local-cell {

            color: #d00000;

            font-weight: bold;

        }


        .qtd-cell {

            font-weight: bold;

        }


        .alt-cell {

            background: #fff2cc;

            font-weight: bold;

        }


        .conf-cell {

            background: white;

        }


        .folha-cell {

            font-weight: bold;

        }


        /* ================================================
           TOTAL
        ================================================ */

        tfoot td {

            background: #e6e6e6;

            font-weight: bold;

            text-align: center;

            height: 23px;

        }


        /* ================================================
           RODAPÉ
        ================================================ */

        .rodape {

            display: flex;

            justify-content: space-between;

            margin-top: 5px;

            padding-top: 3px;

            border-top: 1px solid #777;

            font-size: 8px;

        }

        /* ================================================
           CORES DAS FOLHAS
        ================================================ */

        .folha-1 {

            background: #ff0000 !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-2 {

            background: #008a4b !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-3 {

            background: #ffd800 !important;

            color: #000 !important;

            border-radius: 5px;
        }


        .folha-4 {

            background: #777 !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-5 {

            background: #0757a5 !important;

            color: white !important;

            border-radius: 5px;
        }


        .folha-default {

            background: #ddd !important;

            color: #000 !important;

            border-radius: 5px;
        }


        .folha-cell {

            text-align: center;

            font-weight: bold;

            border-radius: 5px;
        }



        /* ================================================
           IMPRESSÃO
        ================================================ */

        @media print {

            body {

                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;

            }

        }

    `;

}

function classeFolhaImpressao(folha) {

    switch (String(folha).trim()) {

        case "1":
        case "1,1":
        case "1,2":
            return "folha-1";


        case "2":
        case "2,1":
        case "2,2":
            return "folha-2";


        case "3":
        case "3,1":
        case "3,2":
            return "folha-3";


        case "4":
            return "folha-4";


        case "5":
        case "5,1":
        case "5,2":
            return "folha-5";


        default:
            return "folha-default";

    }

}

function obterConfiguracaoFolha(folha) {

    const valor = String(folha ?? "").trim();

    switch (valor) {

        // ==========================================
        // VALIDADE
        // ==========================================

        case "1":
        case "1,1":
        case "1,2":

            return {
                titulo: "VALIDADE",
                classe: "folha-1",
                imprimir: true
            };


        // ==========================================
        // DIVERSOS
        // ==========================================

        case "2":
        case "2,1":
        case "2,2":

            return {
                titulo: "DIVERSOS",
                classe: "folha-2",
                imprimir: true
            };


        // ==========================================
        // TIGRE
        // ==========================================

        case "3":
        case "3,1":
        case "3,2":

            return {
                titulo: "TIGRE",
                classe: "folha-3",
                imprimir: true
            };


        // ==========================================
        // TUBOS
        // NÃO IMPRIMIR POR ENQUANTO
        // ==========================================

        case "4":

            return {
                titulo: "TUBOS",
                classe: "folha-4",
                imprimir: false
            };


        // ==========================================
        // GALPÃO 2/3
        // ==========================================

        case "5":

            return {
                titulo: "GALPÃO 2/3",
                classe: "folha-5",
                imprimir: true
            };


        // ==========================================
        // EXTERNO / MERCEDES
        // ==========================================

        case "5,1":

            return {
                titulo: "EXTERNO/MERCEDES",
                classe: "folha-5",
                imprimir: true
            };
        case "5,2":
            return {
                titulo: "Galpão 4",
                classe: "folha-5",
                imprimir: true
            };
        default:

            return {
                titulo: "SEM DEFINIÇÃO",
                classe: "folha-default",
                imprimir: false
            };

    }

}

function obterCorLoja(loja) {
    if (loja == "maranduba") {
        return "bg-success text-white"
    } else if (loja == "caraguatatuba") {
        return "bg-danger text-white"
    } else if (loja == "SaoSeba") {
        return "bg-warning"
    } else if (loja == "parafusos") {
        return "bg-info"
    }
}


// ===================================================
// obter numero dos prdidos e do lote
// ===================================================
function obterNumerosPedidos(pedido, lote = 1) {

    if (!Array.isArray(pedido.pedido)) {
        return [];
    }

    const numeros = pedido.pedido
        .map(produto => {

            const valor = produto.pedido;

            if (
                valor === undefined ||
                valor === null
            ) {
                return null;
            }

            // Pega somente os números
            const numero = String(valor).match(/\d+/);

            return numero ? numero[0] : null;

        })
        .filter(numero => numero !== null);

    // Remove números repetidos
    return [...new Set(numeros)];
}



// ===================================================
//                    ver pedido Fechado
// ===================================================


// ============================================================
// MOSTRAR PEDIDO fechado
// ============================================================

async function mostrarPedidoFechado(id, resetarFiltro = false) {

    try {

        const pedidoRef =
            ref(db, `pedidos/${id}`);

        const snapshot =
            await get(pedidoRef);

        if (!snapshot.exists()) {
            return;
        }

        const pedidoCompleto =
            snapshot.val();


        // ========================================================
        // PEDIDO ATUAL
        // ========================================================

        pedidoAtualId = id;

        pedidoAtualParaImprimir = {
            id: id,
            dados: pedidoCompleto
        };


        // ========================================================
        // PRODUTOS
        // ========================================================

        produtosPedido =
            Array.isArray(pedidoCompleto.pedido)
                ? pedidoCompleto.pedido
                : [];


        // ========================================================
        // CABEÇALHO
        // ========================================================

        modalTitleMostrarPedidoFechado.textContent =
            `PEDIDO ${id}`;

        modalLojaMostrarPedidoFechado.textContent =
            pedidoCompleto.loja || "-";

        modalDataMostrarPedidoFechado.textContent =
            pedidoCompleto.criadoEm || "-";


        // ========================================================
        // RESUMO
        // ========================================================

        atualizarResumoPedidoFechado();


        // ========================================================
        // FILTRO
        // ========================================================

        if (resetarFiltro) {

            filtroFolhaPedido.value = "todas";

        }

        preencherFiltroFolhasFechado();


        // ========================================================
        // RENDERIZA TABELA
        // ========================================================

        aplicarFiltroFolhaFechado();
    }

    catch (error) {

        console.error(
            "Erro ao carregar pedido:",
            error
        );

    }
}

function atualizarResumoPedidoFechado() {

    const produtos =
        produtosPedido;


    const totalProdutos =
        produtos.length;


    const totalSeparados =
        produtos.filter(
            produto => produto.separado === true
        ).length;


    const totalPendentes =
        totalProdutos - totalSeparados;


    const folhas =
        new Set(
            produtos
                .map(produto => produto.folha)
                .filter(
                    folha =>
                        folha !== undefined &&
                        folha !== null &&
                        folha !== ""
                )
        );


    totalProdutosPedido.textContent =
        totalProdutos;

    totalSeparadosPedido.textContent =
        totalSeparados;

    totalPendentesPedido.textContent =
        totalPendentes;

    totalFolhasPedido.textContent =
        folhas.size;
}

// ============================================================
// PREENCHER FILTRO DE FOLHAS
// ============================================================

function preencherFiltroFolhasFechado() {

    const valorAtual =
        filtroFolhaPedido.value;


    const folhas = [
        ...new Set(
            produtosPedido
                .map(produto => produto.folha)
                .filter(
                    folha =>
                        folha !== undefined &&
                        folha !== null &&
                        folha !== ""
                )
        )
    ];


    // Ordena usando a mesma lógica das folhas
    folhas.sort(
        (a, b) =>
            normalizarFolha(a) -
            normalizarFolha(b)
    );


    filtroFolhaPedido.innerHTML = `
        <option value="todas">
            Todas as folhas
        </option>
    `;


    folhas.forEach(folha => {

        const option =
            document.createElement("option");

        option.value =
            folha;

        option.textContent =
            `Folha ${folha}`;

        filtroFolhaPedido.appendChild(
            option
        );

    });


    // Tenta manter a folha selecionada
    if (
        folhas.some(
            folha =>
                String(folha) ===
                String(valorAtual)
        )
    ) {

        filtroFolhaPedido.value =
            valorAtual;

    } else {

        filtroFolhaPedido.value =
            "todas";

    }
}

// ============================================================
// APLICAR FILTRO DE FOLHA
// ============================================================

function aplicarFiltroFolhaFechado() {

    const filtro =
        filtroFolhaPedido.value;



    let produtosFiltrados =
        [...produtosPedido];


    // ========================================================
    // FILTRAR
    // ========================================================

    if (filtro !== "todas") {

        produtosFiltrados =
            produtosPedido.filter(
                produto =>
                    String(produto.folha) ===
                    String(filtro)
            );

    }

    // ========================================================
    // ORDENAR
    // ========================================================

    produtosFiltrados.sort(
        (a, b) =>
            normalizarFolha(a.folha) -
            normalizarFolha(b.folha)
    );


    // ========================================================
    // RENDERIZAR
    // ========================================================

    renderizarTabelaPedidoFechado(
        produtosFiltrados
    );
}


function renderizarTabelaPedidoFechado(produtos) {

    tabelaMostrarPedido.innerHTML = "";


    produtos.forEach((produto, index) => {

        const tr =
            document.createElement("tr");


        // ====================================================
        // QUANTIDADES
        // ====================================================

        const quantidadeOriginal =
            produto.atual ?? "";


        const quantidadeAlterada =
            produto.alt ?? "";


        const quantidadeFinal =
            quantidadeAlterada !== ""
                ? quantidadeAlterada
                : quantidadeOriginal;


        // ====================================================
        // ALTERAÇÃO
        // ====================================================

        const possuiAlteracao =
            produto.alt !== undefined &&
            produto.alt !== null &&
            produto.alt !== "";


        // ====================================================
        // STATUS
        // ====================================================

        const statusAtual =
            produto.status ||
            "Em separação";


        if (statusAtual === "Alteração") {

            tr.classList.add(
                "linha-alteracao"
            );

        }


        if (statusAtual === "Alterado") {

            tr.classList.add(
                "linha-alterado"
            );

        }


        const opcoesStatus = [
            "Em separação",
            "Separado",
            "Conferido",
            "Alteração",
            "Alterado"
        ];


        const statusHTML = `
            <select
                class="select-status ${classeStatus(statusAtual)}"
                data-pedido-id="${pedidoAtualId}"
                data-produto-id="${produto.id}"
            >

                ${opcoesStatus.map(status => `
                    <option
                        value="${status}"
                        ${statusAtual === status ? "selected" : ""}
                    >
                        ${status}
                    </option>
                `).join("")}

            </select>
        `;


        // ====================================================
        // FOLHA
        // ====================================================

        const classeFolhaAtual =
            classeFolha(produto.folha);


        const opcoesFolha =
            folhasDisponiveis
                .map(folha => {

                    return `
                        <option
                            value="${folha}"
                            ${String(produto.folha) === String(folha)
                            ? "selected"
                            : ""}
                        >
                            ${folha}
                        </option>
                    `;

                })
                .join("");


        // ====================================================
        // HTML DA LINHA
        // ====================================================

        tr.innerHTML = `

            <td class="text-center">
                ${statusHTML}
            </td>


            <td class="text-center fw-bold">
                ${produto.codigo ?? ""}
            </td>


            <td>
                ${produto.descricao ?? ""}
            </td>


            <td class="text-center">
                ${produto.identificacao ?? ""}
            </td>


            <td class="text-center">
                ${produto.marca ?? ""}
            </td>


            <td class="text-center text-danger">
                ${produto.local ?? ""}
            </td>


            <td class="qtd-original">
                ${quantidadeOriginal}
            </td>


            <td class="${possuiAlteracao ? "qtd-alteracao" : ""}">
                ${possuiAlteracao ? quantidadeAlterada : ""}
            </td>


            <td class="qtd-final">
                ${quantidadeFinal}
            </td>


            <td class="text-center">

                <select
                    class="select-folha ${classeFolhaAtual}"
                    data-pedido-id="${pedidoAtualId}"
                    data-produto-id="${produto.id}"
                >

                    <option value="">
                        -
                    </option>

                    ${opcoesFolha}

                </select>

            </td>

        `;

        tabelaMostrarPedidoFechado.appendChild(
            tr
        );

    });
}


