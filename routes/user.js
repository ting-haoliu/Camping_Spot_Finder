const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

// Register
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        // login after register successfully
        req.login(registeredUser, error => {
            if (error) {
                return next(error);
            }
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register')
    }
}));

// Login
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logOut(function (error) {
        if (error) {
            return next(error);
        }
        req.flash('success', 'Successfully Log Out!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;