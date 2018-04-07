const express = require('express');
const router = express.Router();

// Bring in article models
let Article = require('../models/article');

// get single article
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('article', {
      article : article
    });
  });
});

// load edit form
router.get('/edit/:id', function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('edit-article', {
      title : "Edit Article",
      article : article
    });
  });
});


// Add Articles POST route
router.post('/add', function(req, res) {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // get errors
  let errors = req.validationErrors();
  if(errors) {
    res.render('add_articles', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});

// Add Articles POST route
router.post('/edit/:id', function(req, res) {
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
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req, res) {
  let query = {_id:req.params.id}

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
    }
    res.send('Success');
  })
});

module.exports = router;
