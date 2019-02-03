let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', socket => {
    socket.on('createMessage', data => {
        console.log(data);

        socket.emit('newMessage', { text: data, date: new Date() });
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
