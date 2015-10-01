angular.module('kings-app.dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  //'Utils',
  'user',
  function($scope, $q, $location, $http, builtApi, menus, $state, user){
    $scope.$emit('user', user);
    console.log("$state", $state);
    $scope.menus = menus;

    //set class id
    //utils.sa($scope, function() {
      $scope.selectedClassId = $state.params.classUid;
    //});
}]);