module.exports = function(async, group, Users){
    return {
        SetRouting: function(router){
            // ROUTES FOR ACTION BUTTONS
            router.get('/searchResults', this.getResults);
            router.post('/searchResults', this.postResults);
            
            router.get('/members',this.showMembers);
            router.post('/members',this.findMembers)
        },
        
        getResults: function(req, res){
            res.redirect('/home');
        },
        
        postResults: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.country), 'gi');
                    // search either by name or country using or operator, if country is false then name will be true
                    group.find({'$or': [{'country':regex}, {'name': regex}]}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('searchResults', {title: 'Chat-application - searchResults', user: req.user, parts: dataChunk});
            })
        },
        showMembers: function(req,res){
            async.parallel([
                function(callback){
                    // search either by name or country using or operator, if country is false then name will be true
                    Users.find({}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                // this is to divide the data in blocks of 3 so that they can be display on the screen in rows of 3
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('membersPage', {title: 'Chat-application - Members', user: req.user, parts: dataChunk});
            })
        },
        findMembers: function(req,res){
            async.parallel([
                function(callback){
                    // this regex ignore case and search for members with the username passed in the body
                    const regex = new RegExp((req.body.username), 'gi');
                    // search either by name or country using or operator, if country is false then name will be true
                    Users.find({'username':regex}, (err, result) => {
                    console.log("searched for username successfully the following is the result")
                    console.log(result)
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                // this is to divide the data in blocks of 3 so that they can be display on the screen in rows of 3
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('membersPage', {title: 'Chat-application - Members', user: req.user, parts: dataChunk});
            })
        }
    }
}