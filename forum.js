import { collection, addDoc, query, orderBy, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "actual-api-key-from-firebase-console",
    authDomain: "javachrist-b02f3.firebaseapp.com",
    projectId: "javachrist-b02f3",
    storageBucket: "javachrist-b02f3.firebasestorage.app",
    messagingSenderId: "987983540724",
    appId: "1:987983540724:web:fa97255d9ae41f03ad89a1",
    measurementId: "G-9C8Y48XBHR"
};

// Initialize Firebase
const app = window.initializeFirebase(firebaseConfig);
const db = window.getFirestore(app);
const auth = window.getAuth(app);

// Demander la permission pour les notifications
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

// Fonction pour afficher une notification
function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Nouveau message sur le forum', {
            body: message,
            icon: '/assets/logo/favicon.ico'
        });
    }
}

// Function to fetch and display posts
async function fetchPosts() {
    try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const forumPosts = document.querySelector('.forum-posts');
        forumPosts.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('forum-post');
            postElement.textContent = post.content;
            forumPosts.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Supprimer complètement la fonction sendAdminNotification car nous utilisons maintenant la Cloud Function

async function addPost(content, email) {
    try {
        if (!validateEmail(email)) {
            throw new Error("Email invalide");
        }
        // Enregistrement dans Firestore
        const docRef = await addDoc(collection(db, "posts"), {
            content: content,
            createdAt: new Date(),
            email: email
        });

        // Attendre un peu pour s'assurer que Firestore a bien enregistré
        await new Promise(resolve => setTimeout(resolve, 1000));

        // URL mise à jour selon le déploiement
        const functionUrl = 'https://us-central1-javachrist-b02f3.cloudfunctions.net/sendMailNotification';
        
        try {
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    content: content,
                    userEmail: email,
                    postId: docRef.id
                })
            });

            if (!response.ok) {
                console.warn('Notification non envoyée, mais message enregistré');
            } else {
                console.log('Notification envoyée avec succès');
            }
        } catch (error) {
            console.warn('Erreur notification:', error);
            // On continue même si la notification échoue
        }

        // Rafraîchir l'affichage
        fetchPosts();
        return true;
    } catch (e) {
        console.error("Erreur:", e);
        alert("Erreur: " + e.message);
        return false;
    }
}

function formatDate(date) {
    return new Date(date).toLocaleString('fr-FR');
}

// Ajouter ces fonctions pour gérer les préférences
function saveNotificationPreference(enabled) {
    localStorage.setItem('notificationsEnabled', enabled);
}

function getNotificationPreference() {
    return localStorage.getItem('notificationsEnabled') === 'true';
}

// Modifier la fonction fetchPosts pour utiliser onSnapshot
function setupRealtimeUpdates() {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    
    // Ajouter le bouton de notification avec plus d'informations
    const forumContainer = document.querySelector('.forum-container');
    if (!document.getElementById('enable-notifications')) {
        const notifWrapper = document.createElement('div');
        notifWrapper.className = 'notification-wrapper';
        
        const notifButton = document.createElement('button');
        notifButton.id = 'enable-notifications';
        
        // Initialiser le bouton selon la préférence sauvegardée
        const notificationsEnabled = getNotificationPreference();
        updateNotificationButton(notifButton, notificationsEnabled);
        
        const notifInfo = document.createElement('span');
        notifInfo.className = 'notification-info';
        updateNotificationInfo(notifInfo, notificationsEnabled);
        
        notifWrapper.appendChild(notifButton);
        notifWrapper.appendChild(notifInfo);
        forumContainer.insertBefore(notifWrapper, forumContainer.firstChild);
        
        notifButton.onclick = async () => {
            const currentState = getNotificationPreference();
            if (!currentState) {
                const granted = await requestNotificationPermission();
                if (granted) {
                    saveNotificationPreference(true);
                    updateNotificationButton(notifButton, true);
                    updateNotificationInfo(notifInfo, true);
                }
            } else {
                saveNotificationPreference(false);
                updateNotificationButton(notifButton, false);
                updateNotificationInfo(notifInfo, false);
            }
        };
    }

    onSnapshot(q, (snapshot) => {
        const forumPosts = document.querySelector('.forum-posts');
        forumPosts.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('forum-post');
            postElement.innerHTML = `
                <div class="post-content">${post.content}</div>
                <div class="post-timestamp">Posté le ${formatDate(post.createdAt.toDate())}</div>
            `;
            forumPosts.appendChild(postElement);
        });

        // Notifier pour le nouveau message (sauf au chargement initial)
        const newPosts = snapshot.docChanges().filter(change => change.type === 'added');
        if (newPosts.length > 0 && document.hasFocus() === false && getNotificationPreference()) {
            showNotification(newPosts[0].doc.data().content.substring(0, 50) + '...');
        }
    });
}

// Fonctions utilitaires pour mettre à jour l'interface
function updateNotificationButton(button, enabled) {
    if (enabled) {
        button.className = 'notifications-enabled';
        button.innerHTML = '<i class="bx bx-bell"></i> Désactiver les notifications';
    } else {
        button.className = '';
        button.innerHTML = '<i class="bx bx-bell-off"></i> Activer les notifications';
    }
}

function updateNotificationInfo(infoElement, enabled) {
    infoElement.textContent = enabled 
        ? "Vous recevrez des notifications pour les nouveaux messages" 
        : "Activez les notifications pour être informé des nouveaux messages";
}

// Event listener for form submission
document.getElementById('new-post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const postContent = document.getElementById('post-content').value.trim();
    const email = document.getElementById('post-email').value.trim();
    
    if (postContent && email) {
        addPost(postContent, email);
        document.getElementById('post-content').value = '';
        document.getElementById('post-email').value = '';
    } else {
        alert("Veuillez remplir tous les champs");
    }
});

// Amélioration de la détection d'AdBlock
async function detectAdBlock() {
    try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        const isBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        
        if (isBlocked) {
            const warning = document.getElementById('adblocker-warning');
            if (warning) {
                warning.style.display = 'flex';
            }
            console.warn('AdBlock détecté - Certaines fonctionnalités peuvent ne pas fonctionner correctement');
            return true;
        }
        return false;
    } catch (e) {
        console.error('Erreur lors de la détection d\'AdBlock:', e);
        return false;
    }
}

// Modification de l'événement DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    const hasAdBlock = await detectAdBlock();
    if (!hasAdBlock) {
        setupRealtimeUpdates();
    } else {
        // Tentative de charger quand même
        try {
            setupRealtimeUpdates();
        } catch (error) {
            console.error('Erreur lors du chargement du forum:', error);
        }
    }
});