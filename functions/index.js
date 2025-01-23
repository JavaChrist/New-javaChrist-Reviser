const { onRequest } = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
const nodemailer = require("nodemailer");

// Configuration unique de nodemailer
const mailTransport = nodemailer.createTransport({
    host: "smtp.ionos.fr", 
    port: 465, 
    secure: true,
    auth: {
        user: "contact@javachrist.fr",
        pass: "Mm2pIono140114@",
    },
});

// Vérification de la connexion SMTP
mailTransport.verify((error, success) => {
    if (error) {
        console.error("Erreur de connexion SMTP :", error);
    } else {
        console.log("Connexion SMTP réussie !");
    }
});

// Fonction existante pour le formulaire de contact
exports.sendEmail = onRequest((req, res) => {
    cors(req, res, () => {
        // Active l'analyse du JSON si ce n'est pas fait
        if (req.headers['content-type'] === 'application/json' && !req.body) {
            try {
                req.body = JSON.parse(req.rawBody);
            } catch (error) {
                console.error("Erreur lors de l'analyse JSON:", error);
                return res.status(400).send("Corps de requête invalide");
            }
        }

        // Affiche les données reçues
        console.log("Données reçues:", req.body);

        if (req.method !== "POST") {
            return res.status(405).send("Méthode non autorisée");
        }

        if (!req.body.email || !req.body.subject || !req.body.message) {
            return res.status(400).send("Données manquantes");
        }

        const mailOptions = {
            from: "support@javachrist.fr",
            to: "contact@javachrist.fr",
            subject: req.body.subject,
            text: `Message de ${req.body.name} (${req.body.email}):\n\n${req.body.message}`,
            replyTo: req.body.email 
        };

        console.log("Options d'email :", mailOptions);

        mailTransport.sendMail(mailOptions)
            .then(() => {
                console.log("Email envoyé avec succès !");
                res.status(200).send("Email envoyé avec succès");
            })
            .catch((error) => {
                console.error("Erreur lors de l'envoi de l'email :", error);
                res.status(500).send(`Erreur lors de l'envoi de l'email: ${error.message}`);
            });

    });
});

// Configuration CORS permissive pour le développement
const corsOptions = {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    optionsSuccessStatus: 204,
    preflightContinue: false
};

// Configuration des domaines autorisés
const allowedOrigins = {
    development: [
        'http://localhost:5502',
        'http://127.0.0.1:5502'
    ],
    production: [
        'https://javachrist.fr',
        'https://www.javachrist.fr'
    ]
};

// Nouvelle fonction pour les notifications du forum
exports.sendMailNotification = onRequest({
    cors: {
        origin: true,
        methods: ['POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        maxAge: 3600
    }
}, async (req, res) => {
    try {
        const { content, userEmail, postId } = req.body;
        
        const mailOptions = {
            from: "support@javachrist.fr",
            to: "contact@javachrist.fr",
            subject: '🆕 Nouveau message sur le forum JavaChrist',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Nouveau message sur votre forum</h2>
                    <p><strong>De :</strong> ${userEmail}</p>
                    <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Message :</strong></p>
                        <p style="white-space: pre-wrap;">${content}</p>
                    </div>
                    <p><strong>ID du message :</strong> ${postId}</p>
                    <hr>
                    <p style="color: #666; font-size: 0.9em;">
                        Cet email est envoyé automatiquement par le forum de JavaChrist.
                    </p>
                </div>
            `,
            replyTo: userEmail
        };

        await mailTransport.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});
