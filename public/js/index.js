let socket = io();

socket.on('connect', function() {
    console.log("Connected!!");
});

socket.on('disconnect', function() {
    console.log("Disconnected from the server :(");
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
    document.querySelector('#messages').appendChild(div);

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