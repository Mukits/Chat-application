module.exports = function(){
    return {
        SetRouting: function(router){
            router.get('/setup/profile', this.getMyProfilePage);
            
        },
        getMyProfilePage: function(req,res){
            res.render('user/myProfile',{title: 'Chat-application - My Profile', user: req.user});
        }
    }
}