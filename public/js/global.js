$(document).ready(function () {
    var socket = io();

    socket.on('connect', function () {

        var room = 'GlobalRoom';
        var name = $('#name-user').val();
        var img = $('#name-image').val();

        socket.emit('global room', {
            room: room,
            name: name,
            img: img
        });


    });
    socket.on('loggedInUser',function(users){
        var friends=$('.friend').text();
        var friend = friends.split('@');

        var name = $ ('#name-user').val();
        var ol = $('<div></div>');

        var arr = [];
        for(var i = 0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                ol.append(users[i].name);

            }
        }
        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });
});
