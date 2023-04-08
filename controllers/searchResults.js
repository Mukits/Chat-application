module.exports = function()
{
    return {
        SetRouting: function(router){
            router.get('/searchResults',this.getsearchResults)
        },
        getsearchResults: function(req,res){
            res.render('searchResults',{user: req.user});
        }
    }
}