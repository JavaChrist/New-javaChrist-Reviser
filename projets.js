document.addEventListener('DOMContentLoaded', (event) => {
    let modals = document.querySelectorAll('.modal');
    let images = document.querySelectorAll('.cube img');
    let closeButtons = document.querySelectorAll('.close');
    let isRight = true;

    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            let modalId = img.getAttribute('data-modal');
            let modal = document.getElementById(modalId);
            modal.style.display = 'block';
            modal.querySelector('.modal-content').style.float = isRight ? 'right' : 'left';
            isRight = !isRight;
        });
    });

    closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});