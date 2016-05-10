var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
  });
});

//   /api/users/register
router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token) => {
    if(err) return res.status(400).send(err);

    res.cookie('accessToken', token).send(token);
  });
});

router.delete('/logout', (req, res) => {
  res.clearCookie('accessToken').send();
});

// /api/users/profile
router.get('/profile', User.isLoggedIn, (req, res) => {
  res.send(req.user);
});

router.get('/posts', (req, res) => {
  User.find({}, (err, users) => {
    if(err) return res.status(400).send({ message : 'Cannot retrieve users.'});

    var allPosts = {
      posts : [{
        date      : '',
        post      : '',
        id        : '',
        username  : ''
      }]
    };

    users.forEach(user => {
      allPosts.posts['date'] = user.posts.date;
      allPosts.posts['post'] = user.posts.post;
      allPosts.posts['id'] = user._id;
      allPosts.posts['username'] = user.username;

      res.send(allPosts);
    });
  });
})

router.post('/post/:id', (req, res) => {
  // console.log('newPost req.body=>\n', req.body);
  User.findById(req.params.id, (err, dbUser) => {
    if(err) return res.status(400).send({ message: 'Cannot post message!'});

    var obj = {
      post: req.body.post,
      date: Date.now()
    }

    dbUser.posts.unshift(obj);
    // console.log(dbUser.posts);

    var newPost = {
      id        : dbUser._id,
      date      : dbUser.posts[0].date,
      username  : dbUser.username,
      post      : dbUser.posts[0].post
    };
    dbUser.save((err, savedPost) => {
      // console.log('user\n', savedPost.posts[0]);
      res.send(savedPost.posts[0]);
    });
  })
})


module.exports = router;



/////// - CRUD Reference

// router.route('profile/:id')
// .get((req, res) => {
//   User
//   .findById(req.params.id)
//   .populate('property')
//   .exec(res.handle)
// })

// .delete((req, res) => {
//   User
//   .findByIdAndRemove(req.params.id)
//   .exec(res.handle)
// })
// .put((req, res) => {
//   User
//   .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true})
//   .exec(res.handle)
// });
//
// router.put('/:client/buy/:property', (req, res) => {
//   User.moveIn(req.params.client, req.params.property, res.handle);
// });
//
// router.put('/:client/sell/:property', (req, res) => {
//   User.moveOut(req.params.client, req.params.property, res.handle);
// });

// router.get('/:id', (req, res) => {
//   Client.findById(req.params.id, (err, client) =>{
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(client);
//     }
//   });
// });

// router.delete('/:id', (req, res) => {
//   Client.findByIdAndRemove(req.params.id, err => {
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send("Deleted!");
//     }
//   });
// });
//
// router.put('/:id', (req, res) => {
//   console.log('reqBody =>\n', req.body);
//   Client.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, (err, client) => {
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(client);
//     }
//   });
// });

// router.post('/', (req, res) => {
//   console.log('sendThisClient\n',req.body);
//   Client.create(req.body, (err, savedClient)=>{
//     if(err){
//       res.status(404).send(err);
//     } else {
//       console.log("Saved the Client!");
//       res.send(savedClient);
//     }
//   });
// });

// router.get('/:category', (req, res) => {
//   console.log(req.params.category);
//   Client.find(req.params.category, (err, client) =>{
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(client);
//     }
//   });
// });
