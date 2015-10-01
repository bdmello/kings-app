angular.module('login', ['kings-app.utils'])
.controller('loginCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  function($scope, $location, $http, builtApi, menus, $state) {
    

    if ($scope.user) {
        return $location.path('/');
    }
    $scope.signIn = function () {
      builtApi.signIn({
          user: {
            email:$scope.email,
            password: $scope.password
          }
        })
        .success(function(data, status, headers, config) {
          console.log(menus[0].id)
          $state.go("base.dashboard.objectsList", {
              classUid : menus[0].id
          })
          
        }).
        error(function(data, status, headers, config) {
          alert("Ops validation failed")
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

        // user.login($scope.email, $scope.password)
        //     .then(function (user) {
        //         $sa($scope, function () {
        //             $location.path("/");
        //             console.log(user.toJSON());
        //         })
        //     }, function (err) {
        //         console.log('Error', err);
        //     });
    }
}]);