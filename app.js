//#region Setting up Packages and Mongoose
const express = require('express'),
      app = express(),
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
      seedDB = require('./helpers/seed'),
      indexRoutes = require('./routes/index'),
      commentRoutes = require('./routes/comments'),
      paymentRoutes = require('./routes/payments'),
      flash = require('connect-flash'),
      campgroundRoutes = require('./routes/campgrounds');

require('dotenv').config();
console.log('PROCCESS.ENV.mongoDBPassword predicted: someValue; actual =', process.env.mongoDBPassword);


// try {
//   mongoose.connect('mongodb+srv://admin:PROCESS.ENV.mongoDBPassword@yelpcamp.3trbv.mongodb.net/YelpCamp?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   console.log('Connected to yelpCamp!')

// } catch (error) {
//   console.log(error.message)
// }

// mongoose.connect('mongodb+srv://admin:PROCESS.ENV.mongoDBPassword@yelpcamp.3trbv.mongodb.net/YelpCamp?retryWrites=true&w=majority', {
mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to yelpCamp!')
  
})
.catch(error => console.log(error.message));
  seedDB();
mongoose.set('useFindAndModify', false);

//#endregion
//#region Configuring Express
//telling express to serve files in 'public'
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

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

//Storing req.user (where the session user info is stored) in the local scope of all routes (all templates can access); currentUser is 'undefined' if not logged in
app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

//importing router routes from '/router
app.use("/campgrounds/:campgroundId/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(paymentRoutes);
app.use(indexRoutes);  //TODO: this must come last for routes as it has * route

//allows you to omit .ejs for every file
app.set('view engine', 'ejs');

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Starting Yelp Camp Server...");
});
//#endregion

//TODO: find a way to go to the last page when logging in
