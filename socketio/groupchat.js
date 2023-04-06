module.exports = function(io){
    //for the connection io.on will listen to the connection
    io.on('connection',(socket)=>{
        //will be displayed on the console
        console.log('user connected');
        //getting the event from a particular socket / listens to the newMessage event from the client side
        socket.on('newMessage',(message)=>{
            console.log(message)
        });

    });
}