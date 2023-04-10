$(document).ready(function () {
    //when the button that has '.upload-btn' class is clicked the the one with '#upload-input' will be triggered
    $('.add-btn').on('click', function () {
        $('#addPhoto').click();
    });
    //we want to listen for a change on the input
    $('#addPhoto').on('change', function () {
        //the variable where the data from the input will be saved in 
        var addPhoto = $('#addPhoto');
        //we check that input field 'uploadInput' is not empty
        if (addPhoto.val() != '') {
            //create a new instance of this form constructor
            var formData = new FormData();
            // we getting the files fron the input field 'upload"
            formData.append('upload', addPhoto[0].files[0]);
            $('#completed').text('file uploaded successfully!!');
            //this will allow us to post the data 
            $.ajax({
                url: '/imageUpload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    addPhoto.val('');
                }
            })
        }
        // will show the image immediately when there is a change on the addPhoto tag
        showImg(this);
    });

$('#profile').on('click', function(){
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var about = $('#about').val();
    var country = $('#country').val();
    var userImage = $('#addPhoto').val();

    var valid = true;

    if(username == '' || fullname == ''  || about == '' || country == ''){
        valid = false;
        $('#invalid').html('<div class="alert alert-danger">You cannot update details to an empty value</div>');

    }else{
        $('#invalid').html('')
    }
    if(valid ===true){
        // using ajax to send the data to the server
        $.ajax({
            url: '/setup/profile',
            type: 'POST',
            data: {
                username: username,
                fullname: fullname,
                country: country,
                about: about,
                upload: userImage
            },
            success: function(){
                setTimeout(function(){
                    // will reload the document from the current URL 
                    window.location.reload
                }, 200);
            }
        })
    } else {
        return false;
    }
});

});

function showImg(input){
    if(input.files && input.files[0]){
        // lets us read the files inside our computers asyncronously/independently
        var reader = new FileReader();
        // onload is called when read operation is completed
        reader.onload = function(e){
// e.target.result will contain the file
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}