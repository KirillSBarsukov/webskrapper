const express = require('express');
const app = express();
require('dotenv').config();

// Mongo access
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
  auth: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).catch(err => console.error(`Error: ${err}`));


// Set our views directory
app.set('view engine', 'ejs');
app.use('/css', express.static('assets/css'));

// Our routes
const routes = require('./routes.js');
app.use('/', routes);

// Start our server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
