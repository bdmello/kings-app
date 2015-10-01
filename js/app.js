var kingsapp = angular.module('kingsapp', [
    'ui.router',
    'ui.bootstrap.modal',
    'auth',
    'dashboard',
    'list'
    ]);

kingsapp.config(['$stateProvider', '$urlRouterProvider', 'builtApiProvider', function($stateProvider, $urlRouterProvider, builtApiProvider) {
    $urlRouterProvider
        .otherwise('/dashboard')
        .when('', '/login')
        .when('/', '/login');

    $stateProvider
    .state('base', {
      //resolve:appResolvers(),
      controller: 'baseCtrl',
      templateUrl: '/partials/base.html'
    })
    .state('base.login', {
      url: "/login",
      templateUrl: '/partials/login.html',
      controller: 'loginCtrl'
    })
    .state('base.login-retrieve-password', {
      url: "/user/retrieve-password",
      templateUrl: '/partials/resetPassword.html',
      controller: 'resetCtrl'
    })
    .state('base.login-reset-password', {
      url: "/user/reset_password_submit/:authtoken",
      templateUrl: '/partials/resetPassword.html',
      controller: 'resetCtrl'
    })
    .state('base.dashboard', {
      url: "/dashboard",
      abstract:true,
      resolve:dashboardResolvers(),
      controller: 'dashboardCtrl',
      templateUrl: '/partials/dashboard.html'
    })
    .state('base.dashboard.objectsList', {
      url: "/:classUid",
      controller: 'listCtrl',
      //resolve: listResolvers(),
      templateUrl: '/partials/list.html'
    })
   

    builtApiProvider.setAppConfig({
        //url : "https://kings-backend.built.io/api",
        url:"http://localhost:3000",
        version:"/v1",
        api_key : "bltbfb51fc159335dd8"
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
          console.log("listResolvers resovler", builtApi)
          return builtApi.getObjects({
            options : {
              classUid : $stateParams.classUid
            }
          });
        }]
      }
    }
}]);

kingsapp.run([
  '$rootScope',
  '$location',
  '$state',
  function($rootScope, $location, $state) {
    $rootScope.$on( "$stateChangeError", function(event, next, current) {
       // $state.go('base.login');
    });
}]);



kingsapp.controller('newPlayerController', function($scope) {
    
    $scope.model = {};

    BuiltClass.getSchema()
    .then(function(schema){
        $sa($scope, function(){
            $scope.schema = schema;
        })
    });

    $scope.addTask = function(){
        var Player = BuiltClass.Object;
        var newPl = Player($scope.playerModel);
        console.log($scope.playerModel);
        /*newPl.save()
        .then(function(responseObj){
            console.log(responseObj);
        })*/
    }
});

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

kingsapp.directive('fieldDirective', function(){
    return{
        scope: {
            schema: '=',
            ngModel: '='
        },
        restrict: 'E',
        templateUrl: 'field.html',
        link: function(scope, el, attrs, ngModel) {
            console.log(scope.schema);
        }
    }
});

kingsapp.directive('groupDirective', function(){
    return{
        scope: {
            schema: '=schema',
            ngModel: '='
        },
        restrict: 'E',
        templateUrl: 'group.html',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = {};
            }
        }
    }
});

kingsapp.directive('multipleDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        templateUrl: 'multiple.html',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = [];
            }
        }
    }
});

kingsapp.directive('textDirective', function(){
    return{
        scope: {
            field: '=',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="text" class="form-control" ng-model="ngModel">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = '';
            }
        }
    }
});

kingsapp.directive('booleanDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="checkbox" class="form-control" ng-model="ngModel">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = "";
            }
        }
    }
});

kingsapp.directive('numberDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="number" class="form-control" ng-model="ngModel">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = "";
            }
        }
    }
});
kingsapp.directive('fileDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="file" class="form-control" ng-model="ngModel">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = "";
            }
        }
    }
});

kingsapp.directive('linkDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="text" class="form-control" ng-model="ngModel.title"> <input type="url" class="form-control" ng-model="ngModel.link">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = {
                    "title": "",
                    "link": ""
                }
            }
        }
    }
});

kingsapp.directive('dateDirective', function(){
    return{
        scope: {
            field: '=field',
            ngModel: '='
        },
        restrict: 'E',
        template: '<input type="date" class="form-control" ng-model="ngModel">',
        link: function(scope, el, attrs, ngModel) {
            if(scope.ngModel === undefined){
                scope.ngModel = "";
            }
        }
    }
});

