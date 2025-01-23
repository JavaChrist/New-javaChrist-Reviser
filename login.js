// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Adresse email de l'administrateur
const adminEmail = "support@javachrist.fr";

// Fonction de connexion
function login(email, password, lang) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Connexion réussie
            console.log("Connexion réussie :", userCredential.user.email);

            // Redirection selon le type d'utilisateur
            if (email === adminEmail) {
                // Redirection vers la page admin
                window.location.href = "/admin.html";
            } else {
                // Redirection pour un utilisateur standard (français ou anglais)
                window.location.href = lang === 'fr' ? "/fr/client.html" : "/en/customer.html";
            }
        })
        .catch((error) => {
            console.error("Erreur de connexion :", error.message);
            alert(lang === 'fr' ? "Email ou mot de passe incorrect" : "Incorrect email or password");
        });
}

// Gérer la visibilité du mot de passe
document.getElementById('login-eye').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.replace('ri-eye-off-line', 'ri-eye-line');
    } else {
        passwordInput.type = 'password';
        this.classList.replace('ri-eye-line', 'ri-eye-off-line');
    }
});

// Gestion du formulaire de connexion
document.querySelector("#login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const lang = document.documentElement.lang; // Détecte la langue de la page

    if (!email || !password) {
        alert(lang === 'fr' ? "Veuillez remplir tous les champs." : "Please fill in all fields.");
        return;
    }

    // Appel de la fonction login avec l'email, le mot de passe et la langue
    login(email, password, lang);
});

// Gestion de "Mot de passe oublié"
document.querySelector('.login__forgot').addEventListener('click', function(event) {
  event.preventDefault(); // Empêche le lien de recharger la page

  // Demande l'email de l'utilisateur pour la réinitialisation
  const userEmail = prompt("Veuillez entrer votre adresse e-mail pour réinitialiser le mot de passe :");

  if (userEmail) {
    sendPasswordResetEmail(auth, userEmail.trim())
      .then(() => {
        alert("Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.");
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error.message);
        alert("Impossible d'envoyer l'e-mail de réinitialisation. Veuillez vérifier l'adresse e-mail saisie.");
      });
  } else {
    alert("Veuillez entrer une adresse e-mail valide.");
  }
});
