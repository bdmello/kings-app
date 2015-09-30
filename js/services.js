angular.module('kings-app.utils', [])
.service('Utils', [function(){
  this.sa = function(scope, fn) {
      if (fn)
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
      else {
        (scope.$$phase || scope.$root.$$phase) ? '' : scope.$apply();
      }
    }
}])
.constant('appConfig', {
  url : "https://kings-backend.built.io",
  version:"/v1"
})
