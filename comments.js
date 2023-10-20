// Create web server
const express = require('express');
const app = express();

// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up database
const db = require('./db');
const dbName = 'commentDB';
const collectionName = 'comments';

// Create routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// GET all comments
app.get('/comments', (req, res) => {
  db.initialize(dbName, collectionName, function(dbCollection) {
    dbCollection.find().toArray((error, result) => {
      if (error) throw error;
      res.json(result);
    });
  });
});

// POST a comment
app.post('/comments', (req, res) => {
  db.initialize(dbName, collectionName, function(dbCollection) {
    const comment = { name: req.body.name, comment: req.body.comment };
    dbCollection.insertOne(comment, (error, result) => {
      if (error) throw error;
      res.redirect('/');
    });
  });
});

// PUT a comment
app.put('/comments/:name', (req, res) => {
  db.initialize(dbName, collectionName, function(dbCollection) {
    const name = req.params.name;
    const comment = req.body.comment;
    dbCollection.updateOne(
      { name: name },
      { $set: { comment: comment } },
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  });
});

// DELETE a comment
app.delete('/comments/:name', (req, res) => {
  db.initialize(dbName, collectionName, function(dbCollection) {
    const name = req.params.name;
    dbCollection.deleteOne({ name: name }, (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});