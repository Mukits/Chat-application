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
        //logged in user name
        var name = $ ('#name-user').val().toLowerCase();
        var ol = $('<div></div>');

        var arr = [];
        for(var i = 0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                // return the friends name
                //THE URI WILL ACT AS THE PRIVATE CHAT ROOM
                var userName = users[i].name.toLowerCase();
                // uerl will be receiver+sender
                // some css using bootstrap classes also reusing the val css properties from the online members section and the green dot css from the username section
                // once friend name is clicked it will go to /chat route for private chat
                var list = '<img src="https://placehold.it/300x300" class="pull-left img-circle" style="width:50px; margin-right:10px;"/><p>' +
                '<a id="val" href="/privateChat/'+userName.replace(/ /g,"-")+'.'+name.replace(/ /g,"-")+'"><h3 style="padding-top:15px; color:gray; font-size:14px;">'+'@'+users[i].name+'<span class= "fa fa-circle online_friend"></span></h3></a></p>'
                ol.append(list);

                

            }
        }
        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });
});
