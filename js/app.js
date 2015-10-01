var kingsapp = angular.module('kingsapp', [
    'ui.router',
    'ui.bootstrap.modal',
     'kings-app.auth',
     'kings-app.dashboard',
     'kings-app.listView',
     'kings-app.objects',
     'formBuilder'
    ]);

kingsapp.config(['$stateProvider', '$urlRouterProvider', 'builtApiProvider', function($stateProvider, $urlRouterProvider, builtApiProvider) {
    $urlRouterProvider
        .otherwise('/dashboard')
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
      controller: 'resetCtrl'
    })
    .state('base.login-reset-password', {
      url: "/user/reset_password_submit/:authtoken",
      templateUrl: 'partials/resetPassword.html',
      controller: 'resetCtrl'
    })
    .state('base.dashboard', {
      url: "/dashboard",
      abstract:true,
      resolve:dashboardResolvers(),
      controller: 'dashboardCtrl',
      templateUrl: 'partials/dashboard.html'
    })
    .state('base.dashboard.objectsList', {
      url: "/:classUid",
      controller: 'listCtrl',
      resolve: listResolvers(),
      templateUrl: 'partials/list.html'
    })
    .state('base.dashboard.objectsList-create',{
      url: "/:classUid/create",
      resolve: classSchemaResolvers(),
      controller: 'objectCreateCtrl',
      template: '<div class="main-container"><b>Create<b></div>'
    })
   
    
    builtApiProvider.setAppConfig({
        // apihost:"https://kings-backend.built.io/v1",
        // url : "https://kings-backend.built.io",
        apihost:'http://code-bltdev.cloudthis.com/v1',
        url:window.location.protocol+'//'+ window.location.host,
        version:"/v1",
        api_key : "blt33459dc7590dd663"
    })

    function dashboardResolvers(){
      return {
        user : [
        'builtApi',
        function(builtApi){
          builtApi.setHeader({
            application_api_key : builtApi.getAppConfig().api_key
          })
          return builtApi.getUser();
        }]
      }
    }

    function listResolvers(){
      return {
         objects: [
        'builtApi',
        '$stateParams',
        function(builtApi, $stateParams){
          return builtApi.getObjects({
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
        'builtApi',
        '$stateParams',
        function(builtApi, $stateParams){
          return builtApi.getClassSchema({
            options : {
              classUid : $stateParams.classUid
            }
          });
        }]
      }
    }
}]);

kingsapp.controller('baseCtrl', [
    '$scope',
    '$state',
    'builtApi',
    '$rootScope',
    function($scope, $state, builtApi, $rootScope) {
    $scope.loggedIn = false;

    $rootScope.$on('user', function(e, data){
        if(data.data.user){
            $scope.loggedIn = true;            
        }
    });
    
    $scope.signOut = function(){
      builtApi.signOut()
      .then(function(){
        $scope.loggedIn = false;
        $state.go('base.login', {
          
        });
      })
    }
}]);
