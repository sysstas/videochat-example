// Check if the userId is stored in the localStorage
let userId = localStorage.getItem('userId');
// If the userId is not set or is null, redirect to the login page
if (!userId) {
    window.location.href = 'login.html';
}
// Checking if room is created
let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')
if(!roomId && userId){
    window.location = 'lobby.html'
}
const socket = io('http://localhost:3000');
let mediaConstraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio:true
}
const peers = {}
const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}
let localStream;
let remoteStream;
let peerConnection;

async function init(){

    console.log('init');
    socket.emit('join-room', roomId, userId);

    socket.on('user-disconnected', userId => {
        console.log('init: user-disconnected event', userId);
    })

    socket.on('user-connected', userId =>{
        console.log('init: user-connected event', userId);
        handleUserJoined(userId)
    });

    socket.on('offer', message =>{
        console.log('init: offer event', message.userId, message.offer);
        createAnswer(message.userId, message.offer)
    });

    socket.on('answer', message =>{
        console.log('init: answer event',  message.answer);
        addAnswer(message.answer)
    });

    socket.on('candidate', message =>{
        console.log('init: candidate event',  message.candidate);
        if(peerConnection){
            peerConnection.addIceCandidate(message.candidate)
        }
    });

    // localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    // document.getElementById('user-1').srcObject = localStream

}

// myPeer.on('open', id => {
//     socket.emit('join-room', roomId, id);
// });

socket.on('user-connected', userId =>{
    console.log('User connected', userId);
    if (peers[userId]) {
        peers[userId].close();
    }
});


async function handleUserJoined(MemberId) {
    console.log('handleUserJoined: A new user joined the channel:', MemberId)
    createOffer(MemberId)
};

let createOffer = async (MemberId) => {
    console.log('createOffer: Creating offer');
    await createPeerConnection(MemberId)

    let offer = await peerConnection.createOffer()
    console.log('createOffer: setting local description');
    await peerConnection.setLocalDescription(offer)
    console.log('createOffer: sending message to the peer:', MemberId);
    socket.emit('offer', offer, MemberId, userId);
    peerConnection.addEventListener("connectionstatechange", (event) => {
        console.log('!!!!!!!!!!!!!!!!!!!connection state:', peerConnection.onconnectionstatechange);
    });

    // client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
}

let addAnswer = async (answer) => {
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)

        peerConnection.onconnectionstatechange = function(event) {
            console.log(`######################Peer connection state changed to: ${peerConnection.connectionState}`);
        }

    }
}

let createPeerConnection = async (MemberId) => {
    console.log('createPeerConnection: Creating peer connection',);
    peerConnection = new RTCPeerConnection(servers)
    console.log('peerConnection', peerConnection);
    remoteStream = new MediaStream()
    // const video = document.createElement('video')
    // video.srcObject = remoteStream
    document.getElementById('user-2').srcObject = remoteStream
    document.getElementById('user-2').style.display = 'block'

    document.getElementById('user-1').classList.add('smallFrame')

    if(!localStream){
        localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
        document.getElementById('user-1').srcObject = localStream
    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = (event) => {
        console.log('peer connection ontrack');
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
            console.log('track',track);
            console.log('remoteStream',remoteStream);
        });
        document.getElementById('user-2').srcObject = remoteStream;
        document.getElementById('user-2').addEventListener('loadedmetadata', () => {
            console.log('loadedmetadata');
            document.getElementById('user-2').play();
        });
    };

    peerConnection.onconnectionstatechange = function(event) {
        console.log(`$$$$$$$$$$$$$$$$$$$$$The connection state is now ${peerConnection.connectionState}`);
    };

    peerConnection.onicecandidate = async (event) => {
        console.log('ICE candidate',event.candidate);
        if(event.candidate){
            socket.emit('candidate', event.candidate, MemberId);
        }
    }
}

let createAnswer = async (MemberId, offer) => {
    console.log('createAnswer');
    await createPeerConnection(MemberId)

    console.log('createAnswer: setting offer as remote description');
    await peerConnection.setRemoteDescription(offer)

    console.log('createAnswer: creating answer');
    let answer = await peerConnection.createAnswer()

    console.log('createAnswer: setting answer as local description',);
    await peerConnection.setLocalDescription(answer)
    socket.emit('answer', answer, MemberId);
    peerConnection.onconnectionstatechange = function(event) {
        console.log(`@@@@@@@@@@@@@@@@@@@The connection state is now ${peerConnection.connectionState}`);
    };




}


// function addVideoStream(video, stream) {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     })
//     videoGrid.append(video);
// }

let leaveChannel = async () => {
    await channel.leave()
    await client.logout()
}

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

window.addEventListener('beforeunload', leaveChannel)

document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)

init();
