angular.module('kings-app.objects',[])
  .controller('objectCreateCtrl',[
    '$scope',
    'currentClass',
    'user',
    'dataService',
    '$state',
    'alertService',
    'utilsService',
    'relayService',
    function($scope, currentClass, user, dataService, $state, Alert, Utils, Relay){

      //Send Relay to hide addButton
      Relay.send('addButtonState', false);

      //Get classUid
      var classUid = $state.params.classUid;

      //Default `mobject` required for formBuilder
      var defaultMObject = {
       published: true,
       __loc: null
      };
      
      $scope.mclass     = currentClass.data.class;
      $scope.authtoken  = user.authtoken;
      $scope.apikey     = dataService.getAppConfig().api_key;
      $scope.apihost    = dataService.getAppConfig().apihost;
      $scope.mobject    = defaultMObject;

      /* Save new object */
      $scope.saveObject = function(){
        dataService.createObject({
          options:{
            classUid:classUid,
          },
          body:{
            class_uid:classUid,
            app_api_key:$scope.apikey,
            object:$scope.mobject
          }
        })
        .success(function(data, status, headers, config){
          Alert.notify({
            title: data.notice,
            content: 'Success',
            type: 'success'
          });
          NavigateState();
        })
        .error(function(data, status, headers, config){
          
          Alert.notify({
            title: data.error_message,
            content: Utils.parseError(data),
            type: 'error'
          });

          NavigateState();
        });
      }

      /* Cancel - move to previous state */
      $scope.cancel = function(){
        gotoPreviousState($state);
      }

      function NavigateState(){
        $state.go('base.dashboard.objectsList', {
          p : 1,
          skip: 0,
          filter:"",
          classUid : classUid
        });
      }

      /* Goto Previous State */
      function gotoPreviousState(){
        $state.go('base.dashboard.objectsList', {
          p : $state.params.p,
          skip: $state.params.skip,
          filter:$state.params.filter,
          classUid : classUid
        });
      }
  }])
  .controller('objectEditCtrl',[
    '$scope',
    '$state',
    'user',
    'currentClass',
    'currentObject',
    'dataService',
    'alertService',
    'utilsService',
    'menu',
    'relayService',
    function($scope, $state, user, currentClass, currentObject, dataService, Alert, Utils, menus, Relay){

      //Send Relay to hide addButton
      Relay.send('addButtonState', false);

      /* Data Required for formBuilder */
      $scope.mclass     = currentClass.data.class;
      $scope.authtoken  = user.authtoken;
      $scope.apikey     = dataService.getAppConfig().api_key;
      $scope.apihost    = dataService.getAppConfig().apihost;
      $scope.mobject    = currentObject.data.object;
      $scope.singleton  = false;
      $scope.singletonTitle = "";

      var objectUid = $scope.mobject.uid;
      var classUid  = $state.params.classUid;

      //Check for singleton class
      menus.forEach(function(menu){
        if(menu.id === classUid && menu.singleton){
          $scope.singleton = true;
          $scope.singletonTitle = menu.singletonTitle;
        }
      })

      /* Save existing object */
      $scope.saveObject = function(){
        dataService.editObject({
          options:{
            classUid : classUid,
            objectUid : objectUid
          },
          body:{
            class_uid:classUid,
            app_api_key:$scope.apikey,
            object:$scope.mobject
          }
        })
        .success(function(data, status, headers, config){
          Alert.notify({
            title: data.notice,
            content: 'Success',
            type: 'success'
          });

          gotoPreviousState($state);
        })
        .error(function(data, status, headers, config){
          
          Alert.notify({
            title: data.error_message,
            content: Utils.parseError(data),
            type: 'error'
          });

          gotoPreviousState($state);
        });
      }

      /* Cancel - move to previous state */
      $scope.cancel = function(){
        gotoPreviousState($state);
      }

      /* Goto Previous State */
      function gotoPreviousState(state){
        state.go('base.dashboard.objectsList', state.params);
      }
    }
  ])