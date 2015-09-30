angular.module('dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  function($scope, $q, $location){
    $scope.signOut = function(){
      console.log('Hey!');
    }
}]);