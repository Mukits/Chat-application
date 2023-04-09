module.exports = function (async, group, _, Users,Message) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
            router.post('/home',this.homePagePost);
            router.get('/logout', this.logout);
        },
        homePage: function (req, res) {
            async.parallel([
                // uses find method from mongoose that will return an array with data from group table of the database
                function (callback) {
                    group.find({}, (err, result) => {
                        callback(err, result);
                    })
                },



                function (callback) {
                    // searches the group table for values only with the country
                    group.aggregate([{
                        $group: {
                            _id: "$country"
                        }
                    }], (err, newResult) => {
                        callback(err, newResult);
                    });
                },

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
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const res4 = results[3];
                console.log(res2);
                // every three results they will be put in the arrays
                const dataBlock = [];
                // 3 DATA INSIDE EACH ARRAY
                const blockSize = 3;
                for (let i = 0; i < res1.length; i += blockSize) {
                    // pushes the res1 into the dataBlock array and will slice (cut the res1 data into block of 1-3)
                    dataBlock.push(res1.slice(i, i + blockSize))
                }
                // SORTING FILTER OPTIONS ALPHABETICALLY
                const sortByCountry = _.sortBy(res2, "_id");
                //console.log(dataBlock);
                // console.log(res1);
                res.render('home', { title: 'Chat-application - Home', user: req.user, parts: dataBlock, country: sortByCountry, data: res3, pm:res4 });
            })

        },

        homePagePost: function(req,res){
            async.parallel([
                function(callback){
                    // updating the groups model
                    group.updateOne({
                        // body iq is from html hidden input
                        '_id': req.body.id,
                        // check that username does not already exist
                        'members.username': {$ne: req.user.username}
                    },{
                        // if conditions above are true then push the data into db
                        $push: {members: {
                            username: req.user.username,
                            email: req.user.email
                        }}
                    },(err,count) => {
                        console.log(count);
                        callback(err,count);
                    });
                }
            ],(err,results) => {
                res.redirect('/home')
            });
        },
        // once the logout is clicked we want to destroy the user session
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