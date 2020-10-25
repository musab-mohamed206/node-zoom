const { Socket } = require('dgram');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server ,{
    debug: true
});


//dfind the view engine
app.set('view engine' , 'ejs');
// set the public folder
app.use(express.static('public'));

app.use('/peerjs' , peerServer);
app.get('/' , (req , res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room' , (req , res) => {
    res.render('room' , { roomId : req.params.room });
})

io.on('connection' , socket => {
    socket.on('join-room' , (roomId , userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('messages' , messages => {
            io.to(roomId).emit('createMessage' , messages)
        })
    })
})

server.listen(process.env.PORT || 3030);