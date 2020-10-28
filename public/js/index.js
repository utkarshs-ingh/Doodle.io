let socket = io();


function scrollBottom(){
    const elem = document.querySelector('#messages');
    const scrollDiff = (elem.scrollHeight - elem.scrollTop) - elem.clientHeight;

    if (scrollDiff < 450) {
        elem.scrollTop = elem.scrollHeight;
    }
}


socket.on('connect', function() {
    let params = JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}');

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else{
            
        }
    })
});

socket.on('disconnect', function() {
    console.log("Disconnected from the server :(");
});

socket.on('UpdateUserList', function (users) {
    // console.log(users);
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
    
    // console.log('newMessage', message);
     
});

// socket.emit('createMessage', {
//     from: 'client',
//     text: 'Please Acknowledge!!' 
// },
// function (ackMessage) {
//     console.log(ackMessage);
// });

document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('#message-box').value
    },
    function(){});
    document.querySelector('#message-box').value = ""

});