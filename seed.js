const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const password = "test";


const homer = {username: "Homer", password: password};
const tom = {username: "Tom", password: password};
const data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: homer,
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: tom,
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: homer,
    },
    {
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Light a fire and relax with some friends on this camping experience.",
        author: tom,
    },
    {
        name: "Social Camping",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Colorfully selected tents and wonderful company abound on this camping experience.",
        author: homer,
    },
    {
        name: "Astronomy View",
        image: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Ever wanted to be a part of the Universe? This experience is GALACTIC!",
        author: tom,
    },
    {
        name: "Day Camping",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Break free from convention! Explore your inner rebel!",
        author: homer,
    },
    {
        name: "Star Fall bay",
        image: "https://images.pexels.com/photos/112378/pexels-photo-112378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Enter the unknown with no fear. This experience is truly like no other. Face your fears and look into the star fall. Make the most of the time you have left.",
        author: tom,
    },
]
// comments: [
//     {name: "Tom", text: "Man what an airy experience! 5 stars! :)"},
//     {name: "Jill", text: "I've never felt so light.  Thanks for a great time learning how to be one with the air."},
//     {name: "Bob", text: "The best of the desert.  Sand and sun!"},
//     {name: "Cynthia", text: "I wish I had taken more water..."},
//     {name: "Axle", text: "Not as floory as you might think."},
//     {name: "Rose", text: "Enjoyable but could have been more floor-like."},
//     {name: "Grizzly", text: "More salmon than you can eat!"},
//     {name: "Edgar", text: "Great place to bear watch and catch fish."},
//     {name: "Magdeline", text: "Never had more fun chatting with strangers in my life!"},
//     {name: "Agusto", text: "Some people didn't speak English well, but it was fun nonetheless"},
//     {name: "Max", text: "Got hit right in the face and survived!  Bring protection!"},
//     {name: "Elliot", text: "Not sure how this isn't illegal as it would be easy to die during this experience...    "},
//     {name: "Deckard", text: "Rigt up my alley.  The night life is great!"},
//     {name: "Hillard", text: "Not sure why I paid for this... could have just slept in my backyard..."},
//     {name: "Alice", text: "Not sure what the description is going on about, but the stars were epic!"},
//     {name: "John", text: "Liked the campsite but the universe was a bit menotonous"},
// ],

function seedDB(){
    let i = 0;
    User.deleteMany({}, function(err){
        if (err){
            console.log(err);
        }
        else {              
            User.register(new User({username: homer.username}), homer.password, function(err, homerUser){
                if (err){
                    console.log(err);
                }
                else {     
                    User.register(new User({username: tom.username}), tom.password, function(err, tomUser){
                        if (err){
                            console.log(err);
                        }
                        else {       
                            //Remove all campgrounds
                            Campground.deleteMany({}, function(err){
                                if (err){
                                    console.log(err);
                                }
                                console.log("removed campgrounds!");
                                Comment.deleteMany({}, function(err) {
                                    if (err){
                                        console.log(err);
                                    }
                                    console.log("removed comments!");
                                    //add a few campgrounds
                                    data.forEach(function(seed){ 
                                        i++;
                                        let seedAuthor = {};
                                        if (i % 2 === 0) {
                                            seedAuthor = {
                                                name: seed.name,
                                                image: seed.image,
                                                description: seed.description,
                                                alt: seed.alt,
                                                author: {
                                                    id: homerUser._id,
                                                    username: homerUser.username,
                                                }
                                            };
                                        }
                                        else {
                                            seedAuthor = {
                                                name: seed.name,
                                                image: seed.image,
                                                description: seed.description,
                                                alt: seed.alt,
                                                author: {
                                                    id: tomUser._id,
                                                    username: tomUser.username,
                                                }
                                            };
                                        }
                                        
                                        Campground.create(seedAuthor, function(err, campground){
                                            if(err){
                                                console.log(err)
                                            } else {
                                                console.log("added a campground");
                                                //create a comment
                                                Comment.create(
                                                {
                                                    text: "This place is great, but I wish there was internet",
                                                    author:{
                                                        id: seed.author._id,
                                                        username: seed.author.username,
                                                    }
                                                }, function(err, comment){
                                                    if(err){
                                                        console.log(err);
                                                    } else {
                                                        campground.comments.push(comment);
                                                        campground.save();
                                                        console.log("Created new comment");
                                                    }
                                                });
                                            }
                                        });
                                        
                                    });
                                })
                            }); 
                        }
                    });
                }
            });
        }
    })
    


    
     //add a few comments
 }

module.exports = seedDB;