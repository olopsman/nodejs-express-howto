const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Body parser middleware
app.use(bodyParser.urlencoded({ extended : false}));
// parse application/json
app.use(bodyParser.json());

// Set static- public folder
app.use('/static', express.static('public'));

// Home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {
        title : 'Articles',
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

// get single article
app.get('/article/:id', function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('article', {
      article : article
    });
  });

});

// load edit form
app.get('/article/edit/:id', function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('edit-article', {
      title : "Edit Article",
      article : article
    });
  });
});


// Add Articles POST route
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

// Add Articles POST route
app.post('/article/edit/:id', function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/article/:id', function(req, res) {
  let query = {_id:req.params.id}

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
    }
    res.send('Success');
  })
});

// Start server
app.listen(3000, function() {
  console.log('server started on port 3000');
})
