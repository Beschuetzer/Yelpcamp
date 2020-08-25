//routes related to campgrounds
const express = require('express'),
      router = express.Router(),
      middleware = require('../middleware/index'),
      Campground = require('../models/campground'),
      campgroundsRender = 'campgrounds/',
      Comment = require('../models/comment');

//Campground Index
router.get('/', function(req, res){
  Campground.find({}, (err, returnedItem) => {
    if (err || !returnedItem) {
      console.log("something went wrong finding");
      req.flash('error', 'Something went wrong getting Campground :(')
      res.redirect('back');
    }
    else {
      res.render(campgroundsRender + 'index', {campgrounds: returnedItem});
    }
  });
});

//Campground New
router.get('/new', middleware.isLoggedIn, (req,res) => {
    //New
    res.render(campgroundsRender + 'new')
  });

//Campground Create
router.post('/',  middleware.isLoggedIn, (req,res) =>{
  const name = req.body.name,
        image = req.body.image,
        price = req.body.price,
        alt = "A Beautiful Campground Photo Taken by a User";
        description = req.sanitize(req.body.description);
        descriptionValid = description != null && description.trim() !== "",
        nameValid = name != null && name.trim() !== "" && !name.match(/[<>]/i),
        imageValid = image.match(/\s*http[s]*:\/\/.*|\s*www\..*/i),
        altValid = alt != null && alt.trim() !== "" && !alt.match(/[<>]/i);
        
  if (nameValid && imageValid && descriptionValid && altValid){
    Campground.create({
      name: name,
      image: image,
      description: description,
      alt: alt,
      price: price,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    }, function (err, returnedItem) {
       if (err || !returnedItem) {
        req.flash('error', 'Something went wrong creating Campground :(')
        console.log("something went wrong");
        res.redirect('back');
      }
      else {
        req.flash('success', `'${name}' successfully created!`)
        res.redirect('/campgrounds');
      }
    });
  }
  else {
    if (!nameValid) {
      req.flash('error', `'${name}' is not a valid Campground Name!`)
    }
    else if (!imageValid) {
      req.flash('error', `'${image}' is not a Valid Image Url!`)
    }
    else if (!descriptionValid) {
      req.flash('error', `'${description}' is not a Valid Description!`)
    }
    else if (!altValid) {
      req.flash('error', `'${alt}' is not a Valid Image Alternative Description!`)
    }
    res.redirect('back')
  }
});

//Campground Show
router.get('/:campgroundId', (req, res) =>{
  Campground.findById(req.params.campgroundId).populate('comments').exec(function(err,foundItem){
     if (err || !foundItem) {
      req.flash('error', `Something went wrong getting campground '${req.params.campgroundId}'`);
      res.redirect(`/campgrounds`);
    }
    else {
      const leftsideCurrencies = [
        "$",
        "€",
        "¥",
      ];
      res.render(campgroundsRender + 'show', {campground: foundItem, leftsideCurrencies: leftsideCurrencies});
    }
  });
});

//Campground Delete
router.delete('/:campgroundId', middleware.checkCampgroundOwnership, function (req,res){
  Campground.findByIdAndDelete(req.params.campgroundId, function(err, deletedCampground){
     if (err || !deletedCampground){
      console.log(err);
      req.flash('error', `Something went wrong getting campground ${req.params.campgroundId}`);
      res.redirect('back');
    }
    else {
      deletedCampground.comments.forEach(comment => {
        Comment.findByIdAndDelete(comment, function (err, deletedComment) {
           if (err || !deletedComment){
            console.log(err);
            req.flash('error', `Something went wrong getting comment ${req.params.commentId}`);
            res.redirect('back');        
          }
          else {
            console.log("deleting " + deletedComment);
          }
        });
      });
      req.flash('success', `Campground '${deletedCampground.name}' and its comments deleted successfully.`);
      res.redirect('/campgrounds');

    }
  });
});

//Campground Edit
router.get('/:campgroundId/edit', middleware.checkCampgroundOwnership, function (req, res){
  Campground.findById(req.params.campgroundId, function(err, matchedItem) {
     if (err || !matchedItem){
      console.log(err);
      req.flash('error', `Something went wrong getting comment ${req.params.commentId}`);
      res.redirect('back');        
    }
    else {
      res.render(campgroundsRender + 'edit', {campground: matchedItem})
    }
  });
});

//Campground Update
router.put('/:campgroundId', middleware.checkCampgroundOwnership, function (req, res){
  req.body.campground.price = req.body.price;
  console.log(req.body.campground);
  req.body.campground.description = req.sanitize(req.body.campground.description)   //sanitize any inputs from 'new.ejs' that use <%-...%> in show.ejs or elsewhere
  Campground.findByIdAndUpdate(req.params.campgroundId, req.body.campground, function (err, updatedItem) {
     if (err || !updatedItem) {
      console.log("something went wrong updating " + req.params.campgroundId);
      req.flash('error', `Something went wrong getting campground object '${req.params.campgroundId}'`);
      res.redirect('/');
    }
    else {
      console.log({updatedItem});
      req.flash('success', `${updatedItem.name} updated successfully`)
      res.redirect(req.params.campgroundId);  
    }
  });
});

module.exports = router;
