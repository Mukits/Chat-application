// passing tha models Users and Message 
// formidable to send the data
module.exports = function(async, Users, Message,friendRequest){
    return {
        SetRouting: function(router){
            router.get('/setup/myInterests', this.getMyInterestsPage);
            router.post('/setup/myInterests', this.postMyInterestPage);
        },
        getMyInterestsPage: function(req,res){
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
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];
                            // populating the sender and receiver
                            Message.populate(newResult,arr,(err,newResult1)=>{
                                
                                callback(err,newResult1);
                            });
                        }
                    )
                }

            
            ], (err, results) => {
                // stores the results of each of the functions above starting from results[0] which is for the first function
                const firstResult = results[0];
                const secondResult = results[1];
            
                //console.log(firstResult);
                // SETS THE TITLE AND makes data available to the group.ejs file
                res.render('user/myInterests', { title: 'Chat-application - My Interests', user: req.user, data: firstResult, pm: secondResult });
            });
        
        },
     
    
        postMyInterestPage: function(req,res){
            // this is for adding accepting or rejecting friend request on this page
            friendRequest.PostReq(req,res,'/setup/myInterests');
            // THIS PARALLEL GETS THE DATA FROM THE AJAX REQUEST AND UPDATED THE DB FOR FAV FOOD
            async.parallel([
                function(callback){
                    // trigger only when we have data for this field
                    if(req.body.favFood){
                        Users.updateOne({
                            '_id':req.user._id,
                            // if the data on the request already exists the data will not be saved
                           'favouriteFood.foodName': {$ne: req.body.favFood}
                        },{
                            $push: {
                                favouriteFood: {
                                // req  is  from the ajax request in the client side js script
                                foodName: req.body.favFood}
                            }
                        }, (err,ress1)=>{
                            console.log("fav food was pushed the following is result");
                            console.log(ress1);
                            callback(err,ress1);
                        })
                    }
                },
                
            ], (err,results)=>{
                res.redirect('/setup/myInterests');
            });
 // THIS PARALLEL GETS THE DATA FROM THE AJAX REQUEST AND UPDATED THE DB FOR HOBBIES
            async.parallel([
                
                function(callback){
                    // trigger only when we have data for this field
                    if(req.body.hobbies){
                        Users.updateOne({
                            '_id':req.user._id,
                            // if the data on the request already exists the data will not be saved
                           'personalHobby.hobbyName': {$ne: req.body.hobbies}
                        },{
                            $push: {
                                personalHobby:  {
                                // req  is  from the ajax request in the client side js script
                                hobbyName: req.body.hobbies}
                            }
                        }, (err,ress2)=>{
                            console.log("hobby was pushed the following is result");
                            console.log(ress2);
                            callback(err,ress2);
                        })
                    }
                }
                
            ], (err,results)=>{
                res.redirect('/setup/myInterests');
            });
 // THIS PARALLEL GETS THE DATA FROM THE AJAX REQUEST AND UPDATED THE DB FOR FAV GROUP
            async.parallel([
                
                function(callback){
                    // trigger only when we have data for this field
                    if(req.body.favGroup){
                        Users.updateOne({
                            '_id':req.user._id,
                            // if the data on the request already exists the data will not be saved
                           'favouriteGroup.groupName': {$ne: req.body.favGroup}
                        },{
                            $push: {
                                favouriteGroup:  {
                                // req  is  from the ajax request in the client side js script
                                groupName: req.body.favGroup}
                            }
                        }, (err,ress3)=>{
                            console.log("fav group was pushed the following is result");
                            console.log(ress3);
                            callback(err,ress3);
                        })
                    }
                }
                
            ], (err,results)=>{
                res.redirect('/setup/myInterests');
            });
        }
            
      
    
    }
}


