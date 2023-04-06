module.exports = function(io){
    //for the connection io.on will listen to the connection
    io.on('connection',(socket)=>{
        //will be displayed on the console
        console.log('user connected');
        //getting the event from a particular socket / listens to the newMessage event from the client side
        socket.on('newMessage',(message)=>{
            console.log(message)
            //io.emit send the message to all the connected clients including the sender
            io.emit('newData',{
                text: message.text
            });
        });

    });
}