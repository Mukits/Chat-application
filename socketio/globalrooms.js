module.exports = function(io, Global, _){
    const clients = new Global();
    
    io.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);
            
            clients.EnterRoom(socket.id, global.name, global.room, global.img);
            
            const nameProp = clients.GetRoomList(global.room);
            // returns a list of unique properties deleting duplicates
            const arr = _.uniqBy(nameProp, 'name');
            // emitting the arra to all the users connected to global room containing name and image
            io.to(global.room).emit('loggedInUser', arr);
        });
        
        socket.on('disconnect', () => {
            // passes the id of the user that wants to disconnect to the removeuser method
            const user = clients.RemoveUser(socket.id);
            if (user) {
                var userData = clients.GetRoomList(user.room);
                const arr = _.uniqBy(userData,'name');
                // looks for the object with name equivalent to user.name and remove it from the array the returns still left values
                const removeData = _.remove(arr, {'name': user.name});
                io.to(user.room).emit('loggedInUser',arr);
            }
        })
    });
}