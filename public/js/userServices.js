'use strict';

var app = angular.module('messagi');

app.service('User', function($http, $q) {

  this.register = userObj => {
    return $http.post('/api/users/register', userObj);
  };

  this.login = userObj => {
    return $http.post('/api/users/login', userObj)
    .then(res => {
      return this.getProfile();
    });
  };

  this.logout = () => {
    return $http.delete('/api/users/logout')
    .then(res => {
      this.currentUser = null;
      return $q.resolve();
    });
  };

  this.getProfile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      this.currentUser = res.data;
      return $q.resolve(res.data);
    })
    .catch(res => {
      this.currentUser = null;
      return $q.reject(res.data);
    });
  };

  this.getPosts = () => {
    return $http.get('/api/users/posts')
  };
});



// this.recordPost = newPost => {
//   return $http.post('/api/users/profile/', newPost)
//   .then(res => {
//     this.currentUser.posts.push(res.data);
//   })
// }

// for Delete account page
// this.deleteUser = id => {
//   console.log("Delete this:\n", id);
//   return $http.delete(`/api/users/${id}`);
// };
//
// // for Edit ~ everything else
//   this.editUser = editedUser => {
//     console.log("Edit this:\n",editedUser);
//     return $http.put(`/api/users/${editedUser._id}`, editedCard);
//   }
