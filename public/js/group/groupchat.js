$(document).ready(function () {
    // io variable made possible for use thanks to the socket.io.js imported in group.ejs in views
    var socket = io();
    // gets the name of the group from the group.ejs
    var room = $('#name').val();
    var userImage = $('#name-image').val();
    var sender = $('#sender').val();
    socket.on('connect', function () {
        //will be displayed on the browser
        console.log('user connected successfully')

        var params = {
            room: room,
            userName: sender
        }
        // new event whenever a new user joins 
        socket.emit('join', params, function () {
            console.log('user has joined the channel')
        });

    });
    // to see the users that are connected 
    socket.on('usersList', function (members) {
        console.log(members);

        var ol = $('<ol></ol>');
        for (var i = 0; i < members.length; i++) {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#Modal">' + members[i] + '</a></p>');
        }
        // when a name is clicked. #val - was taken from the line above - add the member name in the #member h3 in group.ejs
        $(document).on('click', '#val', function () {
            $('#member').html('add ' + $(this).html());
            $('#receiverName').val($(this).html());
            $('#nameLink').attr("href", "/profile/" + $(this).html());

        });
        // Online Members (dynamically added)
        $('#numValue').html('(' + members.length + ')');
        // to add the ordered list into the html in group.ejs
        $('#users').html(ol);
    });

    socket.on('newData', function (data) {
        console.log(data);
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender,
            userImage: data.image.replace("C:\\fakepath\\", "")


        });
        // the data from message will be added to the unorderd list in the hmtl page
        $("#messages").append(message);
    });

    // this is from where the message sent
    $('#message-form').on('submit', function (e) {
        // to prevent the form to reload after its submitted
        e.preventDefault();
        //gets the msg value from the input field in group.ejs
        var msg = $('#msg').val();
        //adding anew event that will have to be listen on the server side as well
        socket.emit('newMessage', {
            text: msg,
            room: room,
            sender: sender,
            userImage: userImage
            // acknowledgement functiopn to cleanse input field once message is sent
        }, function () {
            $('#msg').val('');
        });

        // we adding ajax method to post the data to the database
        $.ajax({
            url:'/group/'+room,
            type:'POST',
            data: {
                message:msg,
                name: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
    });
});