angular.module('kings-app.auth', ['kings-app.utils'])
.controller('loginCtrl', [
  '$scope',
  '$location',
  '$http',
  'builtApi',
  'menu',
  '$state',
  'alertService',
  'utilsService',
  function($scope, $location, $http, builtApi, menus, $state, Alert, Utils) {
    builtApi.getUser()
    .then(function(user){
      navigateToList();
    }, function(){

    })
    
    $scope.signIn = function (user) {
      builtApi.signIn({
          user: {
            email:$scope.email,
            password: $scope.password
          }
        })
        .success(function(data, status, headers, config) {
          navigateToList()
        })
        .error(function(data, status, headers, config) {
          Alert.notify({
            title: data.error_message,
            content: Utils.parseError(data),
            type: 'error'
          });
        });
    }

   function navigateToList(){
      $state.go("base.dashboard.objectsList", {
        classUid : menus[0].id
      });
    }

}])
.controller('resetCtrl',[
  '$scope',
  '$state',
  'builtApi',
  '$timeout',
  'alertService',
  'utilsService',
  function($scope, $state, builtApi, $timeout, Alert, Utils){
    $scope.credentials = {
      password : "",
      password_confirmation : ""
    }
    $scope.authtoken = $state.params.authtoken || undefined;
    $scope.retrievePassword = function(userDetail){
      builtApi.retrievePassword({
        body :{
          user : userDetail
        }
      })
      .success(function(data, status, headers, config) {
          Alert.notify({
            title: data.notice,
            content: 'Success',
            type: 'success'
          });
        }).
        error(function(data, status, headers, config) {
          Alert.notify({
            title: data.error_message,
            content: Utils.parseError(data),
            type: 'error'
          });
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }

    $scope.resetPassword = function(credentials){
      if(lengthValidation(credentials)){
        credentials.reset_password_token = $scope.authtoken
        builtApi.resetPassword({
          body :{
            user :credentials
          }
        })
        .success(function(data, status, headers, config) {
            Alert.notify({
              title: data.notice,
              content: 'Success',
              type: 'success'
            });
          })
        .error(function(data, status, headers, config) {
            Alert.notify({
              title: data.error_message,
              content: Utils.parseError(data),
              type: 'error'
            });            
          });
      }else{
        Alert.notify({
          title: "Invalid length",
          content: "The password should be equal to aleast 8 characters",
          type: 'error'
        });            
      }
    }

    function lengthValidation(data){
      return (data.password.length >= 8 && data.password_confirmation.length >= 8) 
    }
  }
]);