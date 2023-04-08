module.exports = function(async, group){
    return {
        SetRouting: function(router){
            router.get('/searchResults', this.getResults);
            router.post('/searchResults', this.postResults);
            
            
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
        }
    }
}