const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');


const generateMessage = require('./utils/message');
const stringCheck = require('./utils/stringValidation');
const Users = require("./utils/users");
const gameWord = require("./utils/game");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
var users = new Users();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(publicPath)); 

var player_num = 0; 
var guessWord = "";

app.post("/", (req, res) => {
    if (!stringCheck(req.body.name) || isNaN(req.body.room) || !stringCheck(req.body.room)) {
        res.sendFile(publicPath + '/index.html');
    }
    else {
        res.render('chat', {names: req.body.name, room: req.body.room});
    }
});

  
io.on('connection', (socket) => { 
   
    socket.on('join', (params, callback) => {
        
        if(!stringCheck(params.name) || isNaN(params.room) || !stringCheck(params.room)) {
            return callback("User name or Room number is wrong!");
        }

        socket.join(params.room); 
        users.removeUser(socket.id);     
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('UpdateUserList', users.getUserList(params.room));
        io.to(params.room).emit('joinMessage', generateMessage('Doodle.io', `welcome ${params.name} to ${params.room}`)); 

        callback();
    });

    socket.on('createMessage', (message, callback) => { 

        let user = users.getUser(socket.id);

        if(user && stringCheck(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); 
        }

        callback('Server Acknowledged.');  
    }); 
    
    socket.on('gameTime', () => { 
        let user = users.getUser(socket.id);
        let players = users.getUserList(user.room);

        let nextPlayer = players[(player_num++)%players.length];
        let currPlayer = users.getUserByName(nextPlayer, user.room);
                
        if(nextPlayer) {
            io.to(user.room).emit('gameMessage', generateMessage('Doodle.io', `${nextPlayer} is drawing!!!.....`));
            guessWord =  gameWord();
            io.to(currPlayer.id).emit('gameMessage', generateMessage('Doodle.io', `Draw ${guessWord}`));
        }
    }); 


    socket.on('gamechecker', (message) => { 
        
        let user = users.getUser(socket.id);

        if(message.text == guessWord) {
            users.updateScore(user.name, user.room);
            io.to(user.room).emit('winMessage', generateMessage('Doodle.io', `${user.name} guessed it!!!.....`));
        }
        else {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        socket.on('gameOver', () => {
            users.updateScore(user.name, user.room);
        });
    }); 

    socket.on('disconnect', () => { 
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('UpdateUserList', users.getUserList(user.room));
            io.to(user.room).emit('leaveMessage',generateMessage('Doodle.io', `${user.name} has left the chat :(`)); 
        }
    });
});
  

server.listen(port, () => {
    console.log(`server is up at ${port}`);
});
    
 