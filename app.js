'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 4000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');

const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost/messagiApp';

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {

  res.handle = (err, data) => {
    res.status(err ? 400 : 200).send(err || data);
  };
  next();
});

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

mongoose.connect(MONGOURL, err => {
  console.log(err || `Connected to Mongo @ ${MONGOURL}`);
});

app.listen(PORT, err => {
  console.log(err || `Server listening on PORT ${PORT}`);
});

module.exports = router;
