'use strict';

module.exports = function(_, passport, validator){
    
    return {
        // setting up the routes
        SetRouting: function(router){
            // route for login page
            router.get('/', this.indexPage);
            // route for signup page
            router.get('/signup', this.getSignUp);
            // route for facebook login
            router.get('/auth/facebook', this.getFacebookLogin);
            // route for facebook login callback (the url is described in the google developer account)
            router.get('/auth/facebook/callback', this.facebookLogin);
            // route for google login
            router.get('/auth/google', this.getGoogleLogin);
            // route for google login callback (the url is described in the google developer account)
            router.get('/auth/google/callback', this.googleLogin);
            
            
            // user login validation
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail()
                    .withMessage('Enter a valid email'),
                validator.check('password').not().isEmpty()
                    .withMessage('Password must be 5 or more characters'),
            ], this.postValidation, this.postLogin);
            // user sign up page validation
            router.post('/signup', [
                validator.check('username').not().isEmpty().isLength({min: 3}).withMessage('Username must be at least 3 characters.'),
                validator.check('email').not().isEmpty().isEmail()
                    .withMessage('Enter a valid email'),
                validator.check('password').not().isEmpty()
                    .withMessage('Password must be 5 or more characters'),
                validator.check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
                    .withMessage('Password not complex enough ensure there is: Lowercase, Uppercase, Number and Special Char'),
            ], this.postValidation, this.postSignUp);
        },
        // function for rendering the index page, passing in hasErrors and messages so that they can be used in the index.ejs file
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'Chat-application - Login', messages: errors, hasErrors: errors.length > 0});
        },
        // login user through the use of the passport-local.js
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '',
            failureFlash: true
        }),
        // function for rendering the signup page passing in hasErrors and messages so that they can be used in the singup.ejs file
        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'Chat-application - SignUp', messages: errors, hasErrors: errors.length > 0});
        },

        postValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            const reqErrors = err.array();
            const errors = reqErrors.filter(e => e.msg !== 'Invalid value');
            let messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            // req.flash('error', messages);
            if (messages.length > 0) {
                req.flash('error', messages);
                if (req.url === '/signup') {
                    res.redirect('/signup');
                } else if(req.url === '/') {
                    res.redirect('/');
                }
            }
            return next();
        },
        // signup user through the use of the passport-local.js
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '',
            failureFlash: true
        }),
        
        getFacebookLogin: passport.authenticate('facebook', {
        scope: 'email' 
        }),
        
        getGoogleLogin: passport.authenticate('google', {
            scope: ['profile','email']
        }),
        
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        // call back route if authenticate success then user will be taken to homepage
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            // if authentication fails go back to signup
            failureRedirect: '/signup',
            failureFlash: true
        })
    }
    
}















