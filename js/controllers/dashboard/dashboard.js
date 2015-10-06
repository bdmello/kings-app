angular.module('kings-app.dashboard', ['kings-app.providers'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'dataService',
  'menu',
  '$state',
  //'Utils',
  'user',
  function($scope, $q, $location, $http, dataService, menus, $state, user){
    $scope.$emit('user', user);
    console.log("$state", $state);
    $scope.menus = menus;
    console.log('---Menus', menus);

    //set class id
    $scope.selectedClassId = $state.params.classUid;

}]);