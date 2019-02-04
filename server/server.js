const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const formatData = (name, text) => ({ name, text });

io.on('connection', socket => {
    socket.on('message:receive', (data, callback) => {
        if (!data) {
            callback('Message cannot be empty!');
            return;
        }

        callback();
        io.emit('message:send', formatData('Admin', data.text));
    });
});

server.listen(port, () => {
    console.log(`Started on port: ${port}`);
});
