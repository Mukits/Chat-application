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
// emit this to everyone connected
        socket.on('message display',function(){
            $('#refresh').load(location.href + ' #refresh');
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
           

                var list = 
                '<a id="val" href="/privateChat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><h3 style="padding-top:15px;color:gray; font-size:14px;">'+''+users[i].name.replace(/ /g, "-")+'<span class="fa fa-circle online_friend"></span></h3></a></p>' +
                '<div class="clearfix"></div><hr style=" margin-top: 14px; margin-bottom: 14px;" />'
                ol.append(list);

                

            }
        }
        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });
});
