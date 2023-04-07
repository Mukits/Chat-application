class Users {
    constructor(){
        this.users = [];
    }
    // when calling this method passes socket id name of the user and the room that user is joining and push them into array users
    AddUserData(id, name, room){
        var users = {id, name, room};
        this.users.push(users);
        return users;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.users.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    // will list all the users that are connected in a room
    GetUsersList(room){
        // for every room name that matches the parameter room will be added to a new array
        var users = this.users.filter((user) => {
           return user.room === room;
        });
        
       
        // to get the names of every user inside the new array users above
        var namesArray = users.map((user) => {
            return user.name;
        });
        // this array will return the names of all users connected to a specific room
        return namesArray;
    }
}

module.exports = {Users};