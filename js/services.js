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
.provider('builtApi', [function(){
  //application config variable
  this.appConfig = {};

  var self    = this;  
  var  url    = self.appConfig.url+self.appConfig.version;
  var headers = {};

  this.$get = [function() {
    return {
      setHeader : function(headers){
        headers = headers;
      },
      signIn : function(credentials){
       return  $http.post(url+'/user_session', credentials);
      }
    };
  }];
  
}])
.constant('menu', [{
  id : "players",
  text : "Players"
},{
  id : "Coach",
  text : "Coaches"
},{
  id : "config",
  text : "Config"
},{
  id : "transportation",
  text: "Transportation"
},{
  text:"At The Game",
  id:"at_the_game"
},
{
  text:"Home Feeds",
  id:"home_feeds"
},
{
  text:"Ads",
  id:"ads"
}])
