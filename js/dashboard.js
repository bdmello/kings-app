angular.module('dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  'Utils',
  'user',
  function($scope, $q, $location, $http, builtApi, menus, $state, utils, user){
    $scope.$emit('user', user);
    console.log("$state", $state);
    $scope.menus = menus;

    $scope.selectedClassId = null;
    //set class id
    utils.sa($scope, function() {
      $scope.selectedClassId = $state.params.class_uid;
    });
}]);