'use strict';

var app = angular.module('messagi');

app.controller('mainCtrl', function($scope, $state, User){
  console.log('mainCtrl');
});

app.controller('homeCtrl', function($scope, $state, $auth, User){
  console.log('homeCtrl');

  // $scope.newPost = postBody => {
  //   var date = new Date();
  //   var dateString = date.toString();
  //   var date = dateString.split('').slice(0,15).join('');
  //   $scope.date = date;
  //   $scope.post = postBody;
  // }

  $scope.logout = () => {
    $auth.logout();
  }

  $scope.isAuthenticated = () => {
    console.log($auth.isAuthenticated());
    return $auth.isAuthenticated();
  }

  User.getPosts()
  .then(res => {
    console.log('POSTS\n', res.data.posts);
    $scope.posts = res.data.posts;
  });

  var hasLiked = false;

  $scope.toggleLike = function () {
    if (!hasLiked) {
      hasLiked = true;
      $scope.liked = 'Unlike';
      $scope.likeCount += 1;
    } else {
      hasLiked = false;
      $scope.liked = 'Like';
      $scope.likeCount -= 1;
    }
  };



});

app.controller('loginCtrl', function($scope, $state, $auth, User){
  console.log('loginCtrl');

  $scope.currentState = $state.current.name;

  $scope.authenticate = provider => {
    $auth.authenticate(provider);
    $state.go('home');
  };

  // $scope.verifyUser = (loginUsername, loginPassword) => {
  //   var userObj = {
  //     username : loginUsername,
  //     password : loginPassword
  //   }
  //
  //   User.login(userObj)
  //   .then(dbUser => {
  //     console.log(dbUser.data);
  //     if(dbUser){
  //       $state.go('profile', {user: `${dbUser.data.username}`, userInfo: dbUser.data});
  //     };
  //   });
  // };
});

app.controller('sign-upCtrl', function($scope, $state, $auth, User){
  console.log('sign-upCtrl');
  $scope.currentState = $state.current.name;

  $scope.authenticate = provider => {
    $auth.authenticate(provider);
    $state.go('home');
  };

  // $scope.createUser = () => {
  //
  //   var name = {
  //     first   :   $scope.name.first,
  //     last    :   $scope.name.last
  //   };
  //
  //   var newUser = {
  //     name      : name,
  //     username  : $scope.username,
  //     password  : $scope.password,
  //     image     : $scope.image,
  //     about     : $scope.about
  //   };

  //   User.create(newUser)
  //   .then(cb => {
  //     console.log(cb);
  //     newUser = {};
  //     $state.go('profile');
  //   });
  // };

  $scope.submitForm = () => {
    if($scope.currentState === 'sign-up'){
      //sign up user
      if($scope.user.password !== $scope.user.password2){
        $scope.user.password = '';
        $scope.user.password2 = '';
        alert('Passwords do not match. Try again!');
      } else {
        $auth.signup($scope.user)
        .then(res => {
          return $auth.login($scope.user);
        })
        .then(res => {
          $state.go('home');
        })
        .catch(err => {
          alert(res.data.error);
        });
      }
    } else { // login user
      $auth.login($scope.user)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        alert(res.data.error);
      });
    };
  };

});

app.controller('profileCtrl', function($scope, $state, User){
  console.log('profileCtrl');


});

app.controller('postsCtrl', function($scope, $state, $stateParams, User){
  console.log('postsCtrl');

  // $scope.$watch(function() {
  //   return User.currentUser;
  // }, function(newVal, oldVal) {
  //   $scope.currentUser = newVal;
  // });


  $scope.newPost = postBody => {

    User.getProfile()
      .then(res => {
        console.log(res.data);

        var Post = {
          _id   : '',
          post  : $scope.postBody
        }
        console.log(Post);
      })


    // User.newPost(Post)
    // .then(res => {
    //   console.log('POSTS\n', res.data.posts);
    // });
  };

});
