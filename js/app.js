var demoApp = angular.module('demoApp', [
    'ui.router',
    'ui.bootstrap.modal',
    'login',
    'dashboard',
    'list'
    ]);

demoApp.config(['$stateProvider', '$urlRouterProvider', 'builtApiProvider', function($stateProvider, $urlRouterProvider, builtApiProvider) {
    $urlRouterProvider
        .when('', '/login')
        .when('/', '/login');

    $stateProvider
    .state('app', {
      templateUrl: '/partials/app.html'
    })
    .state('app.login', {
      url: "/login",
      templateUrl: '/partials/login.html',
      controller: 'loginCtrl'
    })
    .state('app.dashboard', {
      url: "/dashboard",
      abstract:true,
      resolve:dashboardResolvers(),
      controller: 'dashboardCtrl',
      templateUrl: '/partials/dashboard.html'
    })
    .state('app.dashboard.classlist', {
      url: "/:classUid",
      controller: 'listCtrl',
      //resolve: listResolvers(),
      templateUrl: '/partials/list.html'
    })
   
    
    builtApiProvider.setAppConfig({
        //url : "https://kings-backend.built.io",
        url:window.location.protocol+'//'+ window.location.host,
        version:"/v1",
        api_key : "bltbfb51fc159335dd8"
    })

    function dashboardResolvers(){
      return {
        user : [
        'builtApi',
        function(builtApi){
          console.log("dashboarad resovler")
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

demoApp.run( function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if ( $rootScope.loggedIn == false ) {
            if ( next.templateUrl == "login.html" ) {
                $location.path( "/login" );

            } else {
                $location.path( "/" );
            }
        }
    });

});



demoApp.controller('newPlayerController', function($scope) {
    
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

demoApp.directive('fieldDirective', function(){
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

demoApp.directive('groupDirective', function(){
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

demoApp.directive('multipleDirective', function(){
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

demoApp.directive('textDirective', function(){
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

demoApp.directive('booleanDirective', function(){
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

demoApp.directive('numberDirective', function(){
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
demoApp.directive('fileDirective', function(){
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

demoApp.directive('linkDirective', function(){
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

demoApp.directive('dateDirective', function(){
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

