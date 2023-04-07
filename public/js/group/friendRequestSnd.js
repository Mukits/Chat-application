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
    socket.on('newFriendReq',function(friend){
        console.log(friend);
         // using the jquery load which loads the data from the server and puts the returned data into the element where we specify the id
        //  the space before #refresh is needed for it to work otherwise it will not load
        $('#refresh').load(location.href + ' #refresh');
    });
    // added a submit event on the form
    $('#add_friend').on('submit',function(e){
        e.preventDefault();
        // get the receiver name from the receiverName input field
        var receiverName = $('#receiverName').val();
        
                
        // we are using the ajax method to post the data to the database 
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            // we are sending the receiver name and the senders name
            data: {
                receiverName: receiverName,
                
            },
            success: function(){
                socket.emit('friendReq',{
                    receiver: receiverName,
                    sender: sender
                }, function(){
                    console.log('request has been sent successfully');
                })
            }
        })
    })
});