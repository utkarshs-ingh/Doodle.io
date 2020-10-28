const expect = require('expect');
const Users = require('./users');

describe('Users', () => {

    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'uttu',
            room: '001'
        },{
            id: '2',
            name: 'sus',
            room: '002'
        },{
            id: '3',
            name: 'raj',
            room: '001'
        }]
    });



    it('should add new users', () => {
        let users = new Users();
        let user = {
            id: '12',
            name: 'uttu',
            room: '3223'
        };
        let reUsrer = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it("should give list of room 1 people", () => {
        let userList = users.getUserList('001');

        expect(userList).toEqual(['uttu', 'raj']);
    });


    it("should give list of room 1 people", () => {
        let userList = users.getUserList('002');

        expect(userList).toEqual(['sus']);
    });

    it("should get user by ID", () => {
        let userId = users.getUser('2');

        expect(userId.id).toEqual('2');
    });

    it("should not get user by ID", () => {
        let userId = users.getUser('566');

        expect(userId).toBeUndefined();
    });


    it("should remove user by ID", () => {
        let userId = users.removeUser('2');

        expect(userId.id).toBe('2');
        expect(users.users.length).toBe(2);
    });

    it("should not remove user by ID", () => {
        let userId = users.removeUser('452');

        expect(userId).toBeUndefined();
        expect(users.users.length).toBe(3);
    });

});
