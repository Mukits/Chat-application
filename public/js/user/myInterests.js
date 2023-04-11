$(document).ready(function(){
    $('#favFoodBtn').on('click',function(){
        var favFood = $('#favFood').val();
        var valid = true;
        if(favFood ===''){
            valid = false;
            $('#invalid').html('<div class="alert alert-danger">You cannot update details to an empty value</div>');
        } else {
            $('#invalid').html('');
        }
        if(valid === true){
            $.ajax({
                url:'/setup/myInterests',
                type: 'POST',
                data:{
                    favFood: favFood
                },
                success: function(){
                    setTimeout(function(){
                        window.location.reload();
                    },200)
                }

            })
        } else {
            return false;
        }
        
    });
});