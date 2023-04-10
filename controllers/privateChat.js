module.exports = function(async, Users,Message, friendRequest){
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
                },

                // aggregate method to process data records and return the computed results
                function(callback){
                    // to avoid complexity for uppercase and lowercase usernames
                    const nameRegex = new RegExp("^"+req.user.username.toLowerCase(), "i");
                    Message.aggregate([
                        // it will match and search for every document inside the message collection where senderName 
                        // and receiverName is equal to user.username
                        {$match: {$or: [{"senderName": nameRegex},
                        {"receiverName": nameRegex}]}},
                        // sort the data
                        {$sort:{"createdAt":-1}},
                        {
                            $group: { "_id":{
                                "last_message_between": { 
                                    // mongodb condition operator to return onl;y data we need
                                    $cond : [
                                        {
                                            // greater than operator mongodb
                                            $gt: [
                                                // substr to get data from index 0 to 1 so get the senderName and receiverName
                                                {$substr:["$senderName",0,1]},
                                                {$substr:["$receiverName",0,1]}]
                                        },
                                        // contatenating the senderName and receiverName
                                        {$concat:["$senderName"," and ","$receiverName"]},
                                        {$concat:["$receiverName"," and ","$senderName"]}
                                        
                                    ]
                                }
                                // the body will hold all the data processed above, root means the currently processed document
                            }, "body": {$first: "$$ROOT"}
                            }

                        }], function(err,newResult){
                            // it should be returning the newest message between user1 and user2
                            console.log(newResult);
                            callback(err,newResult);
                        }
                    )
                },
                // return an array of all of the messages for both users
                function(callback){
                    Message.find({'$or':[{'senderName': req.body.username},
                    {'receiverName':req.user.username}]})
                    .populate('sender')
                    .populate('receiver')
                    .exec((err,res)=>{
                        // will show all the messages belonging to both users
                        console.log(res);
                        callback(err,res)
                    })
                }
            ], (err, results) => {
                const firstResult = results[0];
                const secondResult = results[1];
                const thirdResult = results[2];

                console.log(thirdResult);

                const params = req.params.name.split('.');
                const nameParams = params[0];
                //console.log(firstResult);
                res.render('privateChat/privateChat', { title: 'Chat-application - Private chat', user: req.user,  data: firstResult, pm: secondResult, pms: thirdResult, keyname: nameParams});
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
            });
            friendRequest.PostReq(req,res,'/privateChat/'+req.params.name)
        }
    }
}
