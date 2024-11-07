const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Liste des salons actifs (simple stockage en mémoire)
let rooms = {}; // Ex : { roomCode: { users: [] } }

io.on('connection', (socket) => {
    console.log('Utilisateur connecté');

    // Lorsque l'utilisateur veut créer un salon
    socket.on('create-room', (username) => {
        const roomCode = generateRoomCode();
        rooms[roomCode] = { users: [username] }; // Crée un salon avec l'utilisateur initial
        socket.emit('room-created', roomCode); // Envoie le code du salon à l'utilisateur
        console.log(`Salon créé avec le code: ${roomCode}`);
    });

    // Lorsque l'utilisateur veut rejoindre un salon
    socket.on('join-room', (username, roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode].users.push(username); // Ajoute l'utilisateur au salon
            socket.join(roomCode); // Fait rejoindre le salon via Socket.io
            socket.emit('room-joined', roomCode);
            io.to(roomCode).emit('new-user', `${username} a rejoint le salon`); // Notifie les autres utilisateurs du salon
        } else {
            socket.emit('room-not-found', 'Salon non trouvé');
        }
    });

    // Gérer les messages du chat
    socket.on('chat-message', (data) => {
        const { roomCode, username, message } = data;
        io.to(roomCode).emit('chat-message', { username, message });
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

// Fonction pour générer un code de salon aléatoire
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Code aléatoire
}

server.listen(3000, () => {
    console.log('Server en écoute sur le port 3000');
});
