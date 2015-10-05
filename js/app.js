var kingsapp = angular.module('kingsapp', [
    'ui.router',
    'ui.bootstrap.modal',
     'kings-app.auth',
     'kings-app.dashboard',
     'kings-app.listView',
     'kings-app.objects',
     'formBuilder'
    ]);

/* Application cache */
kingsapp.factory('appCache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('app-cache');
}]);

kingsapp.config([
  '$stateProvider',
  '$urlRouterProvider',
  'dataServiceProvider',
 function($stateProvider, $urlRouterProvider, dataServiceProvider) {
    $urlRouterProvider
        .otherwise('/login')
        .when('', '/login')
        .when('/', '/login');

    $stateProvider
    .state('base', {
      controller: 'baseCtrl',
      templateUrl: 'partials/base.html'
    })
    .state('base.login', {
      url: "/login",
      templateUrl: 'partials/login.html',
      controller: 'loginCtrl'
    })
    .state('base.login-retrieve-password', {
      url: "/user/retrieve-password",
      templateUrl: 'partials/resetPassword.html',
      controller: 'resetCtrl',
      data: {}
    })
    .state('base.login-reset-password', {
      url: "/user/reset_password_submit/:token",
      templateUrl: 'partials/resetPassword.html',
      controller: 'resetCtrl',
      data: {}
    })
    .state('base.login-resetAppUser-password', {
      url: '/application/users/reset_password/:token',
      templateUrl: 'partials/resetPassword.html',
      controller: 'resetCtrl',
      data: {
        appUser: true
      }
    })
    .state('base.dashboard', {
      url: "/dashboard",
      abstract:true,
      resolve:dashboardResolvers(),
      controller: 'dashboardCtrl',
      templateUrl: 'partials/dashboard.html'
    })
    .state('base.dashboard.objectsList', {
      url: "/:classUid?p&skip",
      controller: 'listCtrl',
      //resolve: listResolvers(),
      templateUrl: 'partials/list.html'
    })
    .state('base.dashboard.objectsList-create',{
      url: "/:classUid/create",
      resolve: classSchemaResolvers(),
      controller: 'objectCreateCtrl',
      templateUrl: '/partials/objects.html'
    })
    .state('base.dashboard.objectsList-edit',{
      url: "/:classUid/objects/:objectUid/edit",
      resolve: {
        currentClass : classSchemaResolvers().currentClass,
        currentObject : objectResolver().currentObject
      },
      controller: 'objectEditCtrl',
      templateUrl: '/partials/objects.html'
    })
   
    
    dataServiceProvider.setAppConfig({
        // apihost:"https://kings-backend.built.io/v1",
        // url : "https://kings-backend.built.io",
        apihost:'http://code-bltdev.cloudthis.com/v1',
        url:window.location.protocol+'//'+ window.location.host,
        version:"/v1",
        api_key : "bltbfb51fc159335dd8"
    })

    function dashboardResolvers(){
      return {
        user : [
        'dataService',
        'appCache',
        function(dataService, appCache){
          dataService.setHeader({
            application_api_key : dataService.getAppConfig().api_key
          })
          return appCache.get('user') || dataService.getUser();
        }]
      }
    }

    function listResolvers(){
      return {
         objects: [
        'dataService',
        '$stateParams',
        function(dataService, $stateParams){
          return dataService.getObjects({
            options : {
              classUid : $stateParams.classUid
            }
          });
        }]
      }
    }

    function classSchemaResolvers(){
      return {
        currentClass:[
        'dataService',
        '$stateParams',
        function(dataService, $stateParams){
          return dataService.getClassSchema({
            options : {
              classUid : $stateParams.classUid
            }
          });
        }]
      }
    }


    function objectResolver(){
      console.log('Object Resolver');
      return {
        currentObject:[
          'dataService',
          '$stateParams',
          function(dataService, $stateParams){
            return dataService.getCurrentObject({
              options : {
                classUid : $stateParams.classUid,
                objectUid : $stateParams.objectUid
              }
            })
          }
        ]
      }
    }

}]);

kingsapp.run([
  'relayService',
  '$state',
  '$rootScope',
  '$timeout',
  function(Relay, $state, $rootScope, $timeout){
    //extend Angular's scope allowing you to remove listeners
    Relay.extendRootScope();

    $rootScope.$on('$viewContentLoading', function(event, viewConfig){ 
      if(viewConfig.view.self.name === 'base.dashboard.objectsList'){
        $timeout(function() {
          Relay.send('show-add-button', true);      
        }, 100);
        console.log("asdas")
      }else{
        Relay.send('show-add-button', false);      
      }
    });

}])
      
kingsapp.controller('baseCtrl', [
    '$scope',
    '$state',
    'dataService',
    '$rootScope',
    'relayService',
    function($scope, $state, dataService, $rootScope, Relay) {
    $scope.loggedIn = false;
    $scope.loaderStatus = false;
    $scope.showAddButton =false;

    Relay.onRecieve('user', function(e, data){
      if(data){
        $scope.loggedIn = true;            
        $scope.loaderStatus = false;          
      }else{
        $scope.showAddButton =false;
      }
    });
    
    Relay.onRecieve('show-add-button', function(e, data){
      console.log("asdasdsa")
        $scope.showAddButton =data;
    });

    $scope.createObject = function(){
      Relay.send('create-object');
    }

    $scope.signOut = function(){
      $scope.loaderStatus = true;
      dataService.signOut()
      .then(function(){
        $scope.loggedIn = false;
        $state.go('base.login', {
        });
      })
      .finally(function(){
        $scope.loaderStatus = false;          
      })
    }
}]);
