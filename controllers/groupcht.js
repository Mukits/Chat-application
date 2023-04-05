module.exports = function(){
    return {
        SetRouting: function (router){
            router.get('/group/:groupName', this.groupPage);
        },
        // function containing the render method which renders the view file groupChats/group
        groupPage: function(req,res){
            const name = req.params.groupName;
            res.render('groupChats/group',{title: 'Chat-application - Group',name:name});
        }
    }
}