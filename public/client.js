let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)

const localUserId = urlParams.get('userId')

// Check if the userId is stored in the localStorage
console.log('localUserId',localUserId);
if (!localUserId) {
    window.location.href = 'login.html';
}
// Checking if room is created
let roomId = urlParams.get('room')
if(!roomId){
    window.location = 'lobby.html'
}
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
// document.getElementById('leave-btn').addEventListener('click', disconnectUser)

const mediaConstraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio:true
}

// let localStream;
// let remoteStream;
// let peerConnection;
//
// const socket = io('http://localhost:3000');

// const servers = {
//     iceServers:[
//         {
//             urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
//         }
//     ]
// }




// init();
//
// socket.on('user-connected', async remoteUserId => {
//     console.log('user connected', remoteUserId);
//     await createPeerConnection(remoteUserId);
//     await createOffer(remoteUserId);
// })
//
// socket.on('offer', async message => {
//     console.log('Received offer from', message.senderId);
//     console.log('peerConnection', peerConnection);
//     await createPeerConnection(message.senderId);
//     await peerConnection.setRemoteDescription(message.offer)
//     await createAnswer(message.senderId)
// })
//
// socket.on('answer', async answer => {
//     console.log('add answer');
//     await peerConnection.setRemoteDescription(answer)
// })
//
// socket.on('candidate', async candidate => {
//     console.log('candidate');
//     await peerConnection.addIceCandidate(candidate)
// })
//
// socket.on('user-disconnected', userId => {
//     console.log('init: user-disconnected event', userId);
//     document.getElementById('user-2').srcObject = null;
//
// })
//
// async function createOffer(remoteUserId) {
//     console.log('Create offer');
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.emit('offer', offer, remoteUserId, localUserId)
// }
//
// async function createAnswer(remoteUserId) {
//     console.log('Create Answer');
//     let answer = await peerConnection.createAnswer()
//     await peerConnection.setLocalDescription(answer);
//     socket.emit('answer', answer, remoteUserId)
// }
//
// async function createPeerConnection(remoteUserId) {
//     console.log('Create peer connection');
//     peerConnection = new RTCPeerConnection(servers)
//
//     remoteStream = new MediaStream();
//     document.getElementById('user-2').srcObject = remoteStream
//     document.getElementById('user-2').style.display = 'block'
//     document.getElementById('user-1').classList.add('smallFrame');
//
//     localStream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream)
//     })
//
//     peerConnection.ontrack = (event) => {
//         console.log('peer connection ontrack');
//         event.streams[0].getTracks().forEach((track) => {
//             remoteStream.addTrack(track);
//             console.log('track',track);
//             console.log('remoteStream',remoteStream);
//         });
//         document.getElementById('user-2').srcObject = remoteStream;
//         document.getElementById('user-2').addEventListener('loadedmetadata', () => {
//             console.log('loadedmetadata');
//             document.getElementById('user-2').play();
//         });
//     };
//
//     peerConnection.onicecandidate = async (event) => {
//         console.log('ICE candidate', event.candidate);
//         if (event.candidate) {
//             socket.emit('candidate', event.candidate, remoteUserId)
//         }
//     }
// }
//
// async function init() {
//     console.log('Init');
//
//     localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
//     document.getElementById('user-1').srcObject = localStream
//
//     // // STEP 1. Sending join room event to create room or join it.
//     socket.emit('join-room',roomId, localUserId);
//
// }

function toggleCamera() {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    } else {
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

function toggleMic() {
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    } else {
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}
//
// function disconnectUser() {
//     socket.disconnect();
// }