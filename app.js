const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('Connection to mongo db');
});

// Check for db errors
db.on('error', function(err) {
  console.log(err);
});
// Init app
const app = express();

// Bring in models
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', function(req, res){
/*  let articles = [
    {
      id:1,
      title:"Article One",
      author: "Padma Orquillo",
      body:"This is article one"
    },
    {
      id:2,
      title:"Article Two",
      author: "Amber Orquillo",
      body:"This is article two"
    },
    {
      id:3,
      title:"Article three",
      author: "Pauline Orquillo",
      body:"This is article three"
    },
    {
      id:3,
      title:"Article four",
      author: "Penny Orquillo",
      body:"This is article four"
    }
  ];
*/
  Article.find({}, function(err, articles) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {
        title : 'Hello',
        articles: articles
      });
    }
  });

});

// Add route
app.get('/articles/add', function(req, res) {
  res.render('add_articles', {
    title : 'Add article'
  });
});

// Start server
app.listen(3000, function() {
  console.log('server started on port 3000');
})
