// passing tha models Users and Message 
module.exports = function(async, Users, Message){
    return {
        SetRouting: function(router){
            router.get('/setup/profile', this.getMyProfilePage);
            
        },
        getMyProfilePage: function(req,res){
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
                }

            
            ], (err, results) => {
                // stores the results of each of the functions above starting from results[0] which is for the first function
                const firstResult = results[0];
                const secondResult = results[1];
            
                //console.log(firstResult);
                // SETS THE TITLE AND makes data available to the group.ejs file
                res.render('user/myProfile', { title: 'Chat-application - My Profile', user: req.user, data: firstResult, pm: secondResult });
            });
        
        }
    }
}