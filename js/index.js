import { auth, db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const navPerfil = document.getElementById("navPerfil");

const tabelaPedidosAbertos =
    document.querySelector("#tabelaPedidosAbertos");

const tabelaPedidosFechados =
    document.querySelector("#tabelaPedidosFechados");


// ======================================================
// ESTADO
// ======================================================

let todosPedidos = [];


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    inicializarTabelas();

    configurarPesquisa();

    observarPedidos();

    observarUsuario();

});


// ======================================================
// PREPARA AS TABELAS
// ======================================================

function inicializarTabelas() {

    // ------------------------------
    // PEDIDOS ABERTOS
    // ------------------------------

    if (tabelaPedidosAbertos) {

        const thead = tabelaPedidosAbertos.querySelector("thead");

        let tbody = tabelaPedidosAbertos.querySelector("tbody");

        if (!tbody) {
            tbody = document.createElement("tbody");
            tabelaPedidosAbertos.appendChild(tbody);
        }

        tbody.id = "tbodyPedidosAbertos";
    }


    // ------------------------------
    // PEDIDOS FECHADOS
    // ------------------------------

    if (tabelaPedidosFechados) {

        let tbody = tabelaPedidosFechados.querySelector("tbody");

        if (!tbody) {
            tbody = document.createElement("tbody");
            tabelaPedidosFechados.appendChild(tbody);
        }

        tbody.id = "tbodyPedidosFechados";
    }

}


// ======================================================
// USUÁRIO LOGADO
// ======================================================

function observarUsuario() {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            // Se não estiver logado
            window.location.href = "login.html";

            return;
        }

        criarPerfil(user);

    });

}


// ======================================================
// PERFIL DO USUÁRIO
// ======================================================

function criarPerfil(user) {

    if (!navPerfil) {
        return;
    }


    const nome =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Usuário";


    const email =
        user.email || "";


    navPerfil.innerHTML = `

        <a class="nav-link dropdown-toggle"
           href="#"
           id="userDropdown"
           role="button"
           data-toggle="dropdown"
           aria-haspopup="true"
           aria-expanded="false">

            <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                ${escaparHTML(nome)}
            </span>

            <i class="fas fa-user-circle fa-lg"></i>

        </a>


        <div
            class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown">

            <div class="dropdown-header">

                <strong>${escaparHTML(nome)}</strong>

                <br>

                <small class="text-muted">
                    ${escaparHTML(email)}
                </small>

            </div>

            <div class="dropdown-divider"></div>


            <a class="dropdown-item" href="#">
                <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Perfil
            </a>


            <a class="dropdown-item" href="#">
                <i class="fas fa-cog fa-sm fa-fw mr-2 text-gray-400"></i>
                Configurações
            </a>


            <div class="dropdown-divider"></div>


            <a
                class="dropdown-item"
                href="#"
                data-toggle="modal"
                data-target="#logoutModal">

                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>

                Sair

            </a>

        </div>

    `;


    configurarLogout();

}


// ======================================================
// LOGOUT
// ======================================================

function configurarLogout() {

    const botaoSair =
        document.querySelector('#logoutModal a[href="login.html"]');


    if (!botaoSair) {
        return;
    }


    botaoSair.addEventListener("click", async (event) => {

        event.preventDefault();

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (erro) {

            console.error("Erro ao sair:", erro);

            alert("Não foi possível finalizar a sessão.");

        }

    });

}


// ======================================================
// OBSERVAR PEDIDOS NO FIREBASE
// ======================================================

function observarPedidos() {

    const pedidosRef = ref(db, "pedidos");


    onValue(
        pedidosRef,
        (snapshot) => {

            const dados = snapshot.val() || {};

            todosPedidos = [];


            Object.entries(dados).forEach(([id, pedido]) => {

                if (!pedido) {
                    return;
                }


                todosPedidos.push({

                    id: id,

                    loja: pedido.loja || "-",

                    criadoEm:
                        pedido.criadoEm ||
                        "-",

                    aberto:
                        pedido.aberto === true,

                    status:
                        pedido.status ||
                        "",

                    pedido:
                        pedido.pedido || []

                });

            });


            atualizarDashboard();

        },

        (erro) => {

            console.error(
                "Erro ao carregar pedidos:",
                erro
            );

        }

    );

}


// ======================================================
// ATUALIZA O DASHBOARD
// ======================================================

function atualizarDashboard() {

    const pedidosAbertos =
        todosPedidos.filter(
            pedido => pedido.aberto === true
        );


    const pedidosFechados =
        todosPedidos.filter(
            pedido => pedido.aberto === false
        );


    atualizarContadores(
        pedidosAbertos,
        pedidosFechados
    );


    renderizarPedidosAbertos(
        pedidosAbertos
    );


    renderizarPedidosFechados(
        pedidosFechados
    );

}


// ======================================================
// CONTADORES
// ======================================================

function atualizarContadores(
    pedidosAbertos,
    pedidosFechados
) {

    const cards =
        document.querySelectorAll(
            ".row .card .h5"
        );


    if (cards.length < 2) {
        return;
    }


    // Primeiro card
    cards[0].textContent =
        pedidosFechados.length;


    // Segundo card
    cards[1].textContent =
        pedidosAbertos.length;

}


// ======================================================
// PEDIDOS ABERTOS
// ======================================================

function renderizarPedidosAbertos(
    pedidos
) {

    const tbody =
        document.getElementById(
            "tbodyPedidosAbertos"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (pedidos.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="text-center text-muted py-4">

                    <i class="fas fa-folder-open fa-2x mb-2"></i>

                    <br>

                    Nenhum pedido aberto.

                </td>

            </tr>

        `;

        return;
    }


    // Mais recentes primeiro
    const pedidosOrdenados =
        ordenarPorData(pedidos);


    pedidosOrdenados.forEach((pedido) => {

        const dataHora =
            separarDataHora(
                pedido.criadoEm
            );


        const tr =
            document.createElement("tr");


        tr.classList.add(
            "pedido-row"
        );


        tr.style.cursor =
            "pointer";


        const numerosPedidos =
            obterNumerosPedidos(pedido);

        const pedidosTexto =
            numerosPedidos.length > 0
                ? numerosPedidos.join(", ")
                : "-";


        tr.innerHTML = `
                
                <td>
                    ${escaparHTML(pedido.loja)}
                </td>
                
                <td>
                    <strong>
                        ${escaparHTML(pedidosTexto)}
                    </strong>
                </td>
                
                <td>
                    ${escaparHTML(dataHora.data)}
                </td>
                
                <td>
                    ${escaparHTML(dataHora.hora)}
                </td>
                
            `;


        tr.addEventListener(
            "click",
            () => {

                window.location.href =
                    "gerenciarSeparacao.html";

            }
        );


        tbody.appendChild(tr);

    });

}


// ======================================================
// PEDIDOS FECHADOS
// ======================================================

function renderizarPedidosFechados(
    pedidos
) {

    const tbody =
        document.getElementById(
            "tbodyPedidosFechados"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (pedidos.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="2"
                    class="text-center text-muted py-4">

                    Nenhum pedido fechado.

                </td>

            </tr>

        `;

        return;
    }


    // Ordena do mais recente para o mais antigo
    const pedidosOrdenados =
        ordenarPorData(pedidos);


    // Pega somente os 5 últimos
    const ultimosCinco =
        pedidosOrdenados.slice(0, 5);


    ultimosCinco.forEach((pedido) => {

        const dataHora =
            separarDataHora(
                pedido.criadoEm
            );


        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${escaparHTML(pedido.loja)}
            </td>

            <td>
                ${escaparHTML(dataHora.data)}
            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ======================================================
// ORDENAÇÃO POR DATA
// ======================================================

function ordenarPorData(
    pedidos
) {

    return [...pedidos].sort(
        (a, b) => {

            const dataA =
                converterData(a.criadoEm);

            const dataB =
                converterData(b.criadoEm);


            return dataB - dataA;

        }
    );

}


// ======================================================
// CONVERTE DATA DO FIREBASE
// ======================================================

function converterData(
    valor
) {

    if (!valor) {
        return 0;
    }


    // Se já for Date
    if (valor instanceof Date) {
        return valor.getTime();
    }


    // Timestamp numérico
    if (
        typeof valor === "number"
    ) {

        return valor;

    }


    const texto =
        String(valor).trim();


    // Tenta formato ISO
    const iso =
        Date.parse(texto);


    if (!isNaN(iso)) {
        return iso;
    }


    // Tenta:
    // DD/MM/YYYY HH:mm:ss
    const partes =
        texto.split(" ");


    if (partes.length >= 1) {

        const data =
            partes[0].split("/");


        if (data.length === 3) {

            const dia =
                parseInt(data[0]);

            const mes =
                parseInt(data[1]) - 1;

            const ano =
                parseInt(data[2]);


            let hora = 0;
            let minuto = 0;
            let segundo = 0;


            if (partes[1]) {

                const horario =
                    partes[1].split(":");


                hora =
                    parseInt(horario[0]) || 0;

                minuto =
                    parseInt(horario[1]) || 0;

                segundo =
                    parseInt(horario[2]) || 0;

            }


            return new Date(
                ano,
                mes,
                dia,
                hora,
                minuto,
                segundo
            ).getTime();

        }

    }


    return 0;

}


// ======================================================
// SEPARA DATA E HORÁRIO
// ======================================================

function separarDataHora(
    valor
) {

    if (!valor) {

        return {
            data: "-",
            hora: "-"
        };

    }


    const texto =
        String(valor);


    // ISO
    if (
        texto.includes("T")
    ) {

        const data =
            new Date(texto);


        if (!isNaN(data.getTime())) {

            return {

                data:
                    data.toLocaleDateString(
                        "pt-BR"
                    ),

                hora:
                    data.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )

            };

        }

    }


    // DD/MM/YYYY HH:mm:ss
    const partes =
        texto.split(" ");


    if (partes.length >= 2) {

        return {

            data: partes[0],

            hora:
                partes[1].substring(
                    0,
                    5
                )

        };

    }


    return {

        data: texto,

        hora: "-"

    };

}


// ======================================================
// PESQUISA
// ======================================================

function configurarPesquisa() {

    const inputs =
        document.querySelectorAll(
            ".navbar-search input"
        );


    inputs.forEach((input) => {

        input.addEventListener(
            "input",
            () => {

                const termo =
                    input.value
                        .trim()
                        .toLowerCase();


                if (!termo) {

                    atualizarDashboard();

                    return;

                }


                const resultados =
                    todosPedidos.filter(
                        pedido => {

                            const loja =
                                String(
                                    pedido.loja || ""
                                ).toLowerCase();


                            const id =
                                String(
                                    pedido.id || ""
                                ).toLowerCase();


                            const data =
                                String(
                                    pedido.criadoEm || ""
                                ).toLowerCase();


                            return (
                                loja.includes(termo) ||
                                id.includes(termo) ||
                                data.includes(termo)
                            );

                        }
                    );


                const abertos =
                    resultados.filter(
                        pedido =>
                            pedido.aberto === true
                    );


                const fechados =
                    resultados.filter(
                        pedido =>
                            pedido.aberto === false
                    );


                atualizarContadores(
                    abertos,
                    fechados
                );


                renderizarPedidosAbertos(
                    abertos
                );


                renderizarPedidosFechados(
                    fechados
                );

            }
        );

    });

}


// ======================================================
// ESCAPA HTML
// ======================================================

function escaparHTML(
    valor
) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function obterNumerosPedidos(pedido) {

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