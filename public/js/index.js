let socket = io();

socket.on('connect', function() {
    console.log("Connected!!");
});

socket.on('disconnect', function() {
    console.log("Disconnected from the server :(");
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);

    let li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;
    document.querySelector('body').appendChild(li);

});

// socket.emit('createMessage', {
//     from: 'client',
//     text: 'Please Acknowledge!!'
// },
// function (ackMessage) {
//     console.log(ackMessage);
// });

document.querySelector('#send-btn').addEventListener('click', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('#message-box').value
    },
    function(){

    });
});