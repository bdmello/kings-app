var demoApp = angular.module('demoApp', ['ngRoute','ui.bootstrap.modal']);

var BuiltApp = Built.App('blt048c8a90ce89909a');
var BuiltClass = BuiltApp.Class('players');

demoApp.config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            controller: 'loginController',
            templateUrl: 'login.html'
        })
        .when('/new', {
            controller: 'newPlayerController',
            templateUrl: 'new-player.html'
        })
        .when('/', {
            controller: 'listPlayers',
            templateUrl: 'app.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

demoApp.run( function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if ( $rootScope.loggedIn == false ) {
            if ( next.templateUrl == "login.html" ) {
                console.log(next.templateUrl);
                $location.path( "/login" );

            } else {
                $location.path( "/" );
                console.log(next.templateUrl);
            }
        }
    });

});


demoApp.controller('loginController', function($scope, $location) {
    if ($scope.user) {
        return $location.path('/');
    }
    $scope.signIn = function () {
        var user = BuiltApp.User();
        user.login($scope.email, $scope.password)
            .then(function (user) {
                $sa($scope, function () {
                    $location.path("/");
                    console.log(user.toJSON());
                })
            }, function (err) {
                console.log('Error', err);
            });
    }
});

demoApp.controller('newPlayerController', function($scope) {
    $scope.newLists = [];
    $scope.newPlayer = {};
    BuiltClass.getSchema()
        .then(function(schema){
            $scope.playerSchema = schema;
            $scope.$apply()
        });

    $scope.addTask = function(player){
        console.log(player)
        var Player = BuiltClass.Object;
        var newPl = Player(player);

        newPl.save()
            .then(function(responseObj){
                $sa($scope, function(){
                    $scope.newLists.push(responseObj);
                    console.log($scope.player)
                    $scope.newPlayer = {};
                    $scope.$apply()
                })
            })
    }
});

demoApp.controller('listPlayers', function($scope, $q, $location){

    var deferred = $q.defer();
    var query = BuiltClass.Query();

    query.toJSON().exec()
        .then(function(objects){
            $scope.newLists = objects;
            deferred.resolve(objects);
            return deferred.promise;
        },function(err){
            deferred.reject(err);
            return deferred.promise;
        });

    $scope.newPlayer = function(){
        $sa($scope, function(){
            $location.path('/new');
        })
    }

    $scope.delete = function(){
        $scope.showModal = true;
    }
    $scope.close = function(){
        $scope.showModal = false;
    }
    $scope.ok = function(player){
        /*var del = BuiltClass.Object(player);
        del.delete().then(function(){
            console.log('object deleted successfully');
        })*/
        $scope.showModal = false;
    }

    $scope.edit = function(){

    }

});

function $sa(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}
