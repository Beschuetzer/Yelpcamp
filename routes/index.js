const { nextTick } = require('process');

//all purpose routes
const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      passport = require('passport'),
      crypto = require('crypto'),
      nodeMailer = require('nodemailer'),
      async = require('async');
      
//resetting password
router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword');
});

router.post('/forgotPassword', (req, res, next) => {
    async.waterfall([
        //Creates a 
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({email: req.body.email}, (err, user) => {
                if(!user) {
                    req.flash('error', `No Account with the email '${req.body.email}' exists.`);
                    return res.redirect('/forgotPassword');
                }
                else if (err) {
                    req.flash('error', `Error retrieving email.  Try again.`);
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000 //in MS
                user.save((err) => {
                    if (err) {
                        req.flash('error', `Error saving User`);
                        return res.redirect('/forgotPassword');
                    }
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            const smtpTransport = nodeMailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'amajorbridge@gmail.com',
                    pass: process.env.gmailPassword,
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'amajorbridge@gmail.com',
                subject: 'Reset Password to Your YelpCamp Account',
                text: `You are receiving this because you (or someone else) have requested the reset of the password to the YelpCamp account associated with email ${req.body.email}.  Please click on the following link, or paste this into your browser to complete the process.\n\nhttp://${req.headers.host}/resetPassword/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`
            }
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('mail sent');
                req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('back');
    });
});

router.get('/resetPassword/:token', async (req, res) => {
    try {
        const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordToken: {$gt: Date.now()}});
        if (!user){
            req.flash('error', `Password Reset token is invalid or has expired.`);
            return res.redirect('/forgotPassword');
        }
        return res.render('resetPassword', {token: req.params.token});
    } catch (error) {
        req.flash('error', `Error encountered getting user: $\n{error}.`);
        return res.redirect('/forgotPassword');
    }
});

router.post('/resetPassword/:token', async (req, res) => {
    console.log(req.params.token);
    console.log(req.params.password);
    console.log(req.params.passwordConfirmed);
    if (req.body.password !== req.body.passwordConfirmed) {
        req.flash('error', `The passwords do not match.  Try again.`);
        return res.redirect(`/resetPassword/${req.params.token}`);
    }
    const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordToken: {$gt: Date.now()}});
    if (!user){
        req.flash('error', `Password Reset token is invalid or has expired.`);
        return res.redirect('/forgotPassword');
    }
    try {
        await user.setPassword(req.body.password);
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;
        await user.save(err => {
            if (err) {
                req.flash('error', `Error saving new Password.`);
                return res.redirect('/resetPassword');
            }
        });
    } catch (error) {
        req.flash('error', `Something went wrong saving the new password.  Try again.`);
        return res.redirect('/forgotPassword');
    }
    //sends an email using nodeMailer
    const smtpTransport = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'amajorbridge@gmail.com',
            pass: process.env.gmailPassword,
        }
    });
    const mailOptions = {
        to: user.email,
        from: 'amajorbridge@gmail.com',
        subject: 'Your YelpCamp Password has been Changed',
        text: `This is a confirmation that your YelpCamp password has been changed for the account associated with the email ${user.email}.\n\nIf you did not reset your password then you may have been hacked.`
    }
    smtpTransport.sendMail(mailOptions, (err) => {
        if (err) {
            console.log('Password reset confirmation email failed...');
        }
        req.flash('success', `Success!  Your password has been changed.`);
        res.redirect('/login');
    });

});

//landing
router.get('/', function(req, res){
    res.render('landing');
  });

router.get('/privacypolicy', function(req,res) {
    res.render('privacypolicy');
});

//login
router.get('/login', function(req,res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
}),function(req,res){
    //callback
});

//logout
router.get('/logout', function(req,res){
    req.logout();       //passport's logout()
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/campgrounds');
});

router.get('/register', (req,res) =>{
    //Show Signup Form
    res.render('register');
});

router.post('/register', (req,res) =>{
    //Signing up a New User
    //register(username, passwordToCreateHashFrom, callback)
    //THE USERNAME MUST BE NAMED EXACTLY 'username' IN THE NAME ATTR FOR THE SUBMITTING register.ejs FORM as well as the User model must have 'username' key
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        zipCode: req.body.zipCode,
    });
    if (req.body.adminCode === '1234') {
        console.log(req.body.adminCode);
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if (err || !user){
            console.log(err);
            req.flash('error', `${err.message}`);
            res.redirect('/register');
        }
        else {
            passport.authenticate('local')(req, res, function(){		
                //'local' is the passport authentication strategy
                req.flash('success', `Welcome to YelpCamp ${req.body.username}!`);
                res.redirect('/campgrounds');
            });
        }
    });
});
  
router.get('*', function(req, res) {
    res.render('404', {page: req.originalUrl});
});

module.exports = router;

