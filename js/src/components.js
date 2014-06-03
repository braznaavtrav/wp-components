(function() {
  'use strict';

  var components = angular.module('components', []),
      baseUrl = '/wp-content/themes/wp-components/components/';

  components.controller('ComponentsController', ['$scope', function($scope) {
    $scope.directives = [
      'carousel'
    ];
  }]);

  components.directive('postCanvas', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'post-canvas.html',
      controller: function($scope) {
        $scope.directives = [
          'carousel'
        ];
        console.log($scope);
      },
      controllerAs: 'directives'
    };
  });

  components.directive('carousel', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'carousel.html'
    };
  });

  // console.log(components);

}());