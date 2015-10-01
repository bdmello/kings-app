angular.module('auth', ['kings-app.utils'])
.controller('loginCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  function($scope, $location, $http, builtApi, menus, $state) {
    
    builtApi.getUser()
    .then(function(user){
      navigateToList();
    }, function(){

    })
    
    $scope.signIn = function () {
      builtApi.signIn({
          user: {
            email:$scope.email,
            password: $scope.password
          }
        })
        .success(function(data, status, headers, config) {
          navigateToList()
        }).
        error(function(data, status, headers, config) {
          alert("Ops validation failed")
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }

   function navigateToList(){
      $state.go("base.dashboard.objectsList", {
        classUid : menus[0].id
      });
    }

}])
.controller('resetCtrl',[
  '$scope',
  '$state',
  'builtApi',
  '$timeout',
  function($scope, $state, builtApi, $timeout){
    $scope.credentials = {
      password : "",
      password_confirmation : ""
    }
    $scope.authtoken = $state.params.authtoken || undefined;
    $scope.retrievePassword = function(){
      builtApi.retrievePassword({
        body :{
          user :{
            email : $scope.email
          }
        }
      })
      .success(function(data, status, headers, config) {
          console.log("data", data)
          alert("Please check your mailbox!!");
        }).
        error(function(data, status, headers, config) {
          alert("Ops! not a valid user");
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }

    $scope.resetPassword = function(credentials){
      console.log("$scope.password_confirmation", credentials)
      credentials.reset_password_token = $scope.authtoken
      builtApi.resetPassword({
        body :{
          user :credentials
        }
      })
      .success(function(data, status, headers, config) {
          $state.go("base.login", {});
        }).
        error(function(data, status, headers, config) {
          alert("Invalid");
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
  }
]);