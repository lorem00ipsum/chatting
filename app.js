document.getElementById('createRoomBtn').addEventListener('click', createRoom);
document.getElementById('joinRoomBtn').addEventListener('click', showJoinRoomSection);
document.getElementById('joinWithCodeBtn').addEventListener('click', joinRoomWithCode);
document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);

let username = "";
let roomCode = "";
let socket;

function createRoom() {
    username = document.getElementById('username').value;
    if (!username) {
        alert("Veuillez entrer un pseudo.");
        return;
    }

    fetch('https://your-backend-url/create-room', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            roomCode = data.roomCode;
            alert("Salon créé! Code du salon: " + roomCode);
            showChatRoom();
        });
}

function showJoinRoomSection() {
    document.getElementById('roomCodeSection').style.display = 'block';
}

function joinRoomWithCode() {
    roomCode = document.getElementById('roomCode').value;
    if (!roomCode) {
        alert("Veuillez entrer un code de salon.");
        return;
    }

    fetch('https://your-backend-url/join-room', {
        method: 'POST',
        body: JSON.stringify({ roomCode }),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Vous avez rejoint le salon!");
                showChatRoom();
            } else {
                alert("Code de salon invalide.");
            }
        });
}

function showChatRoom() {
    document.getElementById('chatArea').style.display = 'block';
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        socket.emit('chat-message', { message, username });
        document.getElementById('messageInput').value = '';
    }
}
