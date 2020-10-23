let socket = io();

socket.on('connect', function() {
    console.log("Connected!!");
});

socket.on('disconnect', function() {
    console.log("Disconnected from the server :(");
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
});