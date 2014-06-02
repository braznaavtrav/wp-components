(function() {
  'use strict';

  var app = angular.module('app', ['components']);
  
  app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%=');
    $interpolateProvider.endSymbol('%>');
  });

  console.log('running app');
  

}());