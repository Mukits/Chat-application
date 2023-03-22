'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3001/auth/facebook/callback',
    passReqToCallback: true
    
}, (req, token, refreshToken, profile, done) => {
    
// searches for the user useing the profile id
    User.findOne({facebook:profile.id}, (err, user) => {
       if(err){
           return done(err);
       }
        // if the user already exists return the retrieved data
        if(user){
            return done(null, user);
        // if use does not exist then create data for the new user
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            // to retrieve user image from facebook
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token:token});
            // save the created user into the database
            newUser.save((err) => {
                // return done to mean the process has finished without errors (null)
                return done(null, newUser);
            })
        }
    })
}));































