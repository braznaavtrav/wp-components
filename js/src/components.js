(function() {
  'use strict';

  var components = angular.module('components', ['ra.services']),
      baseUrl = '/wp-content/themes/wp-components/components/',
      isAdmin = angular.element('body').hasClass('wp-admin');

  if (isAdmin) {

    components.controller('ddController', ['$scope', '$compile' , function($scope, $compile){

      $scope.dropped = function(dragEl, dropEl) {
        var drop = angular.element(dropEl),
            drag = angular.element(dragEl),
            directiveHTML = drag.data('directive'),
            compiledDirectiveHTML = $compile('<' + directiveHTML + '></' + directiveHTML + '>')($scope);

        drop.html(compiledDirectiveHTML);
      };
    }]);


    components.directive('raDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
      return {
        restrict: 'A',
        link: function(scope, el) {
          angular.element(el).attr('draggable', 'true');
          var id = angular.element(el).attr('id');
          if (!id) {
            id = uuid.new();
            angular.element(el).attr('id', id);
          }
          
          el.bind('dragstart', function() {
            window.localStorage.setItem('text', id);

            $rootScope.$emit('RA-DRAG-START');
          });
          
          el.bind('dragend', function() {
            $rootScope.$emit('RA-DRAG-END');
          });
        }
      };
    }]);


    components.directive('raDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
      return {
        require: '^paletteCanvas',
        restrict: 'A',
        scope: {
          onDrop: '&'
        },
        link: function(scope, el, attrs, paletteCanvasCtrl) {
          var id = angular.element(el).attr('id');
          if (!id) {
            id = uuid.new();
            angular.element(el).attr('id', id);
          }
                     
          el.bind('dragover', function(e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }
            
            return false;
          });
          
          el.bind('dragenter', function(e) {
            // this / e.target is the current hover target.
            if (angular.element(e.target).hasClass('droparea')) {
              angular.element(e.target).addClass('ra-over');
            }
          });
          
          el.bind('dragleave', function(e) {
            angular.element(e.target).removeClass('ra-over');  // this / e.target is previous target element.
          });
          
          el.bind('drop', function(e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            if (e.stopPropogation) {
              e.stopPropogation(); // Necessary. Allows us to drop.
            }

            var data = window.localStorage.getItem('text');
            var dest = document.getElementById(id);
            var src = document.getElementById(data);

            if (angular.element(src).hasClass('droparea')) {
              paletteCanvasCtrl.reorderSections();
            }

            if (angular.element(dest).hasClass('droparea')) {
              scope.onDrop({dragEl: src, dropEl: dest});
              // paletteCanvasCtrl.addSection(src);
            }
          });

          $rootScope.$on('RA-DRAG-START', function() {
            var el = document.getElementById(id);
            angular.element(el).addClass('ra-target');
          });
          
          $rootScope.$on('RA-DRAG-END', function() {
            var el = document.getElementById(id);
            angular.element(el).removeClass('ra-target');
            angular.element(el).removeClass('ra-over');
          });
        }
      };
    }]);


    components.directive('paletteCanvas', function($compile, uuid) {
      return {
        restrict: 'E',
        templateUrl: baseUrl + 'palette-canvas.html',
        controller: function($scope) {
          $scope.json = angular.element('#_cmb_component_canvas-cmb-field-0').val();
          $scope.sections = angular.fromJson($scope.json);

          $scope.directives = [
            'ra-carousel',
            'ra-video'
          ];

          $scope.addSection = function() {
            $scope.sections.push({id: uuid.new()});
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.addToSection = function(component) {
            console.log('addSection');
            $scope.sections.push('');
          };

          $scope.updateDataInSection = function(sectionNumber, sectionData) {
            $scope.sections[sectionNumber] = sectionData;
          };

          $scope.updateData = function() {
            console.log('updateData', $scope.sections);
            // parse sections
            // build json
          };

        },
        controllerAs: 'paletteCanvasCtrl'
      };
    });


    components.directive('sectionItem', function ($http, $templateCache, $compile) {
      return {
        restrict: 'E',
        replace: true,
        // require: '^paletteCanvas',
        link: function(scope , element, attrs) {
          scope.isAdmin = isAdmin;
          $http.get(baseUrl + scope.content.directive + '.html', {cache: $templateCache}).success(function(tplContent){
            element.replaceWith($compile(tplContent)(scope));
          });
        },
        controller: function($scope) {
          $scope.updateData = function() {
            // this probably/definitely isn't the best way to do this
            // todo: refactor?
            $scope.$parent.$parent.$parent.updateData();
          };
        },
        scope: {
          content:'='
        }
      };
    });


  }


  //  =======================
  //  = REGISTER COMPONENTS =
  //  =======================

  components.directive('raCarousel', function() {
    return {
      restrict: 'E',
      require: 'paletteCanvas',
      templateUrl: baseUrl + 'ra-carousel.html',
      // link: function(scope, element, attrs, paletteCanvasCtrl) {

      // },
      controller: function($scope) {
        // $scope.componentData = {
        //   slides: []
        // };

      }
    };
  });

  components.directive('raVideo', function() {
    return {
      restrict: 'E',
      require: 'paletteCanvas',
      templateUrl: baseUrl + 'ra-video.html',
      // link: function(scope, element, attrs, paletteCanvasCtrl) {

      // },
      controller: function($scope) {
        $scope.isAdmin = isAdmin;
        // $scope.componentData = {
        //   slides: []
        // };

      }
    };
  });

}());