// const {Server} = require("socket.io");
// const io =  new Server(3000, {
//     cors: {
//         origin: "*", // Allow all origins or you can set specific origin like "http://localhost:3000"
//         methods: ["GET", "POST"], // Allow GET and POST methods
//     }
// });

// console.log('starting server');

// const users = {};

// io.on('connection', socket=>{
//     console.log('Connection');

//     socket.on('join-room', (roomId, userId) => {
//         console.log('join room', roomId, userId);
//         socket.join(roomId);
//         socket.to(roomId).emit('user-connected', userId)
//         users[userId] = socket;
//
//         socket.on('disconnect', ()=> {
//             socket.to(roomId).emit('user-disconnected', userId)
//             delete users[userId]
//         })
//     })

//     socket.on('offer', (offer, receiverId, senderId)=> {
//         console.log('offer', receiverId, senderId);
//         let recipientSocket = users[receiverId];
//         recipientSocket.emit('offer', {offer, senderId})
//     })

//     socket.on('answer', (answer, receiverId) => {
//         console.log('answer', receiverId);
//         let recipientSocket = users[receiverId];
//         recipientSocket.emit('answer', answer);
//     })

//     socket.on('candidate', (candidate, receiverId) => {
//         console.log('candidate', receiverId);
//         let recipientSocket = users[receiverId];
//         recipientSocket.emit('candidate', candidate);
//     })


// })