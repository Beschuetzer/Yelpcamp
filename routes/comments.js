//routes related to comments
const express = require('express'),
      router = express.Router({mergeParams: true}),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      campgroundsRoute = '/campgrounds',
      commentsRoute = '/comments';

//Middleware
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}

//Comments New
router.get('/new', isLoggedIn, function(req,res){
  Campground.findById(req.params.id, (err, foundItem) =>{
    if (err){
      console.log(err);
    }
    else {
      res.render('.' + commentsRoute + "/new", {campground: foundItem});
    }
  });
});

//Comment Create
router.post('/', isLoggedIn, function (req,res) {
  Comment.create({text: req.body.comment.text}, function(err, comment) {
    if (err){
      console.log(err);
    }
    else {
      Campground.findById(req.params.id, function (err, campground) {
        if (err){
          console.log(err);
        }
        else {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            console.log(comment);
            campground.comments.push(comment);
            campground.save(function (err) {
                if (err){
                console.log(err);
                }
                else {
                console.log("Successfully added comment");
                res.redirect(campgroundsRoute + '/' + req.params.id)
                }
            });      
        }
      });
    }
  });
});

module.exports = router;