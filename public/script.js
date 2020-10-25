

const socket = io('/');



const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined , {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoSream(myVideo , stream);

    peer.on('call' , call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream' , userVideoStream => {
            addVideoSream(video , userVideoStream)
        })
    })

    socket.on('user-connected' , (userId) => {
        connectToNewUser(userId , stream);
    });
});

peer.on('open' , id => {
    socket.emit('join-room' , ROOM_ID , id);
});

 const connectToNewUser = (userId , stream) => {
     const call = peer.call(userId , stream)
     const video =document.createElement('video')
     call.on('stream' , userVideoStream => {
         addVideoSream(video , userVideoStream)
     });
 }

const addVideoSream = (video , stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata' , () => {
        video.play();
    })
    videoGrid.append(video);
}

let msg = $('input');


$('html').keydown((e) => {
    if(e.which == 13 && msg.val().length !== 0) {
        //console.log(msg.val());
        socket.emit('messages' , msg.val());
        msg.val('');
    }
});

socket.on('createMessage' , messages => {
    $('ul').append(`<li class="message"><b>user</b><br/>${messages}</li>`);
    scrollToBottom();
})

// function to auto scroll down
const scrollToBottom = () => {
    let d = $('.main-chat-window');
    d.scrollTop(d.prop("scrollHeight"));
}


// mute and unmute function 
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <sapn>Mute</sapn> 
    `
    document.querySelector('.main-mute-button').innerHTML = html;
}
const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <sapn>Unmute</sapn> 
    `
    document.querySelector('.main-mute-button').innerHTML = html;
}

// stop and enable video
const palyStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else {
        setStopViedo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopViedo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <sapn>Stop video</sapn> 
    `
    document.querySelector('.main-video-button').innerHTML = html;
}
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <sapn>Play video</sapn> 
    `
    document.querySelector('.main-video-button').innerHTML = html;
}