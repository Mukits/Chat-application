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
        

    });
}