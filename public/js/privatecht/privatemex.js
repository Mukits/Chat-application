$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var userImg = ('#name-image').val();
    //console.log(paramOne);
    var newParam = paramOne.split('.');
    // whatever at index 0 will be replaced with index 1
    console.log('1',newParam);
    // setting up the username to show on the pm chat
    var username  = newParam[0];
    // showing attaching the username to the html tag before swapping
    $('#recipient').text('PM to: '+username);
    swap(newParam,0,1);
    console.log('2', newParam)

   
    var paramTwo = newParam[0]+'.'+newParam[1];
    // passing the two paths on connection
    socket.on('connect',function(){
        var params = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('join private',params, function(){
        console.log('user joined pm');
        });
// once the event comes in the div with that id will be reloaded
        socket.on('message display',function(){
            $('#refresh').load(location.href + ' #refresh');
        });
        // render the message using mustache template
        socket.on('new message',function(data){
            var template = $('#message-template').html();
            var message = Mustache.render(template, {
                text: data.text,
                sender: data.sender
    
    
            });
            // the data from message will be added to the unorderd list in the hmtl page
            $("#messages").append(message);
        });
        $('#message_form').on('submit', function (e) {
            // to prevent the form to reload after its submitted
            e.preventDefault();
            //gets the msg value from the input field in group.ejs
            var msg = $('#msg').val();
            var sender = $('#name-user').val();
            // make sure that user cannot send empty msg trim cancels spaces
            if(msg.trim().length > 0){
                socket.emit('private message',{
                    text: msg,
                    sender:sender,
                    room: paramOne
                }, function(){
                    // to clear the input field when message is sent
                    $('#msg').val('');
                });
            }
        });
        // once the button is clicked the data will be sent to the db and msg value will be emptied
        $('#send-message').on('click',function(){
            var message = $('#msg').val();

            $.ajax({
                url:'/privateChat/'+paramOne,
                type: 'POST',
                data: {
                    message:message
                },
                success: function(){
                    $('#msg').val('');
                }
            })
        });
    });
});

function swap(input, value_1, value_2){
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}