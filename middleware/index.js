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
          req.flash("error", `Error finding campground '${req.params.campgroundId}' in database...`)
          res.redirect('back');
        }
        else {
          if (req.user._id.equals(matchedItem.author.id)){
            next();
          }
          else {
            //if not authorized
            req.flash("error", `You are not authorized to do that!`)
            res.redirect('back');
          }
        }
      });
    } else {
        //if not logged in
        req.flash("error", "Please Login First!");
        res.redirect('back');
    }
  }

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect('/login');
  }

middlewareObj.checkCommentOwnership = function (req, res, next){
    if (req.isAuthenticated()){
      Comment.findById(req.params.commentId, function (err, matchedComment) {
        if (err) {
          //if error finding ID
          console.log("something went wrong finding campground");
          req.flash("error", `Error finding comment '${req.params.commentId}' in database...`)
          res.redirect('back');
        }
        else {
          if (req.user._id.equals(matchedComment.author.id)){
            next();
          }
          else {
            //if not authorized
            req.flash("error", `You are not authorized to do that!`)
            res.redirect('back');
          }
        }
      });
    } else {
      //if not logged in
        req.flash("error", "Please Login First!");
        res.redirect('back');
    }
  }

module.exports = middlewareObj;