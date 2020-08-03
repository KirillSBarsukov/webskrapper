const router = require('express').Router();

// Our resource routes
(require('./routes/pages'))(router);
(require('./routes/products'))(router);

module.exports = router;
