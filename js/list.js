angular.module('list', ['kings-app.utils'])
.controller('listCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  '$state',
  'menu',
  function($scope, $location, $http, builtApi, $state, menus) {
    var classUid = $state.params.classUid;
    $scope.newLists = [];
    $scope.actions = ['edit', 'delete']
    $scope.columnData = menus.filter(function(menu){
      if(menu.id === classUid)
        return menu;
    })[0].columns;


    $scope.action = function(act, data){
      console.log("act, data", act, data)
      if(act === 'edit')
        editData(data);
      if(act === 'delete')
        deleteData(data);
        return;
    }

    function editData(data){
      console.log('data',data)
    }

    function deleteData(data){
      builtApi.deleteObject(data)
      console.log('delete',data)
      console.log('classUid',classUid)
    }

    builtApi.getObjects({
      options : {
        classUid : classUid
      }
    }).then(function(res){
      $scope.newLists = res.data.objects;
      console.log("res", res)
    })

  }]);