module.exports = {
    ensureAuthenticate: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next;
        }
        req.flash('error_msg', "Please login first if you want to access" );
        res.redirect('/');
    },

    forwardAuthenticate: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', "You has been logged" );
        res.redirect('/dashboard');
    }
}