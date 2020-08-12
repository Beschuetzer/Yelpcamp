//#region Setting up Packages and Mongoose
const express = require('express'),
      app = express(),
      axios = require('axios'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      dbName = "yelpCamp";

mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to yelpCamp!'))
.catch(error => console.log(error.message));

//creating a schema for each objecct
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  alt: String,
});

//creating the campgrounds collection in the db 'yelpCamp'
const Campground = mongoose.model("Campground", campgroundSchema);
//#endregion
//#region Configuring Express
//telling express to serve files in 'public'
app.use(express.static("public"));
app.use(express.static("views/imgs"));
app.use(bodyParser.urlencoded([{extended: true}]));

//allows you to omit .ejs for every file
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
      res.render('campgrounds', {campgrounds: returnedItem});
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
        res.redirect('campgrounds');
      }
    });
  }
  else {
    res.redirect('new')
  }
});

app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs')
});

app.get('*', function(req, res) {
  res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});
//#endregion

// campgrounds = [
//   {alt: "Fiery Nights", name: "Salmon Creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Light a fire and relax with some friends on this camping experience."},
//   {alt: "Multi Hued Camping", name: "Social Camping", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Colorfully selected tents and wonderful company abound on this camping experience."},
//   {alt: "Starry sky camping", name: "Astronomy View", image: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Ever wanted to be a part of the Universe?  This experience is GALACTIC!"},
//   {alt: "Camping During the Day", name: "Day Camping", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Break free from convention!  Explore your inner rebel!"},
// ];



