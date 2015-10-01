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
  var appConfig = {};
  var headers = {};
  var self    = this;  
  var url =  "";
  
  self.setAppConfig = function(config){
    appConfig = config;
    url    = appConfig.url+appConfig.version;
  }


  self.$get = [
  '$http',
  function($http) {
    return {
      getAppConfig: function(){
        return appConfig;
      },
      setHeader : function(header){
        headers = header;
      },
      signIn : function(credentials){
       return  $http.post(url+'/user_session', credentials);
      },
      signOut : function(){
        return  $http.delete(url+'/user_session', {});
      },
      getUser : function(){
       return  $http.get(url+'/user'); 
      },
      getObjects: function(args){
        var objectUrl = url+'/classes/'+args.options.classUid+'/objects';
        return $http.get(objectUrl, {
                 headers : headers
                }); 
      },
      getCurrentObject: function(args){
        console.log('args current object',args);
        var objectUrl = url+'/classes/'+args.options.classUid+'/objects/'+args.options.objectUid;
        return $http.get(objectUrl, {
          headers : headers
        })
      },
      retrievePassword : function(credentials){
        return  $http.post(url+'/user/forgot_password', credentials.body, {
          headers : headers
        });
      },
      resetPassword : function(credentials){
        return  $http.post(url+'/user/reset_password_submit', credentials.body, {
          headers : headers
        });
      },
      editObject: function(args){

      },
      deleteObject: function(args){
        var objectUrl = url+'/classes/'+args.options.classUid+'/objects/'+args.options.objectsUid;
        console.log("headers", headers);
        return $http({
          url : objectUrl,
          method:"DELETE",
          headers : headers,
          data : ""
        });
      },
      createObject: function(args){
        var createObjectUrl = url+'/classes/'+args.options.classUid+'/objects';
        console.log('createObject', args);
        return $http.post(createObjectUrl, args.body, {
          headers : headers
        })
      },
      getClassSchema: function(args){
        var classesUrl = url+'/classes/'+args.options.classUid;
        return $http.get(classesUrl, {
          headers : headers
        })
      }
    };
  }];
  
}])
.constant('menu', [{
  id : "players",
  text : "Players",
  columns : [{
    name : "Player ID",
    id : "pid"
  },{
    name:"First Name",
    id: "fn"
  },{
    name:"Last Name",
    id: "ln"
  },{
    name:"Player Position",
    id: "pos"
  }]
},{
  id : "coach",
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
