angular.module('kings-app.objects',[])
	.controller('objectCreateCtrl',[
		'$scope',
		'currentClass',
		'user',
		'builtApi',
		function($scope, currentClass, user, builtApi){
			console.log('mclass',currentClass.data.class);
			console.log('authtoken', user.data.user.authtoken);
			console.log('api_key', builtApi.getAppConfig().api_key);
			console.log('api_host', builtApi.getAppConfig().apihost);
		}]);