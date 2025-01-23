// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYEmTNCfhU-dNjHlEA7u_rZydR7NwfoYo",
    authDomain: "javachrist-b02f3.firebaseapp.com",
    projectId: "javachrist-b02f3",
    storageBucket: "javachrist-b02f3.firebasestorage.app",
    messagingSenderId: "987983540724",
    appId: "1:987983540724:web:fa97255d9ae41f03ad89a1",
    measurementId: "G-9C8Y48XBHR"
};

// Initialisation Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage }; 