module.exports = function (io, Users) {
    const members = new Users();

    //for the connection io.on will listen to the connection
    io.on('connection', (socket) => {
        //will be displayed on the console
        console.log('user connected');
        socket.on('join', (params, callback) => {
            // it allows socket to join a particular channel
            socket.join(params.room)
            // params are got from the client side version of groupchat.js in public folder
            members.AddUserData(socket.id, params.userName, params.room);
            // io.to to sent to everyome socket.to to send to evryone apart from sender
            io.to(params.room).emit('usersList', members.GetUsersList(params.room));
            console.log(members);

            callback();
        });
        //getting the event from a particular socket / listens to the newMessage event from the client side
        socket.on('newMessage', (message, callback) => {
            console.log(message)
            //io.to().emit send the message to all the connected clients to a specific room including the sender
            io.to(message.room).emit('newData', {
                text: message.text,
                room: message.room,
                sender: message.sender,
                image: message.userImage
            });
            callback();
        });
        // socket.io contains this disconnect event that, when user disconnects the member will be removed and list will be update using io.to (sends message to evryone including sender)
        socket.on('disconnect', () => {
            var member = members.RemoveUser(socket.id);
            if (member) {
                io.to(members.room).emit('usersList', members.GetUsersList(member.room));
            }
        })
    });
}