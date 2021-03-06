var kingsapp = angular.module('kingsapp', [
    'ui.router',
    'ui.bootstrap.modal',
     'kings-app.auth',
     'kings-app.dashboard',
     'kings-app.listView',
     'kings-app.objects',
     'formBuilder',
     'objectsQueryBuilder',
     'global-directives'
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
    .state('copyrights',{
      url:"/copyrights",
      templateUrl: 'partials/copyrights.html'
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
      url: '/application/users/reset/password/:token',
      templateUrl: 'partials/resetPassword.html',
      controller: 'resetCtrl',
      data: {
        appUser: true
      }
    })
    .state('base.activate-appUser',{
      url: '/application/users/:user_uid/activate/:activation_token',
      templateUrl: 'partials/userActivation.html',
      controller: 'userActivationCtrl'
    })
    .state('base.dashboard', {
      url: "/dashboard",
      abstract:true,
      resolve:dashboardResolvers(),
      controller: 'dashboardCtrl',
      templateUrl: 'partials/dashboard.html'
    })
    .state('base.dashboard.objectsList', {
      url: "/:classUid?p&skip&filter",
      controller: 'listCtrl',
      //resolve: listResolvers(),
      resolve: classSchemaResolvers(),
      templateUrl: 'partials/list.html'
    })
    .state('base.dashboard.objectsList-create',{
      url: "/:classUid/create?p&skip&filter",
      resolve: classSchemaResolvers(),
      controller: 'objectCreateCtrl',
      templateUrl: '/partials/objects.html'
    })
    .state('base.dashboard.objectsList-edit',{
      url: "/:classUid/objects/:objectUid/edit?p&skip&filter",
      resolve: {
        currentClass : classSchemaResolvers().currentClass,
        currentObject : objectResolver().currentObject
      },
      controller: 'objectEditCtrl',
      templateUrl: '/partials/objects.html'
    })
   
    /**
     * App Config Enviornment
     */
    
    var appEnv = {
      prod : {
        apihost : "https://kings-backend.built.io/v1",
        url     : "https://kings-backend.built.io",
        version : "/v1",
        api_key : "blt72c50188711c48b3"
      },

      dev : {
        apihost : "http://code-bltdev.cloudthis.com/v1",
        url     : "http://code-bltdev.cloudthis.com",
        version : "/v1",
        api_key : "blt72c50188711c48b3"
      },

      local : {
        apihost : window.location.protocol+'//'+ window.location.host+'/v1',
        url     : window.location.protocol+'//'+ window.location.host,
        version : "/v1",
        api_key : "bltbfb51fc159335dd8" //DEV
        //api_key : "blt72c50188711c48b3" //PROD
      },
    }

    /* Set App Env */
    dataServiceProvider.setAppConfig(appEnv.local);

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

    $rootScope.$on('$stateChangeSuccess', function(){
      if($state.is('base.dashboard.objectsList')){
        $timeout(function() {
          Relay.send('set-menu', $state.params);      
        }, 100);
      }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
       if(error.data && error.data.error_code){
        $state.go('base.login') 
       }
    });
}])
      
kingsapp.controller('baseCtrl', [
    '$scope',
    '$state',
    'dataService',
    '$rootScope',
    'relayService',
    'libraryService',
    '$injector',
    'utilsService',
    function($scope, $state, dataService, $rootScope, Relay, LIB, $injector, Utils) {
    $scope.loggedIn = false;
    $scope.loaderStatus = false;
    $scope.showAddButton =false;

    
    Relay.onRecieve('user', function(e, userdata){
      if(userdata){
        //console.log('----> Received User', userdata);
        $scope.user = userdata;
        $scope.loggedIn = true;            
        $scope.loaderStatus = false;
        $scope.showAddButton = $scope.loggedIn;          
      }else{
        $scope.loggedIn = false;            
        $scope.showAddButton =false;
      }
    });

    //Listen and hide add button
    Relay.onRecieve('addButtonState', function(e, data){
      Utils.sa($scope, function(){
        $scope.showAddButton = data;
      })
    });
    

    $scope.viewMenu = function(){
      Relay.send('view-menu');
    }

    $scope.createObject = function(){
      console.log('Create Object Clicked')
      Relay.send('create-object');
    }

    $scope.gotoHome = function(){
      $state.go('base.dashboard.objectsList', {
        classUid : 'players'
      });
    }

    $scope.signOut = function(){
      $scope.loaderStatus = true;
      dataService.signOut()
      .then(function(){
        $scope.loggedIn = false;
        $scope.showAddButton =false;
        $state.go('base.login', {
        });
      })
      .finally(function(){
        $scope.loaderStatus = false;          
      })
    }

    var goForMap = false;

    function getMap() {
      dataService.getMap("").then(function(MapStatus) {
        goForMap = MapStatus;
        LIB.register('googleMaps');
      });
    }getMap();
}]);
