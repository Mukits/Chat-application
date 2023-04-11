// passing tha models Users and Message 
// formidable to send the data
module.exports = function(async, Users, Message, aws,friendRequest, formidable){
    return {
        SetRouting: function(router){
            // for get for getting the profile page
            router.get('/setup/profile', this.getMyProfilePage);
            // the image will be uploaded through this route
            // asw.Upload.any() will allow us to use data from AWSUpload helper file
            router.post('/imageUpload', aws.Upload.any(), this.userImageUp);
            router.post('/setup/profile',this.postMyProfileData);
            // route for my summary page
            router.get('/profile/:name', this.mySummaryPage);
            router.post('profile/:name', this.mySummaryPostPage);
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
        
        },
        // events from formidable
    userImageUp: function(req,res){
        const upForm = new formidable.IncomingForm();
        upForm.on('file', (field,file)=>{

        });
       upForm.on('error',(err)=>{});
       upForm.on('end', () =>{
        console.log('upload on s3 bucket successafull');
       });
       upForm.parse(req);
    },
    postMyProfileData: function(req,res){
        // this is for adding accepting or rejecting friend request o nthis page
        friendRequest.PostReq(req,res,'/setup/profile');
        async.waterfall([
            function(callback){
                Users.findOne({'_id': req.user._id},(err,result)=>{
                    callback(err,result);
                })
            },
            function(result,callback){
                if(req.body.upload === null || req.body.upload === ''){
                Users.updateOne({
                    '_id': req.user._id
                },
                {
                    username:req.body.username,
                    fullname: req.body.fullname,
                    about:req.body.about,
                    country: req.body.country,
                    userImage: result.userImage
                },
                {
                    // if the field does not already exist its goin to add it
                    upsert: true
                }, (err,result)=>{
                    // the data was successfully modified to the following
                    console.log("the profile data was successfully modified");
                    console.log(result);
                    res.redirect('/setup/profile')
                })
            } else if(req.body.upload !== null || req.body.upload !== ''){
                Users.updateOne({
                    '_id': req.user._id
                },
                {
                    username:req.body.username,
                    fullname: req.body.fullname,
                    about:req.body.about,
                    country: req.body.country,
                    userImage: req.body.upload
                },
                {
                    // if the field does not already exist its goin to add it
                    upsert: true
                }, (err,result)=>{
                    // the data was successfully modified to the following
                    console.log("the profile data was successfully modified");
                    console.log(result);
                    res.redirect('/setup/profile')
                })


            }
            }
        ]);
    },

    mySummaryPage: function(req,res){
        async.parallel([
            function (callback) {
                //gets the username from the URL
                Users.findOne({ 'username': req.params.name })
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
            res.render('user/mySummary', { title: 'Chat-application - My Summary', user: req.user, data: firstResult, pm: secondResult });
        });
    
    },
    //  to allow friend requests and message notification to be responded from the profile page
    mySummaryPostPage: function (req,res){
        // params name gets the logged in user
        friendRequest.PostReq(req,res,'/profile/'+req.params.name);
    }
    }
}
