angular.module('objects',[])
  .controller('objectCreateCtrl',[
    '$scope',
    'currentClass',
    'user',
    'builtApi',
    '$state',
    function($scope, currentClass, user, builtApi,$state){
      
      var classUid = $state.params.classUid;

      /* Default `mobject` structure required for formBuilder */
      var defaultMObject = {
        published: true,
        __loc: null
      };

      /* Attributes required for formBuilder */
      $scope.mclass=currentClass.data.class;
      $scope.mobject=defaultMObject;
      $scope.authtoken=user.data.user.authtoken;
      $scope.apikey=builtApi.getAppConfig().api_key;
      $scope.apihost=builtApi.getAppConfig().apihost;

      /* Create Object */
      $scope.createObject = function(){
        builtApi.createObject({
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
          $state.go('base.dashboard.objectsList', $state.params);
        })
        .error(function(data, status, headers, config){
          alert('Some Erorr')
        });
      }
    }])
  .controller('objectEditCtrl', [
    '$scope',
    '$state',
    function($scope, $state){
    console.log('Edit Ctrl', $state.params);
  }])