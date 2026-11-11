import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { auth } from "./firebase.js";

const emailInput = document.getElementById("emailInput");
const senhaInput = document.getElementById("senhaInput");
const emailError = document.getElementById("emailError");
const senhaError = document.getElementById("senhaError");
const loginFeedback = document.getElementById("loginFeedback");
const form = document.getElementById("form");

setPersistence(auth, browserLocalPersistence)
    .then(() => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            limparErrosLogin();

            const email = emailInput.value.trim();
            const senha = senhaInput.value;

            if (!validarLogin(email, senha)) {
                return;
            }

            signInWithEmailAndPassword(auth, email, senha)
                .then(async (userCredential) => {
                    const user = userCredential.user;

                    await user.getIdToken();
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);

                    mostrarErroCampo(emailInput, emailError, "Email ou senha invalidos");
                    mostrarErroCampo(senhaInput, senhaError, "Confira sua senha");
                });
        });
    });

emailInput.addEventListener("input", () => limparErroCampo(emailInput, emailError));
senhaInput.addEventListener("input", () => limparErroCampo(senhaInput, senhaError));

function validarLogin(email, senha) {
    let loginValido = true;

    if (!emailInput.validity.valid || !email.includes("@")) {
        mostrarErroCampo(emailInput, emailError, "Email invalido");
        loginValido = false;
    }

    if (!senha) {
        mostrarErroCampo(senhaInput, senhaError, "Informe sua senha");
        loginValido = false;
    }

    return loginValido;
}

function mostrarFeedback(mensagem, tipo) {
    loginFeedback.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show text-start" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;
}

function mostrarErroCampo(input, erroElemento, mensagem) {
    input.classList.add("err");
    erroElemento.textContent = mensagem;
}

function limparErroCampo(input, erroElemento) {
    input.classList.remove("err");
    erroElemento.textContent = "";
}

function limparErrosLogin() {
    limparErroCampo(emailInput, emailError);
    limparErroCampo(senhaInput, senhaError);
    loginFeedback.innerHTML = "";
}
