const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

app.use(express.json());

app.post('/create-room', (req, res) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = { users: [] };
    res.json({ roomCode });
});

app.post('/join-room', (req, res) => {
    const { roomCode } = req.body;
    if (rooms[roomCode]) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

io.on('connection', (socket) => {
    console.log('Utilisateur connecté');
    
    socket.on('chat-message', (data) => {
        io.emit('chat-message', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

server.listen(3000, () => {
    console.log('Server en écoute sur le port 3000');
});
