$(document).ready(function(){
    //when the button that has '.upload-btn' class is clicked the the one with '#upload-input' will be triggered
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });
    //we want to listen for a change on the input
    $('#upload-input').on('change', function(){
        //the variable where the data from the input will be saved in 
        var uploadInput = $('#upload-input');
        //we check that input field 'uploadInput' is not empty
        if(uploadInput.val() != ''){
            //the FormData interface provides us a way to construct a set of key/value pairs to save group name and country values
            var formData = new FormData();
            // we getting the files fron the input field 'upload"
            formData.append('upload', uploadInput[0].files[0]);
            //this will allow us to post the data 
            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    uploadInput.val('');
                }
            })
        }
    })
})