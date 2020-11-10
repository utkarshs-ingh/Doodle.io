

function game(users, id, message) {
         
    let user = users.getUser(id);
    let players = users.getUserList(user.room);
    console.log(message.text);
    if(message.text == 'hh') {
        console.log(message.text);
    }    
    // return players;    
}

module.exports = (game);