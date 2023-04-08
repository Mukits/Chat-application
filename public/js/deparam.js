(function($){
    $.deparam = $.deparam || function(uri){
        if(uri === undefined){
            uri = window.location.pathname;
        }
        // gets the uri from the current window
        var value1 = window.location.pathname;
        // split method returns an array
        var value2 = value1.split('/');
        var value3 = value2.pop();
        return value3;
    }
})(jQuery);