if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const express = require('express');
const path = require('node:path');
const ejsMate = require('ejs-mate'); // used for layout template
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override'); // HTML just support Get and POST
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/user');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');


// set up database connection
const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(databaseUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret', // String used to sign the session ID
    resave: false, // Whether to force session resave on every request, even if not modified
    saveUninitialized: true, // Whether to store uninitialized sessions
    cookie: {
        httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (improves security)
        maxAge: 1000 * 60 * 60 * 24 * 7, // Set session expiration time (7 days in milliseconds)
    }
}
app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Router
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// It will appear when there is no function matched
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong';
    }

    res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));