class UserService {
    constructor () {
        this.users = [];
    }

    add(id, name, room) {
        this.users.add({ id, name, room });
    }

    getById(id) {
        return this.users.find(user => user.id === id);
    }

    getUsersByRoom(room) {
        return this.users.filter(user => user.room === room);
    }

    remove(id) {
        const _user = this.getById(id);

        if (_user) {
            this.users = this.users.filter(user => user.id !== _user.id);
        }

        return _user;
    }
}

module.exports = function () {
    return new UserService();
}
