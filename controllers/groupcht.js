// Users is registered as a dependency in the container file
module.exports = function (async, Users,Message, friendRequest, Groupmex) {
    return {
        SetRouting: function (router) {
            router.get('/group/:groupName', this.groupPage);
            router.post('/group/:groupName', this.groupPagePost)
            router.get('/logout', this.logout);
        },
        // function containing the render method which renders the view file groupChats/group
        groupPage: function (req, res) {
            const name = req.params.groupName;
            // when a user logs in their data in the database will be returned
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
                },
            ], (err, results) => {
                const firstResult = results[0];
                const secondResult = results[1];
                //console.log(firstResult);
                res.render('groupChats/group', { title: 'Chat-application - Group', user: req.user, name: name, data: firstResult, pm: secondResult });
            });

        },
        // to post the data to the database from the groupPage friend request
        groupPagePost: function (req, res) {
            // those two functions will run in parallel wihtout waiting ones finished
            friendRequest.PostReq(req,res,'/group/'+req.params.name);
            async.parallel([
                function(callback){
                    if(req.body.message){
                        const group = new Groupmex();
                        // getting the user id since we referenced user in the Groupmex model
                        group.sender = req.user._id;
                        // getting the message from the body
                        group.body = req.body.message;
                        // getting the group name hidden field from the body
                        group.name = req.body.name;
                        // setting the createdat value to the current time and date
                        group.createdAt = new Date();
                        // saving the data to the db
                        group.save((err,msg)=>{
                            console.log("the following message has been saved into db");
                            console.log(msg);
                            callback(err,msg);
                        })
                    }
                }
            ],(err,results)=>{
                res.render('/group/'+req.params.name);
            });
        },
        logout: function(req,res){
            // logout method available through passport
            req.logout();
            // destroy the user session
            req.session.destroy((err)=>{
                res.redirect('/');
            });
        }
    }
}