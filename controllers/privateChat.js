module.exports = function(async, Users,Message){
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
        privateChatPostPage: function(req, res, next){
            const params = req.params.name.split('.');
            const nameParams = params[0];
            const nameRegex = new RegExp("^"+nameParams.toLowerCase(), "i");
            
            async.waterfall([
                function(callback){
                    if(req.body.message){
                        Users.findOne({'username':{$regex: nameRegex}}, (err, data) => {
                           callback(err, data);
                        });
                    }
                },
                
                function(data, callback){
                    if(req.body.message){
                        const newMessage = new Message();
                        newMessage.sender = req.user._id;
                        newMessage.receiver = data._id;
                        newMessage.senderName = req.user.username;
                        newMessage.receiverName = data.username;
                        newMessage.message = req.body.message;
                        newMessage.userImage = req.user.userImage;
                        newMessage.createdAt = new Date();
                        
                        newMessage.save((err, result) => {
                            if(err){
                                return next(err);
                            }
                            console.log(result);
                            callback(err, result);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/privateChat/'+req.params.name);
            })
        }
    }
}
