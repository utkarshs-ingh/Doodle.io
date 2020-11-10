let socket = io();
let gameON = false;

let timeDisplay = document.getElementById('timer');

function timer(timeLeft) {
   
    if (timeLeft == -1) {
      alert("Round Over...");
      timeDisplay.innerHTML = "";
      return;
    } 
    else {
        timeDisplay.innerHTML = timeLeft + ' seconds remaining';
        return setTimeout(() => {timer(--timeLeft)}, 1000);
    }
} 

function scrollBottom() {
    const elem = document.querySelector('#messages');
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
        player_name: message.text
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
    
    let ol = document.createElement('ol');
    users.forEach(function (user){
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
    div.setAttribute("style", "border-radius: 5px;background: lightgray; width: 400px; margin-top: 5px;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('leaveMessage', function (message) {
    
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: red; width: 400px; margin-top: 5px;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('joinMessage', function (message) {
    
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: lightgreen; width: 400px; margin-top: 5px;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
});

socket.on('gameMessage', function (message) {
    modal(message);
    gameON = true;
    setTimeout(() => {gameON = false}, 30000);
    timer(30);
});

socket.on('winMessage', function (message) {
    const div = messageValue(message);
    div.setAttribute("style", "border-radius: 5px;background: yellow; width: 400px; margin-top: 5px;");
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();
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