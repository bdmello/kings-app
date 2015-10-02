angular.module('kings-app.objects',[])
	.controller('objectCreateCtrl',[
		'$scope',
		'currentClass',
		'user',
		'dataService',
		function($scope, currentClass, user, dataService){
			console.log('mclass',currentClass.data.class);
			console.log('authtoken', user.data.user.authtoken);
			console.log('api_key', dataService.getAppConfig().api_key);
			console.log('api_host', dataService.getAppConfig().apihost);
		}]);