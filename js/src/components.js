(function() {
  'use strict';

  var components = angular.module('components', []),
      baseUrl = 'wp-content/themes/angular/components/';

  components.directive('carousel', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'carousel.html'
    };
  });
}());