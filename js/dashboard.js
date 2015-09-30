angular.module('dashboard', ['kings-app.utils'])
.controller('dashboardCtrl', [
  '$scope',
  '$q',
  '$location',
  function($scope, $q, $location){

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

}]);