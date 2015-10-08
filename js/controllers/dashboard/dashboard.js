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
    var viewMenu = false;
    //set class id
    $scope.selectedClassId = $state.params.classUid;

    Relay.onRecieve('view-menu', function(e, data){
        viewMenu = !viewMenu;
        if(viewMenu){
          $('#nav-list').find('.aside').css('margin-left','0px');
          $('#nav-list').find('.main-container').css('margin-left','200px');
        }else{
          $('#nav-list').find('.aside').css('margin-left','-200px');
          $('#nav-list').find('.main-container').css('margin-left','0');
        }
    });

    Relay.onRecieve('set-menu', function(e, data){
      $scope.$apply(function(){
        $scope.selectedClassId = data.classUid;
      })
    })
}]);