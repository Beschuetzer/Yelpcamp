//routes related to comments
const express = require('express'),
      router = express.Router({mergeParams: true}),
      middleware = require('../middleware/index'),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      campgroundsRoute = '/campgrounds',
      commentsRoute = '/comments';

//Comments New
router.get('/new', middleware.isLoggedIn, function(req,res){
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
router.post('/', middleware.isLoggedIn, function (req,res) {
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
router.get("/:commentId/edit", middleware.checkCommentOwnership, function (req, res) {
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
          req.flash('success', 'Comment Added Successfully!')
          res.render('./comments/edit', {comment: matchedComment, campground: matchedCampground});
        }
      });
    }
  });
});

//Comment Update
router.put('/:commentId/', middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.commentId, function (err, matchedComment) {
    if (err){
      req.flash('error', `Error finding comment ${commentId}`)
      console.log(err);
    }
    else {
      matchedComment.text = req.body.comment.text;
      matchedComment.date = Date.now();
      matchedComment.save();
      req.flash('success', 'Comment Added Successfully!')
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    }
  });
});

//Comment Delete
router.delete('/:commentId', middleware.checkCommentOwnership, function(req, res) {
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
