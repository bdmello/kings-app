angular.module('kings-app.auth', ['kings-app.providers'])
.controller('loginCtrl', [
  '$scope',
  'dataService',
  'menu',
  '$state',
  'alertService',
  'utilsService',
  'appCache',
  function($scope, dataService, menus, $state, Alert, Utils, appCache) {
    $scope.loaderStatus = false;

    //If user is present redirect to dashboard
    _initUser();
    
    $scope.signIn = function (user) {
      $scope.loaderStatus = true;
      dataService.signIn({
          user: {
            email:$scope.email,
            password: $scope.password
          }
        })
        .success(function(data, status, headers, config) {
          navigateToList();
          $scope.loaderStatus = false;
        })
        .error(function(data, status, headers, config) {
          $scope.loaderStatus = false;
          Alert.notify({
            title: data.error_message,
            content: Utils.parseError(data),
            type: 'error'
          });
        });
    }

    function _initUser(){
      $scope.loaderStatus = true;
      dataService.getUser()
      .then(function(user){
        appCache.put('user',user.data.user);
        navigateToList();
      }, function(error){
        $scope.loaderStatus = false;
      })
    }

   function navigateToList(){
      $state.go("base.dashboard.objectsList", {
        classUid : menus[0].id,
        p : 1
      });
    }
}])
.controller('resetCtrl',[
  '$scope',
  '$state',
  'dataService',
  'alertService',
  'utilsService',
  function($scope, $state, dataService, Alert, Utils){
    $scope.credentials = {
      password : "",
      password_confirmation : ""
    };
    $scope.token = $state.params.token || undefined;
    $scope.loaderStatus = false;
    $scope.appUser = $state.current.data.appUser;
    
    $scope.retrievePassword = function(userDetail){
      $scope.loaderStatus = true;
      dataService.retrievePassword({
        body :{
          user : userDetail
        }
      })
      .success(function(data, status, headers, config) {
          $scope.loaderStatus = false;
          Alert.notify({
            title: data.notice,
            content: 'Success',
            type: 'success'
          });
        }).
        error(function(data, status, headers, config) {
          $scope.loaderStatus = false;
          Alert.notify({
            title: "Password reset failed",
            content: data.error_message,
            type: 'error'
          });
        });
    }

    $scope.resetPassword = function(credentials){
      if(lengthValidation(credentials)){
        $scope.loaderStatus = true;
        credentials.reset_password_token = $scope.token;

        if($scope.appUser){
          var resetPromise = dataService.resetAppUserPassword({
            body :{
              application_user :credentials
            }
          });
        }else{
          var resetPromise = dataService.resetPassword({
            body :{
              user :credentials
            }
          });
        }
        resetPromise
        .success(function(data, status, headers, config) {
            //Clears form
            $scope.credentials.password = '';
            $scope.credentials.password_confirmation = '';
            
            $scope.loaderStatus = false;
            Alert.notify({
              title: data.notice,
              content: 'Success',
              type: 'success'
            });
          })
        .error(function(data, status, headers, config) {
            $scope.loaderStatus = false;
            Alert.notify({
              title: "Password reset failed",
              content: data.error_message,
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
])
.controller('userActivationCtrl', [
  '$scope',
  '$state',
  'dataService',
  'alertService',
  function ($scope, $state, dataService, Alert){
    $scope.loader = true;
    dataService.activateAppUser({
      options : {
        userUid : $state.params.user_uid,
        activationToken : $state.params.activation_token
      }
    })
    .success(function (data, status, headers, config){
      $scope.activationStatus = true;
      $scope.loader = false;
      Alert.notify({
        title: data.notice,
        content: 'Success',
        type: 'success'
      });
    })
    .error(function (data, status, headers, config){
      $scope.activationStatus = false;
      $scope.loader = false;
      Alert.notify({
        title: "User activation failed",
        content: data.error_message,
        type: 'error'
      });
    })
}])