// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Configuration Firebase (ajoute tes informations de configuration Firebase ici)
const firebaseConfig = {
  apiKey: "AIzaSyBYEmTNCfhU-dNjHlEA7u_rZydR7NwfoYo",
  authDomain: "javachrist-b02f3.firebaseapp.com",
  projectId: "javachrist-b02f3",
  storageBucket: "javachrist-b02f3.firebasestorage.app",
  messagingSenderId: "987983540724",
  appId: "1:987983540724:web:fa97255d9ae41f03ad89a1",
  measurementId: "G-9C8Y48XBHR"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Vérifier si l'utilisateur est authentifié
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // L'utilisateur est authentifié, afficher les informations du client
            displayClientInfo(user);
            displayFileList(user.email);
        } else {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
            window.location.href = "/en/login-en.html";
        }
    });
}

// Afficher les informations du client connecté
function displayClientInfo(user) {
    const clientInfoDiv = document.getElementById("client-info");

    const displayName = user.displayName || "Client";
    const email = user.email; 

    clientInfoDiv.innerHTML = `
        <h2>Hello, ${displayName}</h2>
        <p>Email: ${email}</p>
    `;
}

// Afficher la liste des fichiers
async function displayFileList(email) {
    const categories = ["Facture", "Document", "Téléchargement"];
    categories.forEach(async (category) => {
        console.log(`Checking files for category: ${category}`);
        const categoryRef = ref(storage, `user_files/${email}/${category}`);
        const categoryUl = document.querySelector(`#${category} ul`);
        if (!categoryUl) {
            console.error(`No HTML element found for category: ${category}`);
            return;
        }
        categoryUl.innerHTML = ""; // Vider la liste avant de la remplir

        try {
            const fileList = await listAll(categoryRef);
            console.log(`Found ${fileList.items.length} files in category: ${category}`);
            fileList.items.forEach(async (itemRef) => {
                try {
                    const fileURL = await getDownloadURL(itemRef);
                    const li = document.createElement("li");
                    li.classList.add("file-item");
                    li.innerHTML = `<span>${itemRef.name}</span> <a href="${fileURL}" download>Download</a>`;
                    categoryUl.appendChild(li);
                } catch (error) {
                    console.error(`Error getting download URL for file ${itemRef.name}:`, error);
                }
            });
        } catch (error) {
            console.error(`Error retrieving files for category ${category}:`, error);
        }
    });
}

// Fonction de déconnexion
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = "/en/login-en.html";
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
        });
}

// Vérifier l'état d'authentification lorsque la page est chargée
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    } else {
        console.error("Logout button not found in the DOM.");
    }
    
    checkAuthState();
});
