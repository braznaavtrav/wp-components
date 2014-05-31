(function(posts) {
  'use strict';

  var components = angular.module('components', []),
      baseUrl = 'wp-content/themes/angular/components/';

  components.directive('carousel', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'carousel.html'
    };
  });

  components.directive('blogPosts', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'blog-posts.html',
      controller: function() {
        this.posts = posts;
        console.log(this.posts);
      },
      controllerAs: 'posts'

    };
  });

}(window.posts));