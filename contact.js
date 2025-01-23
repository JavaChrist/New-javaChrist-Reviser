document.addEventListener('DOMContentLoaded', function () {
    const rainContainer = document.getElementById('rain-container');
    const raindropsCount = 100;

    function createRaindrop() {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${Math.random() * 1 + 1}s`; // 
        raindrop.style.opacity = Math.random();
        rainContainer.appendChild(raindrop);


        raindrop.addEventListener('animationend', () => {
            raindrop.remove();
            createRaindrop();
        });
    }

    for (let i = 0; i < raindropsCount; i++) {
        setTimeout(createRaindrop, Math.random() * 1000);
    }
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = {
        name: document.querySelector('[name="name"]').value,
        email: document.querySelector('[name="email"]').value,
        subject: document.querySelector('[name="subject"]').value,
        message: document.querySelector('[name="message"]').value
    };

    console.log("Formulaire soumis :", formData);
    console.log("Envoi de la requête...")



    fetch('https://us-central1-javachrist-b02f3.cloudfunctions.net/sendEmail', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); 
    })
    .then(data => {
        console.log('Success:', data); 
        alert('Message envoyé avec succès !');
        document.getElementById('contact-form').reset(); // Ajout de cette ligne
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    });
});