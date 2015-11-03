angular.module('kings-app.dashboard', ['kings-app.providers'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  '$http',
  'dataService',
  'menu',
  '$state',
  'user',
  'relayService',
  'utilsService',
  function($scope, $q, $location, $http, dataService, menus, $state, user, Relay, Utils){
    //console.log('User--->', user);
    /* Set valid `user` object from get call or cache */
    var userdata = user.data && user.data.user || user;
    Relay.send('user', userdata);
    $scope.menus = menus;
    var viewMenu = false;
    //set class id
    $scope.selectedClassId = $state.params.classUid;
    console.log('selectedClassId', $scope.selectedClassId);

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
      console.log('Data', data);
      $scope.$apply(function(){
        $scope.selectedClassId = data.classUid;
      })
    });

    //Set addon menu
    Relay.onRecieve('set-addon-menu', function(e, data){
      console.log('addon-menu',data);
      Utils.sa($scope, function(){
        $scope.selectedClassId = data.menuId;
      })
    })
}]);