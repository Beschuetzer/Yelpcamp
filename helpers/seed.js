const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require("../models/user");
const password = "test";
const faker = require('faker');

const users = [
    {username: "Homer", password: password},
    {username: "Tom", password: password},
    {username: "Adam", password: password},
    {username: "Jen", password: password},
    {username: "Jacqueline", password: password},
    {username: "Andrew", password: password},
]
  
const data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "10.00",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "8.00",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "3.75",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Salmon Creek",
        image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Light a fire and relax with some friends on this camping experience.",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "13",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Social Camping",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Colorfully selected tents and wonderful company abound on this camping experience.",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "12.00",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Astronomy View",
        image: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Ever wanted to be a part of the Universe? This experience is GALACTIC!",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "20.00",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Day Camping",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Break free from convention! Explore your inner rebel!",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "5",
            currency: "€",
            // name: "euro",
        } 
    },
    {
        name: "Star Fall bay",
        image: "https://images.pexels.com/photos/112378/pexels-photo-112378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Enter the unknown with no fear. This experience is truly like no other. Face your fears and look into the star fall. Make the most of the time you have left.",
        author: users[0 + Math.floor(Math.random() * (users.length - 1))],    // returns a random integer from 1 to 9];
        price: {
            value: "18",
            currency: "€",
            // name: "euro",
        } 
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



function createUsers() {
    let userObjs = [];
    
}

function main(){
    createUsers();
    seedDB();
}

function seedDB(){
    User.deleteMany({},(err)=>{
        if (err){
            console.log(err);
        }
        else {                    
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
                    users.forEach(user => {
                        User.register(new User({username: user.username, email: faker.internet.email()}), user.password, function(err, newUser){
                            if (err){
                                console.log(err);
                            }
                            else {
                                //add a few campgrounds
                                data.forEach(function(seed){ 
                                    Campground.create({
                                        author: {
                                            username: seed.author.username,
                                            id: newUser._id,
                                        },
                                        name: seed.name,
                                        image: seed.image,
                                        description: seed.description,
                                        price: seed.price,
                                    },
                                    function (err, campground){     // returns a random integer from 1 to 9], function(err, campground){
                                        if(err){
                                            console.log(err)
                                        } else {
                                            console.log("added a campground");
                                            //create a comment
                                            // console.log(users[0 + Math.floor(Math.random() * users.length)]);
                                            Comment.create(
                                            {
                                                text: "This place is great, but I wish there was internet",
                                                author: {
                                                    id: "5f3c48ce229da09d4c688a98",
                                                    username: "homer",
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
                            }
                        });
                    }); 
                    //add a few comments
                });
            });  
        }
    });
 }

 module.exports = seedDB;