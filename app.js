//including partials: <%- include("partials/header") %>
const express = require('express');
const app = express();
const axios = require('axios');
//May not need the pkgs below here:
const bodyParser = require('body-parser');

//telling express to serve files in 'public'
app.use(express.static("public"));
app.use(bodyParser.urlencoded([{extended: true}]));

//allows you to omit .ejs for every file
app.set('view engine', 'ejs');

app.listen(3000, function(){
  console.log("Starting server...");
});

app.get('/', function(req, res){
  res.render('home');
});

app.get('*', function(req, res) {
  res.send(`Sorry, ${req.originalUrl} page not found...\nWhat are you doing with your life?`);
});
