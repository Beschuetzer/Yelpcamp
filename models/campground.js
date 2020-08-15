const mongoose = require('mongoose');

//creating a schema for each objecct
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  alt: String,
});

//creating the campgrounds collection in the db 'yelpCamp'
const Campground = mongoose.model("Campground", campgroundSchema);

//Like a return for the file
module.exports = Campground;

// campgrounds = [
//   {alt: "Fiery Nights", name: "Salmon Creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Light a fire and relax with some friends on this camping experience."},
//   {alt: "Multi Hued Camping", name: "Social Camping", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Colorfully selected tents and wonderful company abound on this camping experience."},
//   {alt: "Starry sky camping", name: "Astronomy View", image: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Ever wanted to be a part of the Universe?  This experience is GALACTIC!"},
//   {alt: "Camping During the Day", name: "Day Camping", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Break free from convention!  Explore your inner rebel!"},
// ];
