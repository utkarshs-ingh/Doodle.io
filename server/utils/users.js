
class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room, score:0, flag: 0};
        this.users.push(user);
        return user;
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        return users;
    }
    
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserByName(name, room) {
        return this.users.filter((user) => user.name === name && user.room === room)[0];
    }

    removeUser(id) {
        let user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id != id);
        }

        return user;
    }

    updateScore(name, room) {
        let player = this.users.filter((user) => user.name === name && user.room === room)[0];
        
        if(player.flag == 0) {
            player.score += 50;
            player.flag = 1;
        }
    }

    resetScore(room) {
        let users = this.users.filter((user) => user.room === room);
        users.map((user) => user.flag = 0);
    }

}


module.exports = (Users);

