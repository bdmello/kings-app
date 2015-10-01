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
  function($scope, $q, $location, $http, builtApi, menus, $state, utils){
    console.log("$state", $state);
    $scope.menus = menus;

    //set class id
    utils.sa($scope, function() {
      $scope.selectedClassId = $state.params.classUid;
    });

    $scope.signOut = function(){
      console.log('Hey!');
    }

}]);