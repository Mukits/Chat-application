module.exports = function(io){
    //for the connection io.on will listen to the connection
    io.on('connection',(socket)=>{
        //will be displayed on the console
        console.log('user connected');
        socket.on('join',(params,callback)=>{
            // it allows socket to join a particular channel
            socket.join(params.room)

            callback();
        });
        //getting the event from a particular socket / listens to the newMessage event from the client side
        socket.on('newMessage',(message,callback)=>{
            console.log(message)
            //io.to().emit send the message to all the connected clients to a specific room including the sender
            io.to(message.room).emit('newData',{
                text: message.text,
                room: message.room
            });
            callback();
        });

    });
}