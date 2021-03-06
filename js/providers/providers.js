angular.module('kings-app.providers', [])

.provider('dataService', [function(){
  //application config variable
  var appConfig = {};
  var headers = {};
  var self    = this;  
  var url =  "";
  var mapRetryCount = 0;

  self.setAppConfig = function(config){
    appConfig = config;
    url    = appConfig.url+appConfig.version;
  }

  self.$get = [
  '$http',
  '$q',
  function($http, $q) {
    var deferred = $q.defer();
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
                 headers : headers,
                 params : args.params
                }); 
      },
      getCurrentObject: function(args){
        //console.log('args current object',args);
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
      resetAppUserPassword: function(credentials){
        return  $http.post(url+'/application/users/forgot_password/reset_password', credentials.body, {
          headers : headers
        });
      },
      activateAppUser: function(args){
        var activationUrl = url+'/application/users/'+args.options.userUid+'/activate/'+args.options.activationToken; 
        return $http.get(activationUrl,{
          headers : headers
        });
      },
      deleteObject: function(args){
        var objectUrl = url+'/classes/'+args.options.classUid+'/objects/'+args.options.objectsUid;
        //console.log("headers", headers);
        return $http({
          url : objectUrl,
          method:"DELETE",
          headers : headers,
          data : ""
        });
      },
      createObject: function(args){
        var createObjectUrl = url+'/classes/'+args.options.classUid+'/objects';
        //console.log('createObject', args);
        return $http.post(createObjectUrl, args.body, {
          headers : headers
        })
      },
      editObject: function(args){
        var objectUrl = url+'/classes/'+args.options.classUid+'/objects/'+args.options.objectUid;
        return $http.put(objectUrl, args.body, {headers:headers});
      },
      getClassSchema: function(args){
        var classesUrl = url+'/classes/'+args.options.classUid;
        return $http.get(classesUrl, {
          headers : headers
        })
      },
      getMap : function(key) {
      //console.log("in get map", key)
      key = key || "";
      var mapScript = window.location.protocol + '//www.google.com/jsapi' + key;
      var xmlhttp = $.getScript(mapScript).done(function(script, textStatus) {
        //console.log("Google jsapi loaded");
        google.load("maps", "3", {
          other_params: 'sensor=false&libraries=drawing',
          callback: function() {
            deferred.resolve(true);
          }
        });
      }).fail(function(jqxhr, settings, exception) {
        //console.log("Google maps loading failed");
        if (mapRetryCount < 3) {
          //console.log("Retrying: " + mapRetryCount);
          this.getMap();
        } else {
          //console.log("No Go for map");
        }
        mapRetryCount++;
      });
      return deferred.promise;
    }
    };
  }];
  }
])
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
  text : "Coaches",
  columns: [{
    name : "Coach Name",
    id : "name"
  },{
    name : "Coach Type",
    id : "coach_type"
  },{
    name : "College",
    id : "college"
  }]
},{
  id : "config",
  text : "Config",
  singleton : true,
  singletonTitle : "Edit config settings",
  columns:[{
    name:"Uid",
    id: "uid"
  }]
},{
  id : "transportation",
  text: "Transportation",
  columns:[{
    name: "Uid",
    id: "uid"
  }]
},{
  text:"At The Game",
  id:"at_the_game",
  columns: [{
    name : "Uid",
    id : "uid"
  }]
},
{
  text:"Home Feeds",
  id:"home_feeds",
  columns : [{
    name: "Title",
    id: "title"
  },{
    name: "Author",
    id: "author"
  },{
    name: "Source",
    id: "source"
  }]
},
{
  text:"Ads",
  id:"ads",
  columns:[{
    name:"Image Url",
    id:"image_url"
  },{
    name:"Action Url",
    id:"action_url"
  },{
    name: "Track Analytic",
    id:"track_analytic"
  },{

  }]
}])
