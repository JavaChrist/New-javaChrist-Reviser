// Importation des modules Firebase
import { auth, storage } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Vérifier si l'utilisateur est authentifié
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // L'utilisateur est authentifié, afficher les informations du client
            displayClientInfo(user);
            displayFileList(user.email);
        } else {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
            window.location.href = "/fr/login.html";
        }
    });
}

// Afficher les informations du client connecté
function displayClientInfo(user) {
    const clientInfoDiv = document.getElementById("client-info");

    const displayName = user.displayName || "Client";
    const email = user.email;

    clientInfoDiv.innerHTML = `
        <h2>Bonjour, ${displayName}</h2>
        <p>Email : ${email}</p>
    `;
}

// Afficher la liste des fichiers
async function displayFileList(email) {
    const categories = ["Facture", "Document", "Téléchargement"];

    for (const category of categories) {
        const categoryDiv = document.getElementById(category);
        const categoryUl = categoryDiv.querySelector("ul");
        categoryUl.innerHTML = ""; // Vider la liste

        try {
            // Vérifier si l'utilisateur est connecté
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("Vous devez être connecté");
            }

            console.log(`Tentative d'accès au dossier: user_files/${email}/${category}`);
            const categoryRef = ref(storage, `user_files/${email}/${category}`);
            const result = await listAll(categoryRef);

            if (result.items.length === 0) {
                categoryUl.innerHTML = "<li>Aucun fichier disponible</li>";
                continue;
            }

            for (const itemRef of result.items) {
                try {
                    const url = await getDownloadURL(itemRef);
                    const li = document.createElement("li");
                    li.classList.add("file-item");
                    li.innerHTML = `
                        <span>${itemRef.name}</span>
                        <a href="${url}" target="_blank" class="download-link">
                            <i class="bx bx-download"></i> Télécharger
                        </a>
                    `;
                    categoryUl.appendChild(li);
                } catch (error) {
                    console.error(`Erreur pour le fichier ${itemRef.name}:`, error);
                }
            }
        } catch (error) {
            console.error(`Erreur pour la catégorie ${category}:`, error);
            categoryUl.innerHTML = `<li>Erreur lors du chargement des fichiers: ${error.message}</li>`;
        }
    }
}

// Fonction de déconnexion
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = "/fr/login.html";
        })
        .catch((error) => {
            console.error("Erreur de déconnexion :", error.message);
        });
}

// Vérifier l'état d'authentification lorsque la page est chargée
document.addEventListener("DOMContentLoaded", function () {
    checkAuthState();
});

// Écouter le clic sur le bouton de déconnexion
document.getElementById("logout").addEventListener("click", logout);
