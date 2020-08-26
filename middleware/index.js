const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require("../models/user");

//all middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.campgroundId, function (err, matchedItem) {
      if (err || !matchedItem) {
        //if error finding
        console.log("something went wrong finding campground");
        req.flash(
          "error",
          `Error finding campground '${req.params.campgroundId}' in database...`
        );
        res.redirect("back");
      } else if (req.user._id.equals(matchedItem.author.id)) {
          next();
      } else {
        //if not authorized
        req.flash("error", `You are not authorized to do that!`);
        res.redirect("back");
      }
    });
  } else {
    //if not logged in
    req.flash("error", "Please Login First!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId, function (err, matchedComment) {
      if (err || !matchedComment) {
        //if error finding ID
        console.log("something went wrong finding campground");
        req.flash(
          "error",
          `Error finding comment '${req.params.commentId}' in database...`
        );
        res.redirect("/campgrounds");
      } else if (req.user._id.equals(matchedComment.author.id)) {
          next();
      } else {
        //if not authorized
        req.flash("error", `You are not authorized to do that!`);
        res.redirect("back");
      }
    });
  } else {
    //if not logged in
    req.flash("error", "Please Login First!");
    res.redirect("back");
  }
};

middlewareObj.checkWhetherHasCommentAlready = function (req, res, next) {
  Campground.findById(req.params.campgroundId)
    .populate("comments")
    .exec(function (err, campground) {
      if (err || !campground) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        let ownsComment = false;
        let j = 0;
        while (campground.comments[j]) {
          if (campground.comments[j].author.id.equals(req.user._id)) {
            ownsComment = true;
            break;
          }
          j++;
        }
        if (!ownsComment) {
          next();
        } else {
          req.flash(
            "error",
            `You already have a comment for ${campground.name}!`
          );
          res.redirect("back");
        }
      }
    });
};

middlewareObj.checkHasPaid = function (req, res, next) {
  console.log(req.user);
  if (req.user) {
    if (req.user.isPaid) {
      next();
    }
    else {
      req.flash('error', `Please Pay the Registration Fee to do That`);
      res.render('checkout', {amount: 2000});
    }
  }
  else {
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
