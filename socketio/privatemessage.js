module.exports = function(io)
{
    io.on('connection',  (socket)=>{
        socket.on('join private',(pm, callback)=>{
            // any user that pathname is equal to room 1 and room2 wil automatically join this event and will listen to this event then they can message each other 
            socket.join(pm.room1);
            socket.join(pm.room2);
            // to test that use has joined pm
            callback();


        });

        socket.on('private message', (message, callback)=>{
            // if this is successfull we will see the name and text of the sender
            console.log(message);
            // emits to everyone including sender
            io.to(message.room).emit('new message',{
                text: message.text,
                sender: message.sender
            });
// emits event to all users connected to that private room
            io.emit('message display',{});
            callback();
        });
    });
}