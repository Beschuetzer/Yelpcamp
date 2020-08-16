//#region Setting up Packages and Mongoose
const express = require('express'),
      app = express(),
      axios = require('axios'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      expressSanitizer = require('express-sanitizer'),
      methodOverride = require('method-override'),
      passport = require('passport'),   		//only if doing authentication
      localStrategy = require('passport-local'), 		//only if doing authentication
      dbName = "yelpCamp",
      Comment = require('./models/comment.js'),
      User = require('./models/user')
      Campground = require('./models/campground.js'),
      seedDB = require('./seed.js');

mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to yelpCamp!')
  seedDB();
  
})
.catch(error => console.log(error.message));
//#endregion
//#region Configuring Express
//telling express to serve files in 'public'
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//below used only for authentication
app.use(require('express-session')({
	secret: "JFIENCJWI@K#!)#AMLKdoenKJefndnw93uKSDKSLPQKdzz7d52q39kdsf",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());           //encodes User class/model and puts into session
passport.deserializeUser(User.deserializeUser());       //decodes User class/model and removes from session

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
//#region Campground Routes
const campgroundsRoute = '/campgrounds',
      campgroundsRender = 'campgrounds/';
app.get(campgroundsRoute, function(req, res){
  //finding all entries in collection
  //first parameter is the condition (use {} for whole collection)
  Campground.find({}, (err, returnedItem) => {
    if (err) {
      console.log("something went wrong finding");
    }
    else {
      res.render(campgroundsRender + 'index', {campgrounds: returnedItem});
    }
  });
});

app.post(campgroundsRoute, (req,res) =>{
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
        res.redirect(campgroundsRoute);
      }
    });
  }
  else {
    res.redirect(campgroundsRoute + '/new')
  }
});

app.get(campgroundsRoute + '/new', (req,res) => {
  res.render(campgroundsRender + 'new')
});

app.get(campgroundsRoute + '/:id', (req, res) =>{
  Campground.findById(req.params.id).populate('comments').exec(function(err,foundItem){
    if (err) {
      console.log("something went wrong finding ID route");
    }
    else {
      res.render(campgroundsRender + 'show', {campground: foundItem});
    }
  });
});

app.delete(campgroundsRoute + '/:id', function (req,res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if (err){
      console.log(err);
    }
  });
  res.redirect(campgroundsRoute)
});



app.get(campgroundsRoute + '/:id/edit', function (req, res){
  //Edit -- show edit form for one campgrounds
  Campground.findById(req.params.id, function (err, matchedItems) {
    if (err) {
      console.log("something went wrong finding ID");
      res.redirect('/');
    }
    else {
      res.render(campgroundsRender + 'edit', {campground: matchedItems})
    }
  });
});

app.put(campgroundsRoute + '/:id', function (req, res){
  //Update -- update a particular blogs
  req.body.campground.description = req.sanitize(req.body.campground.description)   //sanitize any inputs from 'new.ejs' that use <%-...%> in show.ejs or elsewhere
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedItem) {
    if (err) {
      console.log("something went wrong updating " + req.params.id);
      res.redirect(campgroundsRoute);
    }
    else {
      res.redirect(campgroundsRoute + '/' + req.params.id)
    }
  });
});

//#endregion
//#region Comments Routes
const commentsRoute = '/comments';
app.get(campgroundsRoute + '/:id' + commentsRoute + '/new', function(req,res){
  Campground.findById(req.params.id, (err, foundItem) =>{
    if (err){
      console.log(err);
    }
    else {
      res.render('.' + commentsRoute + "/new", {campground: foundItem});
    }
  });
});
app.post(campgroundsRoute + '/:id' + commentsRoute, function (req,res) {

  Comment.create({text: req.body.comment.text}, function(err, comment) {
    if (err){
      console.log(err);
    }
    else {
      Campground.findById(req.params.id, function (err, campground) {
        if (err){
          console.log(err);
        }
        else {
          campground.comments.push(comment);
          campground.save(function (err) {
            if (err){
              console.log(err);
            }
            else {
              console.log("Successfully added comment");
              res.redirect(campgroundsRoute + '/' + req.params.id)
            }
          });      
        }
      });
    }
  });
});
//#endregion
//#region Authentication Routes
app.get('/login', function(req,res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
}),function(req,res){
  //callback
});

app.get('/logout', function(req,res){
  req.logout();       //passport's logout()
  res.redirect('/campgrounds');
});

app.get('/register', (req,res) =>{
    //Show Signup Form
    res.render('register');
});

app.post('/register', (req,res) =>{
    //Signing up a New User
   //register(username, passwordToCreateHashFrom, callback)
   //THE USERNAME MUST BE NAMED EXACTLY 'username' IN THE NAME ATTR FOR THE SUBMITTING register.ejs FORM as well as the User model must have 'username' key
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render('register');
        }
        else {
            console.log("else start");
            passport.authenticate('local')(req, res, function(){		//'local' is the passport authentication strategy
              //Do something when authenticated
              console.log(user._id);              
            });
            res.redirect('/campgrounds');
        }
    });

    const userId = User.find({username: req.body.username});
    User.findByIdAndUpdate(userId, function (err, foundItem) {
      if (err){
        console.log("error");
        console.log(err);
      }
      else {
        console.log("embeded else");
        for (const key in req.body.userInfo) {
          if (object.hasOwnProperty(key)) {
            const value = object[key];
            foundItem.key = value;
          }
        }
        console.log(`foundItem: ${foundItem}`);
        foundItem.save();
      }
    });
});

//#endregion
app.get('*', function(req, res) {
  res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});
//#endregion

