module.exports = function (async, group, _, Users) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage)
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
                }

            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
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
                res.render('home', { title: 'Chat-application - Home', user: req.user, parts: dataBlock, country: sortByCountry, data: res3 });
            })

        }
    }
}