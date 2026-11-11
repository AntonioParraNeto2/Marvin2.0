// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCU-RJLrazgocXzhtVb5xF4dcwMxkKc_Wk",
    authDomain: "helplogistics-cae93.firebaseapp.com",
    databaseURL: "https://helplogistics-cae93-default-rtdb.firebaseio.com",
    projectId: "helplogistics-cae93",
    storageBucket: "helplogistics-cae93.firebasestorage.app",
    messagingSenderId: "187684741056",
    appId: "1:187684741056:web:232b53f53df24ef8ec3225",
    measurementId: "G-8BGPBZFE5E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
