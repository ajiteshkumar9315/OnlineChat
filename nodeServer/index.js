const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const PORT = 8000;


const users = {};

io.on('connection', socket => {
    //if any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //if someone sends a message,broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    //if someone leaves the chat, let others know
    socket.on('disconnect', _ => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

app.use('/', express.static(path.join(path.dirname(__dirname), "browserClient")));
server.listen(PORT, () => {
    console.log('listening on `http://localhoszt:8000`');
});