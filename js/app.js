!function(){"use strict";var app=angular.module("app",["components"]);app.config(function($interpolateProvider){$interpolateProvider.startSymbol("<%="),$interpolateProvider.endSymbol("%>")}),console.log("running app")}(),function(){"use strict";var components=angular.module("components",[]),baseUrl="/wp-content/themes/wp-components/components/";components.directive("postCanvas",function(){return{restrict:"E",templateUrl:baseUrl+"post-canvas.html"}}),components.directive("carousel",function(){return{restrict:"E",templateUrl:baseUrl+"carousel.html"}})}();