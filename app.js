//including partials: <%- include("partials/header") %>
const express = require('express');
const app = express();
const axios = require('axios');
//May not need the pkgs below here:
const bodyParser = require('body-parser');
const campgrounds = [
  {alt: "Fiery Nights", name: "Salmon Creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Light a fire and relax with some friends on this camping experience."},
  {alt: "Multi Hued Camping", name: "Social Camping", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Colorfully selected tents and wonderful company abound on this camping experience."},
  {alt: "Starry sky camping", name: "Astronomy View", image: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Ever wanted to be a part of the Universe?  This experience is GALACTIC!"},
  {alt: "Camping During the Day", name: "Day Camping", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Break free from convention!  Explore your inner rebel!"},
];

//telling express to serve files in 'public'
app.use(express.static("public"));
app.use(express.static("views/imgs"));
app.use(bodyParser.urlencoded([{extended: true}]));

//allows you to omit .ejs for every file
app.set('view engine', 'ejs');

app.listen(3000, function(){
  console.log("Starting Yelp Camp Server...");
});

app.get('/', function(req, res){
  res.render('landing');
});

app.get('/campgrounds', function(req, res){
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req,res) =>{
  console.log(req.body)
  const name = req.body.name;
  const image = req.body.image;
  const newObj = {name:name, image:image};
  campgrounds.push(newObj);
  res.redirect('campgrounds');
});

app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs')
});

app.get('*', function(req, res) {
  res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});


