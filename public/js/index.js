var socket = io();
let gameON = false;
let drawON = true;
let timeDisplay = document.getElementById('timer');

function timer(timeLeft) {
   
    if (timeLeft == -1) {
      timeDisplay.innerHTML = "<i class='far fa-clock' style='font-size:20px'></i>";
      document.querySelector('#game-btn').removeAttribute('disabled');
      document.querySelector('#message-box').removeAttribute('disabled');
      return;
    } 
    else {
        timeDisplay.innerHTML = timeLeft;
        return setTimeout(() => {timer(--timeLeft)}, 1000);
    }
} 

function scrollBottom() {
    const elem = document.querySelector('#chat__box');
    const scrollDiff = (elem.scrollHeight - elem.scrollTop) - elem.clientHeight;

    if (scrollDiff < 450) {
        elem.scrollTop = elem.scrollHeight;
    }
}

function messageValue(message) {
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: message.createdAt
    });

    const div = document.createElement('div');
    div.innerHTML = html;

    return div;
}


function modal(message) {

    const template = document.querySelector('#modal-template').innerHTML;
    var output = Mustache.render(template,{
        player_name: message
    });
    
    let msg = document.getElementById('myModal');
    msg.innerHTML = output;
    
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    span.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

socket.on('connect', function() {
    let name_param = userName;
    let room_param = room; 

    let params = JSON.parse(JSON.stringify({ "name":name_param, "room": room_param}));

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
    })
});

socket.on('disconnect', function() {});

socket.on('UpdateUserList', function (users) {

    let players = Object.keys(users).map((e) => users[e].name + " :: " + users[e].score);

    let ol = document.createElement('ol');
    players.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });

    let userList = document.querySelector("#users");
    userList.innerHTML = "";
    userList.appendChild(ol);

});

socket.on('newMessage', function (message) {

    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: lightgray; width: 300px; margin-top: 5px; word-wrap: break-word; word-wrap: break-word;  ");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('leaveMessage', function (message) {
    
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: red; width: 300px; margin-top: 5px; word-wrap: break-word;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('joinMessage', function (message) {
    
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: lightgreen; width: 300px; margin-top: 5px; word-wrap: break-word;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('gameMessage', function (limit, gameStatus, drawStatus, message) {
    modal(message.text);
    gameON = gameStatus;
    drawON = drawStatus;
    if(gameON) {
        if(drawON) {
            document.querySelector('#message-box').setAttribute("disabled", "disabled");
        }
        else if(!drawON) {
            document.querySelector('#message-box').removeAttribute('disabled');
        }
        document.querySelector('#game-btn').setAttribute("disabled", "disabled");
        timer(limit);
    }
});

socket.on('winMessage', function (message) {
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: yellow; width: 300px; margin-top: 5px; word-wrap: break-word;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});
 
socket.on('canvas-draw', function (data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var image = new Image();
    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = data;
});


document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    if(gameON == false) {
        socket.emit('createMessage', {
            text: document.querySelector('#message-box').value
        },
        function () { });
    }
    else if(gameON == true) {
        socket.emit('gamechecker', {
            text: document.querySelector('#message-box').value
        },
        function () { });
    }

    document.querySelector('#message-box').value = ""; 

});

document.querySelector('#game-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    socket.emit('gameTime', {});
    
});