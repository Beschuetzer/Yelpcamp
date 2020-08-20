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
  Campground.findById(req.params.campgroundId, (err, foundItem) =>{
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
      Campground.findById(req.params.campgroundId, function (err, campground) {
        if (err){
          console.log(err);
        }
        else {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save(function (err) {
                if (err){
                console.log(err);
                }
                else {
                res.redirect(campgroundsRoute + '/' + req.params.campgroundId)
                }
            });      
        }
      });
    }
  });
});

//Comment Edit
router.get("/:commentId/edit", checkCommentOwnership, function (req, res) {
  Campground.findById(req.params.campgroundId, function (err, matchedCampground) {
    if (err){
      console.log(err);
    }
    else {
      Comment.findById(req.params.commentId, function (err, matchedComment) {
        if (err) {
          //if error finding
          console.log("something went wrong finding comment");
          res.redirect('back');
        }
        else {
          res.render('./comments/edit', {comment: matchedComment, campground: matchedCampground});
        }
      });
    }
  });
});

//Comment Update
router.put('/:commentId/', checkCommentOwnership, function(req, res) {
  //change commendId text 
  Comment.findById(req.params.commentId, function (err, matchedComment) {
    if (err){
      console.log(err);
    }
    else {
      matchedComment.text = req.body.comment.text;
      matchedComment.date = Date.now();
      matchedComment.save();
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    }
  });
  //add the date created
});

//Comment Delete
router.delete('/:commentId', function(req, res) {
  Comment.findByIdAndDelete(req.params.commentId, function(err, deletedComment){
    if (err){
      console.log(err);
    }
    else {
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    }
  });
});

module.exports = router;

function checkCommentOwnership(req, res, next){
  if (req.isAuthenticated()){
    Comment.findById(req.params.commentId, function (err, matchedComment) {
      if (err) {
        //if error finding
        console.log("something went wrong finding campground");
        res.redirect('back');
      }
      else {
        if (req.user._id.equals(matchedComment.author.id)){
          next();
        }
        else {
          //if not authorized
          res.redirect('back');
        }
      }
    });
  } else {
    //if not logged in
    res.redirect('back');
  }
}