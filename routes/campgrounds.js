//routes related to campgrounds
const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground'),
      campgroundsRender = 'campgrounds/';



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
router.get('/new', isLoggedIn, (req,res) => {
    //New
    res.render(campgroundsRender + 'new')
  });

//Campground Create
router.post('/',  isLoggedIn, (req,res) =>{
  console.log(req.body)
  const name = req.body.name,
        image = req.body.image,
        alt = "A Beautiful Campground Photo Taken by a User";
  let description = req.body.description;
  description = req.sanitize(description);

  //need to validate data before creating new entry
  const nameValid = name != null & name.trim() !== "" & !name.match(/[<>]/i),
        imageValid = image != null & image.trim() !== "" & !image.match(/[<>]/i),
        descriptionValid = description != null & description.trim() !== "",
        altValid = alt != null & alt.trim() !== "" & !alt.match(/[<>]/i);

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
        console.log("something went wrong");
      }
      else {
        res.redirect('/campgrounds');
      }
    });
  }
  else {
    res.redirect('/new')
  }
});

//Campground Show
router.get('/:id', (req, res) =>{
  Campground.findById(req.params.id).populate('comments').exec(function(err,foundItem){
    if (err) {
      console.log("something went wrong show route");
    }
    else {
      res.render(campgroundsRender + 'show', {campground: foundItem});
    }
  });
});

//Campground Delete
router.delete('/:id', checkCampgroundOwnership, function (req,res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if (err){
      console.log(err);
    }
  });
  res.redirect('/campgrounds')
});

//Campground Edit
router.get('/:id/edit', checkCampgroundOwnership, function (req, res){
  Campground.findById(req.params.id, function(err, matchedItem) {
    res.render(campgroundsRender + 'edit', {campground: matchedItem})
  });
});

//Campground Update
router.put('/:id', checkCampgroundOwnership, function (req, res){
  req.body.campground.description = req.sanitize(req.body.campground.description)   //sanitize any inputs from 'new.ejs' that use <%-...%> in show.ejs or elsewhere
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedItem) {
    if (err) {
      console.log("something went wrong updating " + req.params.id);
      res.redirect('/');
    }
    else {
      res.redirect(req.params.id)
    }
  });
});

module.exports = router;

function isLoggedIn (req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function (err, matchedItem) {
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
