import { auth, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Création de compte client
document.getElementById("client-creation-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const clientName = document.getElementById("client-name").value;
  const clientEmail = document.getElementById("client-email").value;
  const clientPassword = document.getElementById("client-password").value;
  console.log("Tentative de création avec :", { clientName, clientEmail });
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, clientEmail, clientPassword);
    const user = userCredential.user;
    console.log("Compte créé avec succès :", userCredential.user);

    // Mise à jour du profil utilisateur avec le nom
    await updateProfile(user, { displayName: clientName });
    console.log("Profil mis à jour avec succès");

    alert(`Compte client créé avec succès pour ${clientName}`);
    document.getElementById("client-creation-form").reset();
  } catch (error) {
    alert("Erreur lors de la création du compte client : " + error.message);
  }
});

// Téléversement de fichiers
document.getElementById("file-upload-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("target-client-email").value.trim();
  const file = document.getElementById("upload-file").files[0];
  const category = document.getElementById("category-select").value;

  if (!email || !file || !category) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  try {
    // Vérifier si l'utilisateur est connecté
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Vous devez être connecté");
    }

    // Forcer le rafraîchissement du token
    try {
      await currentUser.getIdToken(true);
      console.log("Token rafraîchi avec succès");
    } catch (tokenError) {
      console.error("Erreur lors du rafraîchissement du token:", tokenError);
      throw new Error("Erreur d'authentification");
    }

    // Log des informations de l'utilisateur
    console.log("Utilisateur connecté:", {
      email: currentUser.email,
      uid: currentUser.uid,
      isAdmin: currentUser.email === "support@javachrist.fr",
      token: await currentUser.getIdToken()
    });

    // Vérifier si l'utilisateur est admin
    if (currentUser.email !== "support@javachrist.fr") {
      throw new Error("Seul l'administrateur peut téléverser des fichiers");
    }

    // Créer le chemin du fichier
    const filePath = `user_files/${email}/${category}/${file.name}`;
    console.log("Tentative de téléversement:", {
      filePath,
      fileSize: file.size,
      fileType: file.type,
      storage: storage,
      currentUser: currentUser.email
    });

    // Créer la référence au fichier
    const fileRef = ref(storage, filePath);
    console.log("Référence du fichier créée:", fileRef);

    // Préparer les métadonnées
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'uploadedBy': currentUser.email,
        'uploadedFor': email,
        'category': category,
        'timestamp': new Date().toISOString()
      }
    };

    // Téléverser le fichier
    console.log("Début du téléversement...");
    const snapshot = await uploadBytes(fileRef, file, metadata);
    console.log("Téléversement réussi:", snapshot);

    // Obtenir l'URL du fichier
    const fileURL = await getDownloadURL(fileRef);
    console.log("URL du fichier:", fileURL);

    alert("Fichier téléversé avec succès");
    document.getElementById("file-upload-form").reset();
  } catch (error) {
    console.error("Erreur détaillée:", {
      code: error.code,
      message: error.message,
      fullError: error,
      stack: error.stack
    });
    alert("Erreur lors du téléversement : " + error.message);
  }
});

// Gérer la visibilité du mot de passe pour la création de compte client
document.getElementById('client-login-eye').addEventListener('click', function () {
  const passwordInput = document.getElementById('client-password');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    this.classList.replace('ri-eye-off-line', 'ri-eye-line');
  } else {
    passwordInput.type = 'password';
    this.classList.replace('ri-eye-line', 'ri-eye-off-line');
  }
});

// Fonction pour lister tous les fichiers de tous les utilisateurs
async function listAllFiles() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.email !== "support@javachrist.fr") {
      throw new Error("Accès non autorisé");
    }

    const userFilesRef = ref(storage, 'user_files');
    const userFolders = await listAll(userFilesRef);

    const fileListContainer = document.createElement('div');
    fileListContainer.id = 'all-files-list';
    fileListContainer.className = 'files-container';

    for (const userFolder of userFolders.prefixes) {
      const userEmail = userFolder.name;
      const userSection = document.createElement('div');
      userSection.className = 'user-section';
      userSection.innerHTML = `<h3>Fichiers de ${userEmail}</h3>`;

      const categories = ["Facture", "Document", "Téléchargement"];
      for (const category of categories) {
        const categoryRef = ref(storage, `user_files/${userEmail}/${category}`);
        try {
          const categoryFiles = await listAll(categoryRef);
          if (categoryFiles.items.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `<h4>${category}</h4>`;
            const fileList = document.createElement('ul');

            for (const file of categoryFiles.items) {
              const url = await getDownloadURL(file);
              const li = document.createElement('li');
              li.innerHTML = `
                                <span>${file.name}</span>
                                <a href="${url}" target="_blank" class="download-link">
                                    <i class="bx bx-download"></i> Télécharger
                                </a>
                            `;
              fileList.appendChild(li);
            }
            categoryDiv.appendChild(fileList);
            userSection.appendChild(categoryDiv);
          }
        } catch (error) {
          console.error(`Erreur pour ${userEmail}/${category}:`, error);
        }
      }
      fileListContainer.appendChild(userSection);
    }

    // Ajouter ou mettre à jour la liste dans le DOM
    const existingContainer = document.getElementById('all-files-list');
    if (existingContainer) {
      existingContainer.replaceWith(fileListContainer);
    } else {
      document.querySelector('main').appendChild(fileListContainer);
    }

  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error);
    alert("Erreur lors de la récupération des fichiers: " + error.message);
  }
}

// Ajouter un bouton pour rafraîchir la liste des fichiers
const refreshButton = document.createElement('button');
refreshButton.textContent = "Rafraîchir la liste des fichiers";
refreshButton.className = "login__button";
refreshButton.onclick = listAllFiles;

// Ajouter le bouton au DOM
document.querySelector('main').appendChild(refreshButton);

// Charger la liste des fichiers au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.email === "support@javachrist.fr") {
    listAllFiles();
  }
});