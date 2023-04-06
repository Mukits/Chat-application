$(document).ready(function(){
    // io variable made possible for use thanks to the socket.io.js imported in group.ejs in views
    var socket = io();

    socket.on('connect',function(){
        //will be displayed on the browser
        console.log('user connected successfully')
    });


});