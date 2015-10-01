angular.module('kings-app.listView', ['kings-app.utils'])
.controller('listCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  '$state',
  'menu',
  function($scope, $location, $http, builtApi, $state, menus) {
    //console.log($state.params);
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
      if(confirm("Are you sure you want to delete this object?")){
        builtApi.deleteObject({
          options :{
            classUid : classUid,
            objectsUid: data.uid
          }
        }).then(function(res){
          console.log("res");
          $scope.newLists.splice($scope.newLists.indexOf(data), 1);
        })
      }
      
    }

    //create new object
    $scope.changeToCreateState = function(){
      $state.go('base.dashboard.objectsList-create',$state.params);
    }

    builtApi.getObjects({
      options : {
        classUid : classUid
      }
    }).then(function(res){
      $scope.newLists = res.data.objects;
    })

  }
]);