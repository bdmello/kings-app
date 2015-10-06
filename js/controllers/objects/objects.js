angular.module('kings-app.objects',[])
  .controller('objectCreateCtrl',[
    '$scope',
    'currentClass',
    'user',
    'dataService',
    '$state',
    'alertService',
    'utilsService',
    function($scope, currentClass, user, dataService, $state, Alert, Utils){

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
          
          console.log('Data', data)
          console.log('Status', status);

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
    function($scope, $state, user, currentClass, currentObject, dataService, Alert, Utils, menus){

      /* Data Required for formBuilder */
      $scope.mclass     = currentClass.data.class;
      $scope.authtoken  = user.authtoken;
      $scope.apikey     = dataService.getAppConfig().api_key;
      $scope.apihost    = dataService.getAppConfig().apihost;
      $scope.mobject    = currentObject.data.object;
      $scope.singleton  = false;

      var objectUid = $scope.mobject.uid;
      var classUid  = $state.params.classUid;

      //Check for singleton class
      menus.forEach(function(menu){
        if(menu.id === classUid && menu.singleton){
          $scope.singleton = true;
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

          console.log('Utils', Utils);
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