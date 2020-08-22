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
    if (err) {
      console.log("something went wrong finding");
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
        alt = "A Beautiful Campground Photo Taken by a User";
  let description = req.body.description;
  description = req.sanitize(description);

  //need to validate data before creating new entry
  const nameValid = name != null && name.trim() !== "" && !name.match(/[<>]/i),
        imageValid = image.match(/\s*http:\/\/.*|\s*www\..*/i),
        descriptionValid = description != null && description.trim() !== "",
        altValid = alt != null && alt.trim() !== "" && !alt.match(/[<>]/i);

  if (nameValid && imageValid && descriptionValid && altValid){
    const author = 
    Campground.create({
      name: name,
      image: image,
      description: description,
      alt: alt,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    }, function (err, returnedItem) {
      if (err) {
        req.flash('error', 'Something went wrong creating Campground :(')
        console.log("something went wrong");
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
    if (err) {
      console.log("something went wrong show route");
    }
    else {
      res.render(campgroundsRender + 'show', {campground: foundItem});
    }
  });
});

//Campground Delete
router.delete('/:campgroundId', middleware.checkCampgroundOwnership, function (req,res){
  Campground.findByIdAndDelete(req.params.campgroundId, function(err, deletedCampground){
    if (err){
      console.log(err);
    }
    else {
      console.log(deletedCampground);
      deletedCampground.comments.forEach(comment => {
        Comment.findByIdAndDelete(comment, function (err, deletedComment) {
          if (err){
            console.log(err);
          }
          else {
          }
        });
      });
    }
  });
  res.redirect('/campgrounds')
});

//Campground Edit
router.get('/:campgroundId/edit', middleware.checkCampgroundOwnership, function (req, res){
  Campground.findById(req.params.campgroundId, function(err, matchedItem) {
    res.render(campgroundsRender + 'edit', {campground: matchedItem})
  });
});

//Campground Update
router.put('/:campgroundId', middleware.checkCampgroundOwnership, function (req, res){
  req.body.campgrounameription = req.sanitize(req.body.campground.description)   //sanitize any inputs from 'new.ejs' that use <%-...%> in show.ejs or elsewhere
  Campground.findByIdAndUpdate(req.params.campgroundId, req.body.campground, function (err, updatedItem) {
    if (err) {
      console.log("something went wrong updating " + req.params.campgroundId);
      res.redirect('/');
    }
    else {
      res.redirect(req.params.campgroundId);  
    }
  });
});

module.exports = router;
