// Users is registered as a dependency in the container file
module.exports = function (async, Users) {
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
                }
            ], (err, results) => {
                const firstResult = results[0];
                //console.log(firstResult);
                res.render('groupChats/group', { title: 'Chat-application - Group', user: req.user, name: name, data: firstResult });
            });

        },
        // to post the data to the database from the groupPage friend request
        groupPagePost: function (req, res) {
            // those two functions will run in parallel wihtout waiting ones finished
            async.parallel([
                function (callback) {
                    // this will only happens if the receiverName value inside group.ejs exists/has a value
                    if (req.body.receiverName) {
                        // users is made global because added to container.js - updates Users
                        Users.updateOne({
                            'username': req.body.receiverName,
                            //    ne = not equal notation for mongoDB - checks that the request does not already exists
                            'requestReceived.userId': { $ne: req.user._id },
                            //    checks that the sender is not already a friend
                            'friendsList.friendId': { $ne: req.user._id }
                        },
                            {
                                // pusheses the data into the database 
                                $push: {
                                    requestReceived: {
                                        userId: req.user._id,
                                        username: req.user.username
                                    }
                                },
                                // increments the number of total requests by 1
                                $inc: { totalFriendRequest: 1 }
                            }, (err, count) => {
                                callback(err, count);
                            })
                    }
                },
                // this function updates the data for the sender (sentFriendRequest value)
                function (callback) {
                    if (req.body.receiverName) {
                        Users.updateOne({

                            'username': req.user.username,
                            'sentFriendRequest.username': { $ne: req.body.receiverName }
                        },
                            {
                                $push: {
                                    sentFriendRequest: {
                                        // stores the receivername
                                        username: req.body.receiverName
                                    }
                                }
                            }, (err, count) => {
                                callback(err, count);
                            })
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });

            async.parallel([
                // this function is updates the document for the receiver when the friend request is accepted
                function (callback) {
                    // all this will happen only if user clicks on accept
                    if (req.body.senderId) {
                        // updating receiver friendlist
                        Users.updateOne({
                            '_id': req.user._id,
                            // checks that friend is does not already exists
                            'friendsList.friendId': { $ne: req.body.senderId }
                        }, {
                            $push: {friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName
                                }},
                            // after pushing the data into the friendlist
                            // its goin to go into the requestReceived array look for the userId and username and pull them out
                            $pull: {requestReceived: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }},
                            // decrement the total friend request data
                            $inc: { totalFriendRequest: -1 }
                        }, (err, count) => {
                            console.log(count)
                            callback(err, count);
                        });
                    }
                },
                // this function is updates the document for the sender when the friend request is accepted by the receiver
                function (callback) {
                    // all this will happen only if user clicks on accept
                    if (req.body.senderId) {
                        // updating receiver friendlist
                        Users.updateOne({
                            '_id': req.body.senderId,
                            // checks that friend is does not already exists
                            'friendsList.friendId': {$ne: req.user._Id }
                        }, {
                            $push: {friendsList: {
                                    friendId: req.user._Id,
                                    friendName: req.user.username
                                }},
                            // after pushing the data into the friendlist
                            // its goin to go into the requestReceived array look for the userId and username and pull them out
                            $pull: {sentFriendRequest: {
                                    username: req.user.username
                                }}
                        }, (err, count) => {
                            console.log(count)
                            callback(err, count);
                        });
                    }
                }

                // //updates cance request fro receivar
                // function(callback){
                //     if(req.body.userIds){
                //         Users.updateOne({
                //             '_id': req.user._id,
                //             'requestReceived.userId': {$eq: req.body.userIds}
                //         }, {
                //             $pull: {requestReceived: {
                //                 userId: req.body.userIds
                //             }},
                //             $inc: {totalFriendRequest: -1}
                //         }, (err, count) => {
                //             console.log(count)
                //             callback(err, count);
                //         });
                //     }
                // }


                    // // cancel request for the sender
                    // function (callback) {
                    //     // all this will happen only if user clicks on cancel
                    //     if (req.body.user_Id) {
                    //         // updating receiver friendlist
                    //         Users.updateOne({
                    //             '_id': req.body.user_Id,
                    //             // checks that username  exists using equal operator '$eq' in mongodb
                    //             'sentFriendRequest.username': {$eq: req.user.username }
                    //         }, {
                                
                    //            //it will pull out the userId
                    //             $pull: {sentFriendRequest: {
                    //                     username: req.user.username
                    //                 }}
                            
                                
                    //         }, (err, count) => {
                    //             callback(err, count);
                    //         })
                    //     }
                    // }

            ], (err,results) => {
                res.redirect('/group/'+req.params.name);
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