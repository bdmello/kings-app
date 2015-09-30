angular.module('login', ['kings-app.utils'])
.controller('loginCtrl', [
  '$scope',
  '$location',
  '$http',
  'appConfig',
  function($scope, $location, $http, appConfig) {
    console.log("login controller")
    var url = appConfig.url+appConfig.version

    if ($scope.user) {
        return $location.path('/');
    }
    $scope.signIn = function () {
        $http.post(url+'/user_session', {
          user: {
            email:$scope.email,
            password: $scope.password
          }
        })
        .success(function(data, status, headers, config) {
          $location.path('/dashboard')
        }).
        error(function(data, status, headers, config) {
          alert("Ops validation failed")
          console.log("data, status, headers, config", data, status, headers, config);
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