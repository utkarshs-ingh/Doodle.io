const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');


const generateMessage = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath)); 


io.on('connection', (socket) => { 
    console.log('new connection');

    socket.emit('newMessage', generateMessage('Doodle.io', 'Welcome!'));

    socket.broadcast.emit('newMessage',generateMessage('Doodle.io', 'someone new just hopped in'));

    socket.on('createMessage', (message, callback) => { // custom Event
        console.log("createMessage", message);
        io.emit('newMessage', generateMessage(message.from, message.text)); 
        callback('Server Acknowledged.');  
    }); 
    
    socket.on('disconnect', () => { // prebuilt Event
        console.log('user left :(');
        
    });
});
  

server.listen(port, () => {
    console.log(`server is up at ${port}`);
});
    
 