$(document).ready(function(){
    // io variable made possible for use thanks to the socket.io.js imported in group.ejs in views
    var socket = io();
    // gets the name of the group from the group.ejs
    var room = $('#name').val();

    socket.on('connect',function(){
        //will be displayed on the browser
        console.log('user connected successfully')

        var params = {
            room:room
        }
        // new event whenever a new user joins 
        socket.emit('join',params,function(){
            console.log('user has joined the channel')
        });

    });

    socket.on('newData',function(data){
        console.log(data.text);
        console.log(data.room);
    });

    $('#message-form').on('submit',function(e){
        // to prevent the form to reload after its submitted
        e.preventDefault();
        //gets the msg value from the input field in group.ejs
        var msg = $('#msg').val();
        //adding anew event that will have to be listen on the server side as well
        socket.emit('newMessage', {
            text: msg,
            room: room
            // acknowledgement functiopn to cleanse input field once message is sent
        },function(){
            $('#msg').val('');
        });
    });
});