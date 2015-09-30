angular.module('dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'builtApi',
  'menu',
  function($scope, $q, $location, $http, builtApi, menus){
    $scope.menus = menus;
    console.log("builtApi", builtApi);

    $scope.signOut = function(){
      console.log('Hey!');
    }
}]);