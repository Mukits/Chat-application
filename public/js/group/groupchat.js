$(document).ready(function(){
    // io variable made possible for use thanks to the socket.io.js imported in group.ejs in views
    var socket = io();

    socket.on('connect',function(){
        //will be displayed on the browser
        console.log('user connected successfully')
    });

    socket.on('newData',function(data){
        console.log(data);
    });

    $('#message-form').on('submit',function(e){
        // to prevent the form to reload after its submitted
        e.preventDefault();
        //gets the msg value from the input field in group.ejs
        var msg = $('#msg').val();
        //adding anew event that will have to be listen on the server side as well
        socket.emit('newMessage', {
            text: msg
        });
    });
});