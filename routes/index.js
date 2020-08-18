//all purpose routes
const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      passport = require('passport');
      
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}

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
        if (err){
            console.log(err);
            return res.render('register');
        }
        else {
            console.log("else start");
            passport.authenticate('local')(req, res, function(){		//'local' is the passport authentication strategy
            //Do something when authenticated
            console.log(user._id);              
            res.redirect('/campgrounds');
            });
        }
    });
    //TODO: how do you pass more than username into registered user? 
    // const userId = User.find({username: req.body.username});
    // User.findByIdAndUpdate(userId, function (err, foundItem) {
    //   if (err){
    //     console.log("error");
    //     console.log(err);
    //   }
    //   else {
    //     console.log("embeded else and user info: " + userInfo);
    //     for (const key in req.body.userInfo) {
    //       if (object.hasOwnProperty(key)) {
    //         const value = object[key];
    //         foundItem.key = value;
    //       }
    //     }
    //     console.log(`foundItem: ${foundItem}`);
    //     foundItem.save();
    //   }
    // });
});
  
router.get('*', function(req, res) {
    res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});

module.exports = router;

