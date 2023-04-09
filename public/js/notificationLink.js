$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);

    //console.log(paramOne);
    var newParam = paramOne.split('.');
    // whatever at index 0 will be replaced with index 1
    console.log('1',newParam);
    // showing attaching the username to the html tag before swapping
    
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
        

        $(document).on('click','#notificationLink',function(){
            // using this to get the attribute from the currecntly selected ancor tag 
            var pmId = $(this).data().val;

            $.ajax({
                url:'/privateChat/'+paramOne,
                type:'POST',
                data:{pmId:pmId},
                success: function(){

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