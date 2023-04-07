
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    fullname: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'defaultPic.png'},
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    // will contain the username of whomever the friend request is sent to its an object array
    sentFriendRequest: [{
        username: {type: String, default: ''}
    }],
    // this field will contain the sender id and username its an object array
    friendRequestSender: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    // when the receiver accept the request, this field for both the receiver and sender will be updated
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }],
    // if user cancels a request its value will be reduced by o1 otherwise incremented by 1 if a new request is received
    totalFriendRequest: {type: Number, default: 0},
    gender: {type: String, default: ''},
    country: {type: String, default: ''},
    mantra: {type: String, default: ''},
    favFood: [{
        teamName: {type: String, default: ''}
    }],
    favSport: [{
        playerName: {type: String, default: ''}
    }],
    favClub: [{
        clubName: {type: String}
    }]
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);