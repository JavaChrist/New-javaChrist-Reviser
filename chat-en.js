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
  // Greetings
  const greetings = {
    "hello": [
      "Hello! How can I assist you today?",
      "Hello! What can I help you with regarding your project?",
      "Hello! How can I be of service today?"
    ],
    "hi": [
      "Hi! How can I assist you?",
      "Hi! What can I help you with today?",
      "Hi! How may I assist you today?"
    ],
    "good morning": [
      "Good morning! How can I assist you today?",
      "Good morning! How can I help with your project?",
      "Good morning! How may I assist you today?"
    ]
  };

  // Farewells
  const farewells = {
    "goodbye": [
      "Goodbye! Feel free to reach out if you have more questions.",
      "Thank you, see you soon!",
      "Goodbye, and have a great day!"
    ],
    "thank you": [
      "Thank you! Feel free to contact me if needed.",
      "Thanks, I’m here if you have more questions.",
      "You're welcome! See you soon!"
    ],
    "see you": [
      "See you! Feel free to reach out if needed.",
      "See you soon! I’m here for any questions.",
      "Thank you, and see you soon!"
    ]
  };

  // Direct requests for immediate contact (priority)
  const directRequests = [
    "i would like a website",
    "can you create a website",
    "i want a website",
    "i would like a quote",
    "i want to make an appointment"
  ];

  // Specific skills with more precise keywords
  const specificSkills = {
    "seo": "Yes, I offer SEO services to improve your website's visibility. See the Services page for more details: <a href='/en/services.html'>View Services</a>.",
    "user experience": "I offer UX/UI design services to optimize the user experience on your site. Discover more on the Services page: <a href='/en/services.html'>View Services</a>.",
    "ux": "For UX/UI design services, check out my Services page: <a href='/en/services.html'>View Services</a>.",
    "ui": "For UI design services, visit my Services page: <a href='/en/services.html'>View Services</a>.",
    "project": "You can view some of my recent projects here: <a href='/en/projects.html'>Projects</a>. Feel free to schedule a meeting to discuss further."
  };

  // Check greetings first
  for (let greeting in greetings) {
    if (message.includes(greeting)) {
      const options = greetings[greeting];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // Check farewells
  for (let farewell in farewells) {
    if (message.includes(farewell)) {
      const options = farewells[farewell];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // Check direct requests to redirect to contact or Calendly page
  for (let request of directRequests) {
    if (message.includes(request)) {
      return "I invite you to get in touch so we can discuss your project in detail. Click here to access my contact page: <a href='/en/rdv.html'>Make an appointment</a> or view my schedule on Calendly.";
    }
  }

  // Check specific skills and redirect to appropriate pages
  for (let skill in specificSkills) {
    if (message.includes(skill)) {
      return specificSkills[skill];
    }
  }

  // Generic response for isolated words not matching specific questions/responses
  if (message.split(" ").length === 1) { // Case of a single word
    return "If you’d like more information on this topic, please book a time slot for a phone meeting here: <a href='/en/rdv.html'>Book an appointment</a>.";
  }

  // Default response if no keyword is found
  return "I don’t have the specific details to answer your question. I suggest reaching out here: <a href='/en/contact.html'>Contact me</a>.";
}
