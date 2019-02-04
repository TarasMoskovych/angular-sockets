const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const userService = require('./user.service')();
const formatData = (name, text, id) => ({ name, text, id });

io.on('connection', socket => {
    socket.on('join', (user, callback) => {
        if (!user.name || !user.room) {
            return callback('Enter valid user data!');
        }

        callback({ id: socket.id });

        socket.emit('message:send', formatData('Admin', `Hello, ${user.name}!`));
    });

    socket.on('message:receive', (data, callback) => {
        if (!data) {
            return callback('Message cannot be empty!');
        }

        callback();
        io.emit('message:send', formatData(data.name, data.text, data.id));
    });
});

server.listen(port, () => {
    console.log(`Started on port: ${port}`);
});
