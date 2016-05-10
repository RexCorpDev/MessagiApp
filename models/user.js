'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var ObjectId = mongoose.Schema.Types.ObjectId;

const JWT_SECRET = process.env.JWT_SECRET;
console.log('SECRET\n', JWT_SECRET);


var userSchema = new mongoose.Schema({
  name            :   { first: String, last: String},
  username        :   { type: String,  unique: true},
  password        :   { type: String },
  image           :   { type: String },
  about           :   { type: String },
  posts           :   [{ date: Date, post: String}],
  github          :   String, // Github user _id#
  facebook        :   String, // Facebook user _id#
  twitter         :   String, // Twitter user _id#
});


userSchema.statics.isLoggedIn = function(req, res, next){
  console.log('req.cookies=\n',req.cookies.accessToken);
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({ error: 'You are not authorized!'});
    console.log('payload', payload);
    User
    .findById(payload._id)
    .select({ password: false })
    .exec((err, user) => {
      if(err || !user){
        return res
        .clearCookie('accessToken')
        .status(400)
        .send(err || {error: 'User not found.'});
      }

        req.user = user;
        next();

    });
  });
};

userSchema.statics.register = function( userObj, cb ) {
  // create new user
  console.log(userObj);
  this.create(userObj, cb);
};

userSchema.statics.login = function( userObj, cb ){
  User.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {error: 'Login failed. Username or Password Incorrect!'});

    if( dbUser.password != userObj.password ){
      return cb(err || {error: 'Login failed. Username or Password is Incorrect'});
    }

    var token = dbUser.createToken(userObj);
    dbUser.password = null;
    cb(null, {token:token, dbUser:dbUser});
  });
}

userSchema.methods.createToken = function(){
  var token = jwt.sign({ _id: this._id }, JWT_SECRET);
  console.log('token\n', token);
  return token;
}

var User = mongoose.model('User', userSchema);
// console.log('@user.js => ', JSON.stringify(User, 2, null));
module.exports = User;
