const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut(function (error) {
        if (error) {
            return next(error);
        }
        req.flash('success', 'Successfully Log Out!');
        res.redirect('/campgrounds');
    });
}