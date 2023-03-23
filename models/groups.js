const mongoose = require('mongoose');

//schema for the groups table where we will be saving all the info about clubs
const groupNames = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    //the image will be set to default now but then will be taken from the s3 bucket to be set by admin
    image: {type: String, default: 'default.png'},
    //at the beginning it will be empty but when a user will add a group to favorites he will be added to this array
    members: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});

module.exports = mongoose.model('Group', groupNames);