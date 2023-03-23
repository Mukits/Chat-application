

module.exports = function(){
    return {
        SetRouting: function(router){
            //adding all our routes for the admin
            router.get('/dashboard', this.adminPage);
        },
        //define the file to render on the screen
        adminPage: function(req, res){
            res.render('admin/dashboard');
        }
    }
}









































