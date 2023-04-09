module.exports = function(async, Users){
    return {
        SetRouting: function(router){
            // param name added 
            router.get('/privateChat/:name',this.getChatPage);
            router.post('/privateChat/:name', this.privateChatPostPage)
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
        },
        privateChatPostPage: function(req,res,next){
            const params = req.params.name.split('.');
            const nameParams = params[0];
            const nameRegex = new RedExp("^"+nameParams.toLowerCase(), "i");
            async.waterfall([
                function(callback){
                    // if the bessage body is set on the privatemessage html then
                    if(req.body.message){
                        Users.FindOne({'username':{$regex: nameRegex}}, (err,data)=>{
                            callback(err,data);
                        });
                    }
                },

                function(data, callback){
                    if(req.body.message){
                        
                    }
                }
            ], (err,results)=>{
                res.redirect('/privateChat/'+req.params.name);
            })
        }
    }
}
