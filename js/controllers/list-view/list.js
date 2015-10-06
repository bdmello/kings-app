angular.module('kings-app.listView', ['kings-app.providers'])
.controller('listCtrl', [
  '$scope',
  '$location',
  '$http',
  'dataService',
  'relayService',
  'utilsService',
  '$state',
  'menu',
  function($scope, $location, $http, dataService, Relay, Utils, $state, menus) {
    var classUid = $state.params.classUid;

    var limit = 2;
    var limitCount = 0;
    var pagSelector = $('#js-pagination-select');

    $scope.pages = [];
    $scope.skip = parseInt($state.params.skip) || 0;
    $scope.searchText = $state.params.filter || "";
    $scope.currentPage = $state.params.p || 1;
    $scope.currentCount = 0;
    $scope.loaderStatus = false;
    $scope.limitReached = false;
    $scope.totalCount = 0;
    $scope.newLists = [];
    $scope.actions = ['edit', 'delete'];
    $scope.fetchComplete = false;
    $scope.singletonClass = false;
    $scope.columnData = menus.filter(function(menu){
      if(menu.id === classUid){
        /* Check for singleton Class*/
        if(menu.singleton){
          $scope.singletonClass = true;
        }
        return menu;
      }
    })[0].columns;

    //init objects in list    
    _initObjects({
      skip : $scope.skip
    });


    $scope.action = function(act, data){
      if(act === 'edit')
        goToEditState(data);
      if(act === 'delete')
        deleteData(data);
      return;
    }

    $scope.nxtList = function(){
     
      if($scope.skip >= $scope.totalCount){
      $scope.limitReached = true
        return;
      }

      $scope.skip = $scope.skip+limit;
      ++$scope.currentPage;
    
      $location.search({
        p : $scope.currentPage,
        skip : $scope.skip
      });
    }



    $scope.prevList = function(){
      if($scope.currentPage === 1)
        return;


      --$scope.currentPage;
      $scope.skip = $scope.skip-limit;
       $location.search({
        p : $scope.currentPage,
        skip : $scope.skip
      });
    }

    Relay.onRecieve('search-entity', function(e, data){
      Utils.sa($scope, function(){
       $location.search({
          p : 1,
          skip : 0,
          filter: data
        });
      })  
    });
    function goToEditState(data){
      var data = {
        classUid: $state.params.classUid,
        objectUid: data.uid,
        p: 1,
        skip: 0,
        filter: ''
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
      
      var queryObject = {
        options : {
          classUid : classUid
        },
        params : {
          skip: params.skip,
          limit: limit,
          include_count: true,
          include_unpublished : true
        }
      };

      if($scope.searchText){
        queryObject.params.typeahead = $scope.searchText;
      }

      dataService.getObjects(queryObject).then(function(res){
        $scope.totalCount = res.data.count;

        /* redirect if class is singleton */
        if($scope.singletonClass && res.data.objects.length){
          $state.go('base.dashboard.objectsList-edit', {
            classUid : classUid,
            objectUid : res.data.objects[0].uid
          })
        }
        
        /* Set newList */
        $scope.newLists = res.data.objects;
        $scope.currentCount = res.data.objects.length;
        $scope.fetchComplete = true;
        var pagesLength = Math.ceil($scope.totalCount/limit);
        for(var i=1;i<=pagesLength;i++){
          $scope.pages.push(i);
        }
        limitCount = limitCount + $scope.currentCount;
      }, function(){
        $scope.fetchComplete = true;
      });
    }

    // $scope.$watch('currentPage', function(){

    // })

    (function(){
      pagSelector.on('change', function() {
        $scope.currentPage = parseInt(this.value);
        Utils.sa($scope, function(){
          $location.search({
            p : $scope.currentPage,
            skip : ($scope.currentPage - 1) * limit
          });
        })
      })
    })()
  }
]);