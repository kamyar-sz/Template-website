module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'ابتدا وارد حساب کاربری خود شوید!');
    return res.redirect('/login');
  }
  next();
}