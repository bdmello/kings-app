angular.module('kings-app.chat', ['kings-app.providers'])
	.controller('chatCtrl', [
		'$scope',
		'user',
		'$http',
    'relayService',
		function($scope, user, $http, Relay){
			
      console.log('USER-->', user);
      var userUID = user.uid || user.data.user.uid;
      console.log('userUID', userUID);

      //Send Relay to hide addButton
      Relay.send('addButtonState', false);

      //Set Menu
      Relay.send('set-addon-menu', {menuId : 'chat'});

			/*
				Init Frankly 
			*/      
      
      frankly.widgets.init({
        onAuthenticationRequest: function(nonce){
          return new Promise(function (resolve, reject) {
              /*
               * TODO: generate an identity token and pass it to resolve, or call
               * reject with an error.
               */
              $.ajax({
                method: "POST",
                url: "https://api.built.io/v1/functions/getFranklyTokenForWeb",
                headers : {
                  "Content-Type" : "application/json",
                  "application_api_key" : "blt2cad8218c8993953"
                },
                data : JSON.stringify({"uid":userUID, "nonce":nonce})
              })
              .done(function( res ) {
                console.log('RESPONSE :- ',res);
                resolve(res.result);
              });
          });
        }
      });

		}]);