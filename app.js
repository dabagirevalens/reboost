const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const dbConnect = require('./config/dbConnect');
const routes = require('./routes');
const { redirect } = require('express/lib/response');


const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev')); // log every request to the console
app.use(express.json({ extendUrl: true })); // parse application/json
app.use(cors()) // allow cross-origin requests
app.use(session({
    secret: process.env.SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
})

passport.deserializeUser(function (id, cb) {
    cb(null, id);
})

//connecting to database
dbConnect();

app.use('/api/v1/', routes);

//ejs templates
app.get('/', function (req, res) {
    if (req.user)
        return res.redirect('/dashboard')
    res.render('index.ejs');
});

//protected routes
const isAuth = (req, res, next) => {
    if (req.user)
        next()
    else
        res.redirect('/')
}
app.get('/dashboard', isAuth, function (req, res) {
    res.render('dashboard.ejs')
})

module.exports = app;