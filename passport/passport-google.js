'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    passReqToCallback: true
    //search from users table if the profile id is found in the database then dont create a new one
}, function (req, accessToken, refreshToken, profile, done) {
    User.findOne({ google: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, user);
            //if data not found already on database create a new user
        } else {

            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile.photos[0].value;
            
            newUser.save((err) => {
                return done(null, newUser);
            })
        }
    })
}));































