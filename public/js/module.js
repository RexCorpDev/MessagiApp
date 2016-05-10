'use strict';

var app = angular.module('messagi', [ 'ui.bootstrap', 'ui.router', 'oitozero.ngSweetAlert', 'satellizer']);



app.config(function($stateProvider, $urlRouterProvider, $authProvider){
  $authProvider.github({
    clientId: '708b98639fbc913e8c0d'
  })

  // $authProvider.twitter({
  //   clientId: 'cu84rlZVRJi8b4tbTdj6gIXSh'
  // })
  //
  // $authProvider.facebook({
  //   clientId: '1544497505856182'
  // })

  $stateProvider
  .state('home', {
    url           : '/home' ,
    templateUrl   : 'html/home.html' ,
    controller    : 'homeCtrl'
  })
  .state('login', {
    url           : '/login',
    templateUrl   : 'html/sign-up.html',
    controller    : 'loginCtrl'
  })
  .state('sign-up', {
    url           : '/sign-up',
    templateUrl   : 'html/sign-up.html',
    controller    : 'sign-upCtrl'
  })
  .state('profile', {
    url           : '/profile',
    templateUrl   : 'html/profile.html',
    controller    : 'homeCtrl',
    resolve       : {
      profile: function(User, $q, $state){
        return User.getProfile()
        .catch(() => {
          $state.go('home');
          return $q.reject();
        });
      }
    }
  })

  $urlRouterProvider.otherwise('/');
});

app.filter('titlecase', function() {
  return function(input) {
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  };
});

// .state('editProperties', {
//   url           : '/editProperties/:id' ,
//   templateUrl   : 'html/editProperties.html' ,
//   controller    : 'editPropertiesCtrl',
//   resolve       : {
//     property : function(Property, $stateParams){
//
//       return Property.getPropertyById($stateParams)
//     }
//   }
// })


; // END OF .state(s)
