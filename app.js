const express = require('express');
const path = require('path');
// Init app
const app = express();

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', function(req, res){
  res.render('index', {
    title : 'Hello'
  });
});

// Add route
app.get('/articles/add', function(req, res) {
  res.render('add', {
    title : 'Add article'
  });
});

// Start server
app.listen(3000, function() {
  console.log('server started on port 3000');
})
