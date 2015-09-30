angular.module('login', ['kings-app.utils'])
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
            })
        }
}]);