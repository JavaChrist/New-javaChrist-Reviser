/* script.js */

// Fonction pour vérifier si une URL est valide
function isValidURL(url) {
  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[^\s]*)?$/i;
  return urlPattern.test(url);
}

// Gestion de la modal
const modal = document.getElementById('alert-modal');
const closeModalBtn = document.getElementById('close-modal');

function showModal(message) {
  document.getElementById('modal-message').textContent = message;
  modal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Fonction pour activer le mode plein écran
document.querySelectorAll('.fullscreen-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const iframe = document.getElementById(targetId);

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { /* Firefox */
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari, et Opera */
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { /* IE/Edge */
      iframe.msRequestFullscreen();
    }
  });
});


// Mise à jour des iframes avec la nouvelle URL
document.getElementById('update-url').addEventListener('click', () => {
  const urlInput = document.getElementById('site-url');
  const url = urlInput.value.trim();

  if (!isValidURL(url)) {
    // Affiche la modal si l'URL n'est pas valide
    showModal("L'adresse URL saisie n'est pas valide. Veuillez entrer une URL correcte (ex : https://example.com).");
    return;
  }

  // Si l'URL est valide, mettre à jour les iframes
  document.getElementById('pc-frame').src = url.startsWith('http') ? url : `https://${url}`;
  document.getElementById('tablet-frame').src = url.startsWith('http') ? url : `https://${url}`;
  document.getElementById('phone-frame').src = url.startsWith('http') ? url : `https://${url}`;
});
// Charger la page par défaut en français dans les iframes
document.getElementById('pc-frame').src = 'default.html';
document.getElementById('tablet-frame').src = 'default.html';
document.getElementById('phone-frame').src = 'default.html';