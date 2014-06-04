(function() {
  'use strict';

  var components = angular.module('components', ['ra.services']),
      baseUrl = '/wp-content/themes/wp-components/components/',
      isAdmin = angular.element('body').hasClass('wp-admin');

  if (isAdmin) {

    components.directive('raDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
      return {
        restrict: 'A',
        link: function(scope, el) {
          angular.element(el).attr('draggable', 'true');
          var id;
          if (scope.section) {
            id = scope.section.id;
          }
          if (!id) {
            id = uuid.new();
          }
          angular.element(el).attr('id', id);
          
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
          var id;
          if (scope.section) {
            id = scope.section.id;
          }
          if (!id) {
            id = uuid.new();
          }
          angular.element(el).attr('id', id);
                     
          el.bind('dragover', function(e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }
            
            return false;
          });
          
          el.bind('dragenter', function(e) {
            // this / e.target is the current hover target.
            if (angular.element(e.target).hasClass('droparea')) {
              var el = angular.element('#' + window.localStorage.getItem('text'));
              if (el.hasClass('droparea')) {
                if (el.attr('id') !== angular.element(e.target).attr('id')) {
                  angular.element(e.target).addClass('ra-over-order');
                }
              }
              else {
                angular.element(e.target).addClass('ra-over');
              }
            }
          });
          
          el.bind('dragleave', function(e) {
            angular.element(e.target).removeClass('ra-over');
            angular.element(e.target).removeClass('ra-over-order');
          });
          
          el.bind('drop', function(e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            if (e.stopPropogation) {
              e.stopPropogation(); // Necessary. Allows us to drop.
            }

            var data = window.localStorage.getItem('text');
            var dest = document.getElementById(el.attr('id'));
            var src = document.getElementById(data);

            if (angular.element(src).hasClass('droparea')) {
              if (id !== data) {
                console.log('you dragged a droparea');
                scope.$parent.reorderSections();
              }
            }

            if (angular.element(src).hasClass('palette-item')) {
              scope.onDrop({dragEl: src, dropEl: dest});
            }

            angular.element(e.target).removeClass('ra-over');
            angular.element(e.target).removeClass('ra-over-order');

          });

          $rootScope.$on('RA-DRAG-START', function() {
            var el = document.getElementById(id);
            angular.element(el).addClass('ra-target');
          });
          
          $rootScope.$on('RA-DRAG-END', function() {
            var el = document.getElementById(id);
            angular.element(el).removeClass('ra-target');
            angular.element(el).removeClass('ra-over');
            angular.element(el).removeClass('ra-over-order');
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

          $scope.removeSection = function(index) {
            $scope.sections.splice(index,1);
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.reorderSections = function(dragEl, dropEl) {
            console.log('reorderSections');
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.addToSection = function(dragEl, dropEl) {
            console.log('addToSection');
            var drop = angular.element(dropEl),
                drag = angular.element(dragEl);

            // get section
            var dropSection;
            console.log('before ' + angular.toJson($scope.sections));
            for (var i = $scope.sections.length - 1; i >= 0; i-=1) {
              if ($scope.sections[i].id === drop.attr('id')) {

                $scope.updateDataInSection(i, {id: drop.attr('id'), directive: drag.data('directive')});
                break;
              }
            }
            console.log('after ' + angular.toJson($scope.sections));
            
            // // put data in section
            // console.log(directiveHTML);
            // update json
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.updateDataInSection = function(sectionNumber, sectionData) {
            console.log('updateDataInSection');
            $scope.sections[sectionNumber] = sectionData;
            $scope.json = angular.toJson($scope.sections);
            $scope.$apply();
          };

          $scope.updateData = function() {
            console.log('updateData', $scope.sections);
            $scope.json = angular.toJson($scope.sections);
          };

        }
      };
    });


    components.directive('sectionItem', function ($http, $templateCache, $compile) {
      return {
        restrict: 'E',
        replace: true,
        link: function(scope , element, attrs) {
          scope.isAdmin = isAdmin;
          if (scope.content.directive) {
            $http.get(baseUrl + scope.content.directive + '.html', {cache: $templateCache}).success(function(tplContent){
              element.replaceWith($compile(tplContent)(scope));
            });
          }
        },
        controller: function($scope) {
          $scope.updateData = function() {
            // this probably/definitely isn't the best way to do this
            // todo: refactor?
            $scope.$parent.$parent.updateData();
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
      templateUrl: baseUrl + 'ra-carousel.html'
    };
  });

  components.directive('raVideo', function() {
    return {
      restrict: 'E',
      require: 'paletteCanvas',
      templateUrl: baseUrl + 'ra-video.html'
    };
  });

}());