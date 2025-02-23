console.log("✅ Script chargé !");

// Variables globales
let votes = [0, 0, 0, 0];
const emojiMap = {
    "🎲": 0,
    "🎭": 1,
    "👑": 2,
    "🎁": 3
};

// Fonction pour mettre à jour les barres de progression
function updateBars() {
    let totalVotes = votes.reduce((a, b) => a + b, 0) || 1;
    for (let i = 0; i < 4; i++) {
        let percentage = (votes[i] / totalVotes) * 100;
        let bar = document.getElementById(`bar${i + 1}`);

        console.log(`🔄 Mise à jour : bar${i + 1} -> ${percentage.toFixed(1)}%`);
      
        bar.style.width = percentage + '%';
        bar.textContent = Math.round(percentage) + '%';

        // Animation verte sur le vote
        bar.style.background = "#00ff00"; // Vert au vote
        setTimeout(() => {
            bar.style.background = ""; // Retour à la couleur normale
        }, 500);
    }
}

// Connexion à StreamElements WebSocket
const socket = io("https://realtime.streamelements.com", {
    transports: ["websocket"],
    autoConnect: true
});

socket.on("connect", () => console.log("✅ WebSocket connecté ! ID:", socket.id));

socket.on("disconnect", () => console.log("❌ WebSocket déconnecté !"));
socket.on("connect_error", (error) => console.error("⚠️ Erreur WebSocket :", error));

socket.on("event", (data) => {
    console.log("📩 Message reçu :", data);

    if (data.type === "message") {
        let message = data.data.text.trim();
        let foundVote = false;

        Object.keys(emojiMap).forEach(emoji => {
            if (message.includes(emoji)) {
                votes[emojiMap[emoji]]++;
                foundVote = true;
                console.log(`✅ Vote ajouté pour ${emoji}, total: ${votes[emojiMap[emoji]]}`);
            }
        });

        if (foundVote) updateBars();

        // Vérifie si la commande !sond est envoyée
        let match = message.match(/^!sond(?:\s(\d+))?/);
        if (match) {
            votes = [0, 0, 0, 0]; // Réinitialise les votes
            updateBars();
            console.log("🔄 Sondage réinitialisé !");
        }
    }
});
