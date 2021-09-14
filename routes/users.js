const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req,res) => {
 res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
 const { username, email, password } = req.body;
 const user = new User({ email, username });
 const registeredUser = await User.register(user, password);
 req.flash('success', 'ثبت نام با موفقیت انجام شد.')
 res.redirect('/');
}));

router.get('/login', (req, res) => {
 res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
 req.flash('success', 'خوش آمدید');
 const redirectUrl = req.session.returnTo || '/';
 res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
 req.logout();
 req.flash('success', 'با موفقیت خارج شدید');
 res.redirect('/');
})


module.exports = router;