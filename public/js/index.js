let socket = io();


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

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        text: document.querySelector('#message-box').value
    },
    function () { });
    document.querySelector('#message-box').value = ""; 

});