(function() {
  'use strict';

  var components = angular.module('components', ['ra.services']),
      baseUrl = '/wp-content/themes/wp-components/components/',
      isAdmin = document.querySelector('body').classList.contains('wp-admin'),
      utils = {};

  // maybe should move utils to it's own angular module?
  utils.arrayMove = function(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  };

  utils.stringCamelToDash = function(str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
  };

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
              e.preventDefault();
            }
            
            return false;
          });
          
          el.bind('dragenter', function(e) {
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
              e.preventDefault();
            }

            if (e.stopPropogation) {
              e.stopPropogation();
            }

            var data = window.localStorage.getItem('text');
            var dest = document.getElementById(el.attr('id'));
            var src = document.getElementById(data);

            if (angular.element(src).hasClass('droparea')) {
              if (id !== data) {
                var fromNumber, toNumber;
                toNumber = scope.$parent.$index;
                for (var i = scope.$parent.$parent.sections.length - 1; i >= 0; i -= 1) {
                  if (scope.$parent.$parent.sections[i].id === data) {
                    fromNumber = i;
                    break;
                  }
                }
                scope.$parent.reorderSections(fromNumber, toNumber);
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
          $scope.directives = [];
          for (var i = components._invokeQueue.length - 1; i >= 0; i -= 1) {
            var type = components._invokeQueue[i][1],
                name = components._invokeQueue[i][2][0];
            if (type === 'directive' && name !== 'sectionItem' && name !== 'paletteCanvas' && name !== 'raDropTarget' && name !== 'raDraggable') {
              $scope.directives.push(utils.stringCamelToDash(name));
            }
          }
          
          $scope.json = angular.element('#_cmb_component_canvas-cmb-field-0').val();
          $scope.sections = angular.fromJson($scope.json);

          $scope.addSection = function() {
            $scope.sections.push({id: uuid.new()});
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.removeSection = function(index) {
            $scope.sections.splice(index,1);
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.reorderSections = function(from, to) {
            utils.arrayMove($scope.sections, from, to);
            $scope.$apply();
          };

          $scope.addToSection = function(dragEl, dropEl) {
            var drop = angular.element(dropEl),
                drag = angular.element(dragEl);

            for (var i = $scope.sections.length - 1; i >= 0; i-=1) {
              if ($scope.sections[i].id === drop.attr('id')) {

                $scope.updateDataInSection(i, {id: drop.attr('id'), directive: drag.data('directive')});
                break;
              }
            }

            $scope.json = angular.toJson($scope.sections);
          };

          $scope.updateDataInSection = function(sectionNumber, sectionData) {
            $scope.sections[sectionNumber] = sectionData;
            $scope.json = angular.toJson($scope.sections);
            $scope.$apply();
          };

          $scope.updateData = function() {
            $scope.json = angular.toJson($scope.sections);
          };

          $scope.$watch( 'sections', function() {
            $scope.json = angular.toJson($scope.sections);
          });

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
      templateUrl: baseUrl + 'ra-carousel.html'
    };
  });

  components.directive('raVideo', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'ra-video.html'
    };
  });

  components.directive('raImage', function() {
    return {
      restrict: 'E',
      templateUrl: baseUrl + 'ra-image.html'
    };
  });

}());