const Users = require("./users");


function game(room) {
    let users = new Users();
    let players = users.getUserList(room);
    console.log(players);
    // 
    
    return players;    
}

module.exports = (game);