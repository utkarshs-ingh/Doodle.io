const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath)); 

// socket obejct is for singular connection: user specific
// io object is for all the instances: all users
io.on('connection', (socket) => {
    console.log('new connection');

    socket.emit('newMessage', { 
        from: "Doodle.io",
        text: "Doodle.io says Hello!",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', { 
        from: "Doodle.io",
        text: "someone new just hopped in",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => { // custom Event
        console.log("createMessage", message);
        io.emit('newMessage', { 
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
    
    socket.on('disconnect', () => { // prebuilt Event
        console.log('user left :(');
    });
});
 

server.listen(port, () => {
    console.log(`server is up at ${port}`);
});
    
 