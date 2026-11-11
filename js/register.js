import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { auth, db } from "./firebase.js";

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');
const confirmarSenhaInput = document.getElementById('confirmPassword');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const form = document.getElementById('form');

if (form && nameInput && emailInput && senhaInput && confirmarSenhaInput) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limparErrosFormulario();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (!validarFormulario(name, email, senha, confirmarSenha)) {
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await updateProfile(user, {
                    displayName: name
                });

                await criarEstruturaInicial(user, name);

                window.location.href = "index.html";
            })
            .catch((error) => {
                console.log(error.message);
                tratarErroCadastro(error);
            });
    });

    nameInput.addEventListener('input', () => limparErroCampo(nameInput, nameError));
    emailInput.addEventListener('input', () => limparErroCampo(emailInput, emailError));
    senhaInput.addEventListener('input', () => limparErroCampo(senhaInput, passwordError));
    confirmarSenhaInput.addEventListener('input', () => limparErroCampo(confirmarSenhaInput, confirmPasswordError));
}

function validarFormulario(name, email, senha, confirmarSenha) {
    let formularioValido = true;

    if (!name) {
        mostrarErroCampo(nameInput, nameError, "Informe seu nome");
        formularioValido = false;
    }

    if (!emailInput.validity.valid || !email.includes("@")) {
        mostrarErroCampo(emailInput, emailError, "Email invalido");
        formularioValido = false;
    }

    if (senha.length < 6) {
        mostrarErroCampo(senhaInput, passwordError, "A senha precisa ter 6 ou mais caracteres");
        formularioValido = false;
    }

    if (senha !== confirmarSenha) {
        mostrarErroCampo(confirmarSenhaInput, confirmPasswordError, "Senhas nao coincidem");
        formularioValido = false;
    }

    return formularioValido;
}

function tratarErroCadastro(error) {
    if (error.code === "auth/invalid-email") {
        mostrarErroCampo(emailInput, emailError, "Email invalido");
        return;
    }

    if (error.code === "auth/weak-password") {
        mostrarErroCampo(senhaInput, passwordError, "A senha precisa ter 6 ou mais caracteres");
        return;
    }

    if (error.code === "auth/email-already-in-use") {
        mostrarErroCampo(emailInput, emailError, "Este email ja esta cadastrado");
        return;
    }

    mostrarErroCampo(emailInput, emailError, "Nao foi possivel cadastrar. Confira os dados e tente novamente.");
}

function mostrarErroCampo(input, erroElemento, mensagem) {
    input.classList.add('err');
    erroElemento.textContent = mensagem;
}

function limparErroCampo(input, erroElemento) {
    input.classList.remove('err');
    erroElemento.textContent = "";
}

function limparErrosFormulario() {
    limparErroCampo(nameInput, nameError);
    limparErroCampo(emailInput, emailError);
    limparErroCampo(senhaInput, passwordError);
    limparErroCampo(confirmarSenhaInput, confirmPasswordError);
}

async function criarEstruturaInicial(user, nomeUsuario) {
    const userRef = ref(db, `usuarios/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        await set(userRef, {
            perfil: {
                nome: nomeUsuario || user.displayName || "",
                email: user.email,
                criadoEm: new Date().toISOString(),
            }
        });
    }
}
