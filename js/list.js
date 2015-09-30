angular.module('list', ['kings-app.utils'])
.controller('listCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  function($scope, $location, $http, builtApi) {
    console.log("list controller")
  }]);