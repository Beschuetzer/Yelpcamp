const mongoose = require('mongoose');

//creating a schema for each objecct
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  alt: String,
  price: {
    value: {type: String, default: "N/A"},
    currency: {type: String, default: "$"},
    // name: {type: String, default: ""},
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

//creating the campgrounds collection in the db 'yelpCamp'
const Campground = mongoose.model("Campground", campgroundSchema);

//Like a return for the file
module.exports = Campground;