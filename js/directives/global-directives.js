(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// EXCLUDE GO HERE

// EXCLUDE END HERE
var searchEntity             = require(2);
var btnLoader                = require(1);

module.exports = angular.module('global-directives', [])
.directive('btnLoader', btnLoader)
.directive('searchEntity', searchEntity)
// EXCLUDE GO HERE

// EXCLUDE END HERE


},{"1":3,"2":4}],2:[function(require,module,exports){
module.exports = '<div class="dtb-block search-wrap">\n' +
    '  <div class="">\n' +
    '    <div class="icon-addon addon-md">\n' +
    '      <input type="text" placeholder="Search" class="form-control" ng-model="searchText" autofocus ng-keyup="searchApp($event)">\n' +
    '      <label class="fa fa-search"></label>\n' +
    '    </div>\n' +
    '   </div>\n' +
    '</div>\n' +
    '';
},{}],3:[function(require,module,exports){
'use strict';
module.exports = function() {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        btnLoader : "=",
        loadingText : "@",
        loadingImage:"@"
      },
      link: function(scope, elem, attrs) {
        var textSelect    = elem.find('.js-btn-text');
        var btnText       = textSelect.text();
        var iconSelector  = elem.find('i');
        var faClass       = iconSelector.attr('class');
        var imgElem       = scope.loadingImage ? "<img src='"+scope.loadingImage+"' />" : "";
        scope.$watch('btnLoader', function(){
          if(scope.btnLoader){
            if(imgElem){
              iconSelector.attr('class', "");
              iconSelector.html(imgElem);
            }
            elem.attr('disabled', 'disabled');
            textSelect.text(scope.loadingText);  
          }
          else{
            elem.removeAttr('disabled', 'disabled');
            iconSelector.attr('class', faClass);
            iconSelector.html("");
            textSelect.text(btnText);
          }
        })
      }
    }
}

},{}],4:[function(require,module,exports){
var appSearchBoxTPL = require(1);

module.exports = [
  'utilsService',
  '$state',
  'relayService',
  function(Utils, $state, Relay) {
    return {
      restrict: 'A',
      replace: true,
      template: appSearchBoxTPL,
      scope:{
        searchText : "="
      },
      link: function(scope, elem, attrs) {
        
        //scope.searchText = scope.searchText || "";
        var keyCodes = [20, 17, 16, 9];
        var onSearchApp = _.debounce(function(){
          Relay.send('search-entity', scope.searchText);
        }, 500);

        scope.searchApp = function(e){
          if(!~keyCodes.indexOf(e.which))
            onSearchApp();
        };

      }
    }
  }
]


},{"1":2}]},{},[1]);
