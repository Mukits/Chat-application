module.exports = function(io){
    // whenever a user connects this will run
    io.on('connection', (socket)=>{
        console.log("friend")

        socket.on('joinReq',(myReq,callback)=>{
            socket.join(myReq.sender);
            callback();
        });

        socket.on('friendReq', (friend,callback)=>{
            io.to(friend.receiver).emit('newFriendReq',{
                sender : friend.sender,
                receiver : friend.receiver
            });
            callback();
        });
    });
}