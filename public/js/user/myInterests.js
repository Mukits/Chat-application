$(document).ready(function(){
    $('#favFoodBtn').on('click',function(){
        var favFood = $('#favFood').val();
        var valid = true;
        if(favFood == ''){
            valid = false;
            $('#invalid').html('<div class="alert alert-danger">You cannot update details to an empty value</div>');
        } else {
            $('#invalid').html('');
        }
        if(valid == true){
            $.ajax({
                url:'/setup/myInterests',
                type: 'POST',
                data:{
                    favFood: favFood
                },
                success: function(){
                    $('#favFood').val('');
                    setTimeout(function(){
                        window.location.reload();
                    },200);
                }

            })
        } else {
            return false;
        }
        
    });
});

$(document).ready(function(){
    $('#hobbiesBtn').on('click',function(){
        var  hobbies = $('#hobbies').val();
        var valid = true;
        if( hobbies == ''){
            valid = false;
            $('#invalid').html('<div class="alert alert-danger">You cannot update details to an empty value</div>');
        } else {
            $('#invalid').html('');
        }
        if(valid == true){
            $.ajax({
                url:'/setup/myInterests',
                type: 'POST',
                data:{
                    hobbies : hobbies
                },
                success: function(){
                    // empty the input field
                    $('#hobbies').val('');
                    setTimeout(function(){
                        window.location.reload();
                    },200);
                }

            })
        } else {
            return false;
        }
        
    });

    $('#favGroupBtn').on('click',function(){
        var favGroup = $('#favGroup').val();
        var valid = true;
        if( favGroup == ''){
            valid = false;
            $('#invalid').html('<div class="alert alert-danger">You cannot update details to an empty value</div>');
        } else {
            $('#invalid').html('');
        }
        if(valid == true){
            // POSTING THE DATA TO THE SERVER
            $.ajax({
                url:'/setup/myInterests',
                type: 'POST',
                data:{
                    favGroup : favGroup
                },
                success: function(){
                    // empty the input field
                    $('#favGroup').val('');
                    setTimeout(function(){
                        window.location.reload();
                    },200);
                }

            })
        } else {
            return false;
        }
        
    });
});