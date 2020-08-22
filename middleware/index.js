const Campground = require('../models/campground');
const Comment = require('../models/comment');

//all middleware goes here
const middlewareObj = {
};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if (req.isAuthenticated()){
      Campground.findById(req.params.campgroundId, function (err, matchedItem) {
        if (err) {
          //if error finding
          console.log("something went wrong finding campground");
          res.redirect('back');
        }
        else {
          if (req.user._id.equals(matchedItem.author.id)){
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

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }

middlewareObj.checkCommentOwnership = function (req, res, next){
    if (req.isAuthenticated()){
      Comment.findById(req.params.commentId, function (err, matchedComment) {
        if (err) {
          //if error finding ID
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

module.exports = middlewareObj;