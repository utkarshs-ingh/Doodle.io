let socket = io();


function scrollBottom(){
    const elem = document.querySelector('#messages');
    const scrollDiff = (elem.scrollHeight - elem.scrollTop) - elem.clientHeight;

    if (scrollDiff < 450) {
        elem.scrollTop = elem.scrollHeight;
    }
}


socket.on('connect', function() {
    let name_param = names;
    let room_param = room; 

    console.log(name_param, room_param);
    let params = JSON.parse(JSON.stringify({ "name":name_param, "room": room_param}));

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else{
            
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
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: message.createdAt
    });

    const div = document.createElement('div');
    div.innerHTML = html;
    let msg = document.querySelector('#messages');
    msg.appendChild(div);
    scrollBottom();

});

document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        text: document.querySelector('#message-box').value
    },
    function(){});
    document.querySelector('#message-box').value = ""; 

});