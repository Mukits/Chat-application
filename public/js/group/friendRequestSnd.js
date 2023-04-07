$(document).ready(function(){
    var socket = io();
    var room = $('#name').val();
    var sender = $('#sender').val();
    socket.on('connect',function(){
        var params = {
            sender: sender
        }
        socket.emit('joinReq', params, function(){
            console.log('user has joined')
        });
    });
    socket.on('newFriendReq',function(frien){
        console.log(frien);
    });
    // added a submit event on the form
    $('#add_friend').on('submit',function(e){
        e.preventDefault();
        // get the receiver name from the receiverName input field
        var receiver = $('#receiverName').val();
        socket.emit('friendReq',{
                        receiver: receiver,
                        sender: sender
                    }, function(){
                        console.log('request has been sent successfully');
                    })
                
        // we are using the ajax method to post the data to the database 
        // $.ajax({
        //     url: '/group'+room,
        //     type: 'POST',
        //     // we are sending the receiver name and the senders name
        //     data: {
        //         receiver: receiver,
                
        //     },
        //     success: function(){
        //         socket.emit('friendReq',{
        //             receiver: receiver,
        //             sender: sender
        //         }, function(){
        //             console.log('request has been sent successfully');
        //         })
        //     }
        // })
    });
});