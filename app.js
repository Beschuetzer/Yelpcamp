//#region Setting up Packages and Mongoose
const express = require('express'),
      app = express(),
      axios = require('axios'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      dbName = "yelpCamp",
      Campground = require('./models/campground.js');
      

mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to yelpCamp!'))
.catch(error => console.log(error.message));

//#endregion
//#region Configuring Express
//telling express to serve files in 'public'
app.use(express.static("public"));
app.use(express.static("views/imgs"));
app.use(bodyParser.urlencoded([{extended: true}]));
app.use(methodOverride("_method"));

d//allows you to omit .ejs for every file
app.set('view engine', 'ejs');

app.listen(3000, function(){
  console.log("Starting Yelp Camp Server...");
});
//#endregion
//#region Routes
app.get('/', function(req, res){
  res.render('landing');
});

app.get('/campgrounds', function(req, res){
  //finding all entries in collection
  //first parameter is the condition (use {} for whole collection)
  Campground.find({}, (err, returnedItem) => {
    if (err) {
      console.log("something went wrong finding");
    }
    else {
      console.log("Found the following: \n" + returnedItem);
      res.render('index', {campgrounds: returnedItem});
    }
  });
});

app.post('/campgrounds', (req,res) =>{
  console.log(req.body)
  const name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        alt = "A Beautiful Campground Photo Taken by a User";

  //need to validate data before creating new entry
  const nameValid = name != null & name.trim() !== "" & !name.match(/[<>]/i),
        imageValid = image != null & image.trim() !== "" & !image.match(/[<>]/i),
        descriptionValid = description != null & description.trim() !== "" & !description.match(/[<>]/i),
        altValid = alt != null & alt.trim() !== "" & !alt.match(/[<>]/i);

  if (nameValid && imageValid && descriptionValid && altValid){
    Campground.create({
      name: name,
      image: image,
      description: description,
      alt: alt,
    }, function (err, returnedItem) {
      if (err) {
        console.log("something went wrong");
      }
      else {
        console.log('toAdd saved to database' + returnedItem);
        res.redirect('/campgrounds');
      }
    });
  }
  else {
    res.redirect('new')
  }
});

app.get('/campgrounds/new', (req,res) => {
  res.render('new')
});

app.get('/campgrounds/:id', (req, res) =>{
  Campground.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log("something went wrong finding ID");
    }
    else {
      res.render('show', {campground: foundItem});
    }
  });
});

app.delete('/campgrounds/:id', function (req,res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if (err){
      console.log(err);
    }
  });
  res.redirect('/campgrounds')
});

app.get('*', function(req, res) {
  res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});
//#endregion



