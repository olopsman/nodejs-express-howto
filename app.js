const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
// Connect to db
mongoose.connect(config.database);
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

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages middleware
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req,res);
  next();
});

// Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Password Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

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

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start server
app.listen(3000, function() {
  console.log('server started on port 3000');
})
