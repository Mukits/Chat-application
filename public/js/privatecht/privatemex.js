$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);

    //console.log(paramOne);
    var newParam = paramOne.split('.');
    // whatever at index 0 will be replaced with index 1
    console.log('1',newParam);
    swap(newParam,0,1);
    console.log('2', newParam)
    var paramTwo = newParam[0]+'.'+newParam[1];

    socket.on('connect',function(){
        var params = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('join private',params, function(){
        console.log('user joined pm');
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
                    sender:sender
                })
            }
        });
    });
});

function swap(input, value_1, value_2){
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}