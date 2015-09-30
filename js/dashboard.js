angular.module('dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  function($scope, $q, $location, $http, builtApi, menus, $state){
    console.log("$state", $state);
    var selectedClassId = $state.params.class_uid;
    $scope.menus = menus;
    console.log("builtApi", builtApi);

    $scope.signOut = function(){
      console.log('Hey!');
    }

}]);