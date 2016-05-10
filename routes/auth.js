'use strict';

var express = require('express');
var router = express.Router();
//var jwt = require('jasonwebtoken');
var request =  require('request');         // allows API calls within NODE.
var qs = require('querystring');                    // query string to parse accessToken.
var User = require('../models/user');      // String manipulator that makes query string from an object.


//auth

router.post('/github', (req, res) => {
  // console.log(req.body);

  // Step 1. Exchange authorization code for access token.

  var accessTokenUrl='https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var headers = {
    'User-Agent' : 'Satellizer'
  };

  var params={
    code          : req.body.code,
    client_id     : req.body.clientId,
    redirect_uri  : req.body.redirectUri,
    client_secret : process.env.GITHUB_SECRET
  };

  request.get({ url : accessTokenUrl, qs  : params}, (err, response, tokenBody) => {

    var accessToken = qs.parse(tokenBody);
    // console.log('aToken\n',accessToken);

    // Step 2. Retrieve profile information about the current user.

    request.get({url : userApiUrl, qs : accessToken,headers : headers,json : true}, (err, response, profile) => {
      if(err) return res.status(400).send({ message : 'User not found' });

      User.findOne({github: profile.id }, (err, existingUser) => {
        if(err) return res.status(400).send(err);

        // console.log('existingUser', existingUser);

        if(existingUser){
          var token = existingUser.createToken();
          res.send({ token : token , existingUser : existingUser});
          console.log('existingUser\n',existingUser);
        } else {
          var user = new User();
          user.github = profile.id;
          user.image = profile.avatar_url;
          user.username = profile.login;
          user.name.first = profile.name.split(' ').slice(0, 1);
          user.name.last = profile.name.split(' ').slice(1);

          user.save((err, savedUser) => {
            console.log('user\n', user);
            var token = savedUser.createToken();

            res.cookie('accessToken', data.token).send({token: token});
          });
        };
      });
    });
  });
});

module.exports = router;

// GITHUB access token
// { access_token: '93cd1882a99293f7d891645af533ce2e91f6a025',
// scope: 'user:email',
// token_type: 'bearer' }
//
// GITHUB Profile
// { login: 'RexCorpDev',
//   id: 16377119,
//   avatar_url: 'https://avatars.githubusercontent.com/u/16377119?v=3',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/RexCorpDev',
//   html_url: 'https://github.com/RexCorpDev',
//   followers_url: 'https://api.github.com/users/RexCorpDev/followers',
//   following_url: 'https://api.github.com/users/RexCorpDev/following{/other_user}',
//   gists_url: 'https://api.github.com/users/RexCorpDev/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/RexCorpDev/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/RexCorpDev/subscriptions',
//   organizations_url: 'https://api.github.com/users/RexCorpDev/orgs',
//   repos_url: 'https://api.github.com/users/RexCorpDev/repos',
//   events_url: 'https://api.github.com/users/RexCorpDev/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/RexCorpDev/received_events',
//   type: 'User',
//   site_admin: false,
//   name: 'Tobiah Rex',
//   company: null,
//   blog: null,
//   location: 'Japan',
//   email: null,
//   hireable: null,
//   bio: null,
//   public_repos: 23,
//   public_gists: 0,
//   followers: 1,
//   following: 1,
//   created_at: '2015-12-21T02:34:08Z',
//   updated_at: '2016-04-13T18:18:32Z' }

// FACEBOOK access token
