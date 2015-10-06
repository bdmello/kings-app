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
  'relayService',
  function($scope, $q, $location, $http, dataService, menus, $state, user, Relay){
    $scope.$emit('user', user);
    $scope.menus = menus;
    //set class id
    $scope.selectedClassId = $state.params.classUid;

    Relay.onRecieve('set-menu', function(e, data){
      $scope.$apply(function(){
        $scope.selectedClassId = data.classUid;
      })
    })
}]);