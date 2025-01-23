// Ouvrir le chat en affichant la modale
function openChat() {
  document.getElementById("chat-modal").style.display = "flex";
}

// Fermer le chat en cachant la modale
function closeChat() {
  document.getElementById("chat-modal").style.display = "none";
}

// Fonction pour envoyer un message
function sendMessage() {
  const message = document.getElementById("message").value.toLowerCase();
  const chatbox = document.getElementById("chatbox");

  if (message) {
    // Afficher le message de l'utilisateur
    chatbox.innerHTML += "<div><strong>Vous:</strong> " + message + "</div>";
    document.getElementById("message").value = ''; // Réinitialiser le champ texte
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll vers le bas

    // Appeler la fonction pour obtenir une réponse
    const response = getResponse(message);

    // Ajouter la réponse du bot
    chatbox.innerHTML += "<div><strong style='color: #37757a;'>Bot:</strong> " + response + "</div>";
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll vers le bas
  }
}

// Écouter le clic sur le bouton envoyer
document.getElementById("send").addEventListener("click", sendMessage);

// Ajouter un écouteur d'événements pour la touche Enter
document.getElementById("message").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Empêche le saut de ligne
    sendMessage(); // Appeler la fonction d'envoi
  }
});

// Fonction pour générer une réponse en fonction des mots-clés
function getResponse(message) {
  // Phrases de salutations
  const greetings = {
    "bonjour": [
      "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      "Bonjour ! Que puis-je faire pour vous aider avec votre projet ?",
      "Bonjour ! En quoi puis-je vous être utile aujourd'hui ?"
    ],
    "salut": [
      "Salut ! Comment puis-je vous aider ?",
      "Salut ! Que puis-je faire pour vous aujourd'hui ?",
      "Salut ! En quoi puis-je vous assister ?"
    ],
    "hello": [
      "Hello ! Comment puis-je vous aider ?",
      "Hello ! Que puis-je faire pour vous aujourd'hui ?",
      "Hello ! En quoi puis-je vous assister ?"
    ]
  };

  // Phrases de fin de conversation
  const farewells = {
    "au revoir": [
      "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
      "Merci, à bientôt !",
      "Au revoir, et bonne journée !"
    ],
    "merci": [
      "Merci à vous ! N'hésitez pas à me recontacter si besoin.",
      "Merci, je reste disponible si vous avez d'autres questions.",
      "Avec plaisir ! À bientôt !"
    ],
    "à bientôt": [
      "À bientôt ! N'hésitez pas à me recontacter si besoin.",
      "À bientôt ! Je reste à disposition pour toute question.",
      "Merci, et à très vite !"
    ]
  };

  // Phrases directes pour une prise de contact immédiate (prioritaire)
  const directRequests = [
    "je voudrais faire un site internet",
    "pouvez-vous créer un site",
    "je veux un site web",
    "je voudrais un devis",
    "je souhaite prendre rendez-vous"
  ];

  // Phrases pour des compétences spécifiques avec mots-clés plus précis
  const specificSkills = {
    "seo": "Oui, je propose des services de SEO pour améliorer la visibilité de votre site. Consultez la page Services pour en savoir plus : <a href='/fr/services.html'>Voir les services</a>.",
    "expérience utilisateur": "Je propose des services en UX/UI design pour optimiser l'expérience utilisateur de votre site. Découvrez plus de détails sur la page Services : <a href='/fr/services.html'>Voir les services</a>.",
    "ux": "Je propose des services en UX/UI design pour optimiser l'expérience utilisateur de votre site. Découvrez plus de détails sur la page Services : <a href='/fr/services.html'>Voir les services</a>.",
    "ui": "Pour les services de design UI, consultez ma page Services : <a href='/fr/services.html'>Voir les services</a>.",
    "projet": "Vous pouvez consulter quelques exemples de mes projets ici : <a href='/fr/projets.html'>Projets</a>. N'hésitez pas à prendre rendez-vous pour en discuter."
  };

  // Vérifier les salutations en priorité
  for (let greeting in greetings) {
    if (message.includes(greeting)) {
      const options = greetings[greeting];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // Vérifier les phrases de fin de conversation
  for (let farewell in farewells) {
    if (message.includes(farewell)) {
      const options = farewells[farewell];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // Vérifier les demandes directes pour rediriger vers la page de contact ou Calendly
  for (let request of directRequests) {
    if (message.includes(request)) {
      return "Je vous invite à prendre contact pour que nous puissions discuter de votre projet en détail. Cliquez ici pour accéder à ma page de contact : <a href='/fr/rdv.html'>Prendre rendez-vous</a> ou consultez mon agenda sur Calendly.";
    }
  }

  // Vérifier les compétences spécifiques et rediriger vers les pages appropriées
  for (let skill in specificSkills) {
    if (message.includes(skill)) {
      return specificSkills[skill];
    }
  }

  // Réponse générique pour mots isolés non correspondants aux questions/réponses
  if (message.split(" ").length === 1) { // Cas d'un mot isolé
    return "Si vous souhaitez plus de renseignements à ce sujet, merci de réserver un créneau pour un entretien téléphonique ici : <a href='/fr/rdv.html'>Réserver un créneau</a>.";
  }

  // Réponse par défaut si aucun mot-clé trouvé
  return "Je ne possède pas les éléments pour vous répondre précisément. Je vous suggère de prendre contact ici : <a href='/fr/contact.html'>Contactez-moi</a>.";
}
