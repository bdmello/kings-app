angular.module('objects',[])
	.controller('objectCreateCtrl',[
		'$scope',
		'currentClass',
		'user',
		function($scope, currentClass, user){
			console.log('mclass',currentClass.data.class);
			console.log('authtoken', user.data.user.authtoken);
		}]);