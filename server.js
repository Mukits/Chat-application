const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const { Users } = require('./helpers/UserHelper');
const compression = require('compression');
const helmet = require('helmet');
const {Global} = require('./helpers/Global');

const container = require('./container');
//parameters are the controllers we are creating
container.resolve(function (users, _, admin, home, groupcht, searchResults, privateChat, myProfile, myInterests) {

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/Chat-Application', { useNewUrlParser: true, useUnifiedTopology: true });

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        const io = require('socket.io')(server);
        server.listen(3001, function () {
            console.log('Listening on port 3001');
        });
        ConfigureExpress(app);

        require('./socketio/groupchat')(io, Users);
        require('./socketio/friendRequestSnd')(io);
        require('./socketio/globalrooms')(io, Global,_);
        require('./socketio/privatemessage')(io);

        // require('./socket/globalroom')(io, Global, _);
        // require('./socket/privatemessage')(io);

        //Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        groupcht.SetRouting(router);
        searchResults.SetRouting(router);
        privateChat.SetRouting(router);
        myProfile.SetRouting(router);
        myInterests.SetRouting(router);
        app.use(router);

        app.use(function (req, res) {
            res.render('404');
        });
    }

    function ConfigureExpress(app) {
        app.use(compression());
        app.use(helmet());

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(session({
            secret: 'something',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
        // lodash is set as a global variable so it can be used in views
        app.locals._ = _;

    }

});


















