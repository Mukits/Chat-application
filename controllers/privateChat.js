module.exports = function(async, Users){
    return {
        SetRouting: function(router){
            // param name added 
            router.get('/privateChat/:name',this.getChatPage);
        },
        getChatPage: function(req,res){
            async.parallel([
                function (callback) {
                    //it will search for user with username req.user.username
                    Users.findOne({ 'username': req.user.username })
                        // its going to then populate that user his data in object requestReceived.userId
                        .populate('requestReceived.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const firstResult = results[0];
                //console.log(firstResult);
                res.render('privateChat/privateChat', { title: 'Chat-application - Private chat', user: req.user,  data: firstResult });
            });
        }
    }
}
