const questionTogglers = document.querySelectorAll(".faq__question-toggler")
questionTogglers.forEach(toggler => toggler.addEventListener("click", handleQuestionToggle))

function handleQuestionToggle(e){
    const toggler = e.target
    const contentToToggle = document.getElementById(toggler.getAttribute("aria-controls"))
    const iconToAnimate = toggler.querySelector(".faq__question-toggler-icon")
    const toggledState = toggler.getAttribute("aria-expanded") === "true"

    contentToToggle.classList.toggle("faq__content-container--active")
    toggler.setAttribute("aria-expanded", !toggledState)
    iconToAnimate.classList.toggle("faq__question-toggler-icon--active")
}

// Gestion du feedback
let globalStats = {
    yes: 0,
    no: 0,
    totalVotes: 0
};

// Charge les statistiques globales au chargement de la page
window.addEventListener('load', () => {
    const savedStats = localStorage.getItem('faqGlobalStats');
    if (savedStats) {
        globalStats = JSON.parse(savedStats);
        updateGlobalFeedbackDisplay();
    }
});

document.querySelectorAll('.feedback-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.disabled) return;
        
        const container = this.closest('.feedback-container');
        const buttons = container.querySelectorAll('.feedback-btn');
        const value = this.dataset.value;
        
        // Met à jour les statistiques globales
        globalStats[value]++;
        globalStats.totalVotes++;
        
        // Désactive les boutons de la question
        buttons.forEach(btn => btn.disabled = true);
        
        // Ajoute une classe pour marquer le bouton sélectionné
        this.classList.add('selected');
        
        // Met à jour l'affichage global
        updateGlobalFeedbackDisplay();
        
        // Sauvegarde dans localStorage
        localStorage.setItem('faqGlobalStats', JSON.stringify(globalStats));
    });
});

function updateGlobalFeedbackDisplay() {
    const globalContainer = document.querySelector('.global-feedback-container');
    const yesPercentage = Math.round((globalStats.yes / globalStats.totalVotes) * 100) || 0;
    const noPercentage = Math.round((globalStats.no / globalStats.totalVotes) * 100) || 0;
    
    globalContainer.innerHTML = `
        <h3>Résultats globaux</h3>
        <div class="stats-bars">
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${yesPercentage}%"></div>
                <span>👍 ${yesPercentage}% (${globalStats.yes})</span>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${noPercentage}%"></div>
                <span>👎 ${noPercentage}% (${globalStats.no})</span>
            </div>
        </div>
        <p class="total-votes">Total des votes : ${globalStats.totalVotes}</p>
    `;
}