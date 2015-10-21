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
  'currentClass',
  function($scope, $location, $http, dataService, Relay, Utils, $state, menus, currentClass) {

    //Send Relay to show addButton
    Relay.send('addButtonState', true);

    var classUid    = $state.params.classUid;
    var limit       = 50;
    var limitCount  = 0;
    var pagSelector = $('#js-pagination-select');

    $scope.pages          = [];
    $scope.skip           = parseInt($state.params.skip) || 0;
    $scope.searchText     = $state.params.filter || "";
    $scope.currentPage    = $state.params.p || 1;
    $scope.currentCount   = 0;
    $scope.loaderStatus   = false;
    $scope.limitReached   = false;
    $scope.totalCount     = 0;
    $scope.newLists       = [];
    $scope.actions        = ['edit', 'delete'];
    $scope.fetchComplete  = false;
    $scope.singletonClass = false;
    $scope.maxLimit       = 0;
    $scope.minLimit       = 0;

  /**
   * Testing for QueryBuilder
   */

    // Advanced search query
    var advancedSearchParams = undefined;
    var searchParamQuery     = $location.search().query;
    var viewQueryNow         = false;

    if(searchParamQuery){
      advancedSearchParams = JSON.parse(searchParamQuery);
      console.log('advancedSearchParams ' , advancedSearchParams);
    }

    $scope.currentClass      = currentClass.data.class;
    $scope.intermediateQuery = [];
    $scope.getQueryNow       = false;
    $scope.getQueryCallback  = function(getQuery){
      getQuery.then(function(res) {
        if (viewQueryNow) {
          console.log('viewQueryNow',viewQueryNow);
          $scope.viewableQuery = JSON.stringify(res);
          console.log('viewableQuery',$scope.viewableQuery);
        } else {
          advancedSearchParams = res;
          console.log('advancedSearchParams--> ' , advancedSearchParams);
          console.log('$scope', $scope);
          //getObjects();
          
          //Fetch Objects
          var params = {
            skip: $scope.skip,
            query: JSON.stringify(advancedSearchParams)
          };

          _initObjects(params);
        }
      }, function() {
        console.log("came in error callback");
      }).finally(function() {
        console.log("helllo");
        $scope.getQueryNow = false;
      });
    }

    $scope.viewQuery = function() {
      $scope.getQueryNow = true;
      viewQueryNow = true;
    };

    $scope.hideViewableQuery = function() {
      viewQueryNow         = false;
      $scope.viewableQuery = null;
    };

    $scope.toggleAdvanceSearch = function(){
      $scope.showAdvanceSearch = !$scope.showAdvanceSearch;
    }

    /*
      Execute Search Query
     */
    $scope.getAdvancedSearchQuery = function(){
      console.log('getAdvancedSearchQuery');
      $scope.getQueryNow = true;
    }

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

      if($scope.totalCount==$scope.maxLimit)
        return;
      
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
          //console.log('New List', $scope.newLists);
          $scope.totalCount -= 1;
          updatePageCounter();
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
          skip: 0,
          limit: limit, //default limit
          include_count: true,
          include_unpublished : true
        }
      };

      //Overide queryObject.params
      if(params){
        queryObject.params = _.merge(queryObject.params, params);
      }

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
          return;
        }else{
          /* Set newList */
          $scope.newLists = res.data.objects;
        }
        updatePageCounter();
        $scope.fetchComplete = true;
      }, function(){
        $scope.fetchComplete = true;
      });
    }

    // $scope.$watch('currentPage', function(){

    // })
    
    /* Update min-max counter in pagination controll */
    function updatePageCounter(){
      console.log('Udpate Page Counter');
      Utils.sa($scope, function(){
        $scope.currentCount = $scope.newLists.length;
        var maxLimit    = $scope.currentPage * limit;
        $scope.maxLimit = maxLimit;
        
        if(maxLimit > $scope.currentCount){
          $scope.maxLimit = (maxLimit - limit)+ $scope.currentCount;
        }
        
        $scope.minLimit = $scope.currentCount > 0 ? maxLimit - limit + 1 : 0;
        var pagesLength = Math.ceil($scope.totalCount/limit);
        for(var i=1;i<=pagesLength;i++){
          $scope.pages.push(i);
        }
        limitCount = limitCount + $scope.currentCount;
      });
    }

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