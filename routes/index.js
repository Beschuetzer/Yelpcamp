//all purpose routes
const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      passport = require('passport');
      
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
      next();
    }
    req.flash('error', `Please login first`);
    res.redirect('/login');
}

const stripe = require('stripe');
      paymentIntent = await stripe.paymentIntents.create({
          amount: 2000,            //number of cents
          currency: 'usd',
          //Verify integration
          metadata: {integration_check: 'accept_a_payment'},
      })


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
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err || !user){
            console.log(err);
            req.flash('error', `${err.message}`);
            res.redirect('/register');
        }
        else {
            passport.authenticate('local')(req, res, function(){		//'local' is the passport authentication strategy
                //Do something when authenticated
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

