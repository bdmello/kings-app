angular.module('kings-app.listView', ['kings-app.providers'])
.controller('listCtrl', [
  '$scope',
  '$location',
  '$http',
  'dataService',
  'relayService',
  '$state',
  'menu',
  function($scope, $location, $http, dataService, Relay, $state, menus) {
    var classUid = $state.params.classUid;
    var limit = 2;
    var skip = parseInt($state.params.skip) || 0;
    var limitCount = 0;

    $scope.currentPage = $state.params.p || 1;
    $scope.currentCount = 0;
    $scope.loaderStatus = false;
    $scope.limitReached = false;
    $scope.totalCount = 0;
    $scope.newLists = [];
    $scope.actions = ['edit', 'delete'];
    $scope.columnData = menus.filter(function(menu){
      if(menu.id === classUid)
        return menu;
    })[0].columns;

    //init objects in list    
    _initObjects({
      skip : skip
    });


    $scope.action = function(act, data){
      if(act === 'edit')
        goToEditState(data);
      if(act === 'delete')
        deleteData(data);
      return;
    }

    $scope.nxtList = function(){
     
      if(skip >= $scope.totalCount){
      $scope.limitReached = true
        return;
      }

      skip = skip+limit;
      ++$scope.currentPage;
    
      $location.search({
        p : $scope.currentPage,
        skip : skip
      });
    }

    $scope.prevList = function(){
      if($scope.currentPage === 1)
        return;


      --$scope.currentPage;
      skip = skip-limit;
      console.log("skip", skip, $scope.currentPage)
       $location.search({
        p : $scope.currentPage,
        skip : skip
      });
    }

    function goToEditState(data){
      console.log('data',data);
      console.log('stateparams',$state.params);
      var data = {
        classUid: $state.params.classUid,
        objectUid: data.uid
      }
      $state.go('base.dashboard.objectsList-edit', data);
    }

    function deleteData(data){
      if(confirm("Are you sure you want to delete this object?")){
        dataService.deleteObject({
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
    Relay.onRecieve('create-object', function(e, data){
      $scope.loaderStatus = true;
      $state.go('base.dashboard.objectsList-create',$state.params);        
    });

    function _initObjects(params){
      
      dataService.getObjects({
        options : {
          classUid : classUid
        },
        params : {
          skip: params.skip,
          limit: limit,
          include_count: true,
          include_unpublished : true
        }
      }).then(function(res){
        $scope.totalCount = res.data.count;
        $scope.newLists = res.data.objects;
        $scope.currentCount = res.data.objects.length;
        limitCount = limitCount + $scope.currentCount;
      });
    }

  }
]);