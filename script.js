document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('year').textContent = new Date().getFullYear();
  
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  function toggleMenu() {
    navLinks.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMenu);
});

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('year').textContent = new Date().getFullYear();
  // ...
});
