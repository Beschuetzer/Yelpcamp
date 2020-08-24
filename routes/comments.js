//routes related to comments
const express = require('express'),
      router = express.Router({mergeParams: true}),
      middleware = require('../middleware/index'),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      User = require('../models/user'),
      campgroundsRoute = '/campgrounds',
      commentsRoute = '/comments';

//Comments New
router.get('/new', middleware.isLoggedIn, middleware.checkWhetherHasCommentAlready, function(req,res){
  Campground.findById(req.params.campgroundId, (err, foundItem) =>{
    if (err){
      console.log(err);
      req.flash('error', `Error finding campground ${req.params.campgroundId}`);
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
      req.flash('error', `Error creating comment`);
    }
    else {
      User.findById(req.user._id, function(err, foundUser) {
        if (err){
          console.log(err);
          req.flash('error', `Error getting user ${req.user._id} in database`);
        }
        else {
          Campground.findById(req.params.campgroundId, function (err, campground) {
            if (err){
              console.log(err);
              req.flash('error', `Error getting campground ${req.params.campgroundId}`);
            }
            else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save((err) => {
                  if (err){
                    console.log(err);
                    req.flash('error', `Error saving comment ${comment._id}`);
                  }
                  else {
                    campground.comments.push(comment);
                    foundUser.comments.push(comment);
                    foundUser.save((err) => {
                      if (err){
                        req.flash('error', `Error saving user ${foundUser._id}`);
                        console.log(err);
                      }
                      else {
                        campground.save(function (err) {
                          if (err){
                            req.flash('error', `Error saving campground ${campground._id}`);
                            console.log(err);
                          }
                          else {
                            req.flash('success', "Successfully Added Comment")
                            res.redirect(campgroundsRoute + '/' + req.params.campgroundId)
                          }
                      });     
                      }
                    });
                  }
                });
                
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
      req.flash('error', `Error finding campground ${req.params.campgroundId}`);
      console.log(err);
    }
    else {
      Comment.findById(req.params.commentId, function (err, matchedComment) {
        if (err) {
          console.log("something went wrong finding comment");
          req.flash('error', 'Error Finding Comment!')
          res.redirect('back');
        }
        else {
          req.flash('success', 'Comment Updated Successfully!')
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
      req.flash('success', 'Comment Updated Successfully!')
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    }
  });
});

//Comment Delete
router.delete('/:commentId', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndDelete(req.params.commentId, function(err, deletedComment){
    if (err){
      console.log(err);
      req.flash('error', `Error finding comment ${req.params.commentId}`);
    }
    else {
      Campground.findById(req.params.campgroundId, (err, campground)=> {
        if (err){
          console.log(err);
          req.flash('error', `Error finding campground ${req.params.campgroundId}`);
        }
        else {
          let i = 0;
          // console.log(`comments: ${campground.comments}`);
          while (campground.comments[i]) {
            if (campground.comments[i]._id.equals(deletedComment._id)) {
              campground.comments.splice(i);
              campground.save((err, savedcampground) => {
                if (err){
                  console.log(err);
                  req.flash('error', `Error saving campground ${req.params.campgroundId}`);
                }
                else {  
                  User.findById(req.user._id, (err, user) => {
                    if (err){
                      console.log(err);
                      req.flash('error', `Error finding user ${req.user._id}`);
                    }
                    else {
                      let i = 0;
                      // console.log(`user comments: ${user.comments}`);
                      while (user.comments[i]) {
                        if (user.comments[i]._id.equals(deletedComment._id)) {
                          user.comments.splice(i);
                          user.save((err, saveduser) => {
                            if (err){
                              console.log(err);
                              req.flash('error', `Error saving user ${req.user._id}`);
                            }
                            else {
                              req.flash('success', `Successfully deleted comment\n'${deletedComment.text.slice(0, 10)}'...`);
                              res.redirect(`/campgrounds/${req.params.campgroundId}`);
                            }
                          });
                          break;
                        }
                        i++;
                      }
                    }
                  }); 
                }
              });
              break;
            }
            i++;
          }; 
                  
        }
      });
    }
  });
});

module.exports = router;
