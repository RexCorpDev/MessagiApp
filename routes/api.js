'use strict';

var express = require('express');
var router = express.Router();

// router.use('/properties', require('./properties'));
// router.use('/clients', require('./clients'));
router.use('/users', require('./users'));

module.exports = router;
