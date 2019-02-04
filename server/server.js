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
        socket.join(user.room);

        userService.remove(socket.id);
        userService.add(socket.id, user.name, user.room);

        io.to(user.room).emit('users:update', userService.getUsersByRoom(user.room));
        socket.emit('message:send', formatData('Admin', `Hello, ${user.name}!`));
        socket.broadcast.to(user.room).emit('message:send', formatData('Admin', `${user.name} joined.`));
    });

    socket.on('message:receive', (data, callback) => {
        const user = userService.getById(socket.id);

        if (!data) {
            return callback('Message cannot be empty!');
        }

        if (user) {
            io.to(user.room).emit('message:send', formatData(data.name, data.text, data.id));
        }

        callback();
    });

    socket.on('disconnect', () => {
        const user = userService.remove(socket.id);

        if (user) {
            io.to(user.room).emit('message:send', formatData('Admin', `${user.name} left.`));
            io.to(user.room).emit('users:update', userService.getUsersByRoom(user.room));
        }
    });
});

server.listen(port, () => {
    console.log(`Started on port: ${port}`);
});
