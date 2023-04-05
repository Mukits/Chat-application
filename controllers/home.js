module.exports = function(async,group,_){
    return {
        SetRouting: function(router){
            router.get('/home',this.homePage)
        },
        homePage: function(req,res){
            async.parallel([
                // uses find method from mongoose that will return an array with data from group table of the database
                function(callback){
                    group.find({},(err,result)=>{
                        callback(err,result);
                    })
                }
                
            ],(err,results)=>{
                const res1 = results[0];
                // every three results they will be put in the arrays
                const dataBlock = [];
                // 3 DATA INSIDE EACH ARRAY
                const blockSize = 3;
                for(let i = 0; i<res1.length; i +=blockSize){
                    // pushes the res1 into the dataBlock array and will slice (cut the res1 data into block of 1-3)
                    dataBlock.push(res1.slice(i,i+blockSize))
                }
                
                //console.log(dataBlock);
                // console.log(res1);
                res.render('home', {title: 'Chat-application - Home', data: dataBlock});
            })
            
        }
    }
}