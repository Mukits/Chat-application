// Users is registered as a dependency in the container file
module.exports = function (Users, async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:groupName', this.groupPage);
            router.post('/group/:groupName', this.groupPagePost)
        },
        // function containing the render method which renders the view file groupChats/group
        groupPage: function (req, res) {
            const name = req.params.groupName;
            // when a user logs in their data in the database will be returned
            async.parallel([
                function (callback) {
                    //it will search for user with username req.user.username
                    Users.findOne({ 'username': req.user.username })
                        // its going to then populate that user his data including requestReceived.userId
                        .populate('requestReceived.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const firstResult = results[0];
                console.log(firstResult);
                res.render('groupChats/group', { title: 'Chat-application - Group', user: req.user, name: name , data:firstResult});
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
        }
    }
}