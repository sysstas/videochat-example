const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*", // Allow all origins or you can set specific origin like "http://localhost:3000"
        methods: ["GET", "POST"], // Allow GET and POST methods
        allowedHeaders: ["my-custom-header"],
    }
});
// const { v4: uuidV4 } = require('uuid');
//
// app.set('view engine', 'ejs');
// app.use(express.static('public'));

let users = {};  // To store all connected users


// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })
//
// app.get('/:room', (req, res) => {
//     res.render('room', {roomId: req.params.room})
// })

io.on('connection', socket => {
    console.log('connection');
    console.log('users', Object.keys(users));
    socket.on('join-room', (roomId, userId) => {
        console.log('roomId', roomId);
        console.log('userId', userId);
        socket.join(roomId);
        users[userId] = socket;

        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', ()=> {
            socket.to(roomId).emit('user-disconnected', userId)
            delete users[userId]
        })

    })
    socket.on('offer', (offerMessage, userId, senderId) => {
        console.log('userId', userId);
        console.log('offerMessage');
        let recipientSocket = users[userId];
        if (recipientSocket) {
            console.log('Emitting offer to recipient');
            recipientSocket.emit('offer', {offer:offerMessage, userId:senderId});
        } else {
            console.log('No recipient to send offer to');
        }
    });
    socket.on('answer', (answerMessage, userId) => {
        console.log('userId', userId);
        console.log('answerMessage');
        let recipientSocket = users[userId];
        if (recipientSocket) {
            console.log('Emitting answer to recipient');
            recipientSocket.emit('answer', {answer:answerMessage, userId:userId});
        } else {
            console.log('No recipient to send answer to');
        }
    });
    socket.on('candidate', (candidate, userId) => {
        console.log('userId', userId);
        console.log('candidate');
        let recipientSocket = users[userId];
        if (recipientSocket) {
            console.log('Emitting candidate to recipient');
            recipientSocket.emit('candidate', {candidate:candidate, userId:userId});
        } else {
            console.log('No recipient to send candidate to');
        }
    });
})

server.listen(3000)