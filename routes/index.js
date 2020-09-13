//all purpose routes
const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      passport = require('passport'),
      crypto = require('crypto'),
      nodeMailer = require('nodemailer'),
      async = require('async');
      
//resetting password
router.get('/resetPassword', (req, res) => {
    res.render('resetPassword');
});

router.post('/resetPassword', (req, res) => {
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
                    return res.redirect('/resetPassword');
                }
                else if (err) {
                    req.flash('error', `Error retrieving email.  Try again.`);
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000 //in MS
                user.save((err) => {
                    done(error, token, user);
                });
            });
        },
        function(token, user, done) {
            const smtpTransport = nodeMailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'aMajorBridge@gmail.com',
                    pass: process.env.gmailPassword,
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'aMajorBridge@gmail.com',
                subject: 'Reset Password to Your YelpCamp Account',
                text: `You are receiving this because you (or someone else) have requested the reset of the password to the YelpCamp account associated with email ${req.body.email}.  Please click on the following link, or paste this into your browser to complete the process`
            }
        }
    ]);
    // res.redirect('resetPassword');
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

