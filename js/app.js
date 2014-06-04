!function(){"use strict";var app=angular.module("app",["components"]);app.config(function($interpolateProvider){$interpolateProvider.startSymbol("<%="),$interpolateProvider.endSymbol("%>")})}(),function(){"use strict";var components=angular.module("components",["ra.services"]),baseUrl="/wp-content/themes/wp-components/components/",isAdmin=angular.element("body").hasClass("wp-admin");isAdmin&&(components.directive("raDraggable",["$rootScope","uuid",function($rootScope,uuid){return{restrict:"A",link:function(scope,el){angular.element(el).attr("draggable","true");var id;scope.section&&(id=scope.section.id),id||(id=uuid.new()),angular.element(el).attr("id",id),el.bind("dragstart",function(){window.localStorage.setItem("text",id),$rootScope.$emit("RA-DRAG-START")}),el.bind("dragend",function(){$rootScope.$emit("RA-DRAG-END")})}}}]),components.directive("raDropTarget",["$rootScope","uuid",function($rootScope,uuid){return{require:"^paletteCanvas",restrict:"A",scope:{onDrop:"&"},link:function(scope,el){var id;scope.section&&(id=scope.section.id),id||(id=uuid.new()),angular.element(el).attr("id",id),el.bind("dragover",function(e){return e.preventDefault&&e.preventDefault(),!1}),el.bind("dragenter",function(e){if(angular.element(e.target).hasClass("droparea")){var el=angular.element("#"+window.localStorage.getItem("text"));el.hasClass("droparea")?el.attr("id")!==angular.element(e.target).attr("id")&&angular.element(e.target).addClass("ra-over-order"):angular.element(e.target).addClass("ra-over")}}),el.bind("dragleave",function(e){angular.element(e.target).removeClass("ra-over"),angular.element(e.target).removeClass("ra-over-order")}),el.bind("drop",function(e){e.preventDefault&&e.preventDefault(),e.stopPropogation&&e.stopPropogation();var data=window.localStorage.getItem("text"),dest=document.getElementById(el.attr("id")),src=document.getElementById(data);angular.element(src).hasClass("droparea")&&id!==data&&(console.log("you dragged a droparea"),scope.$parent.reorderSections()),angular.element(src).hasClass("palette-item")&&scope.onDrop({dragEl:src,dropEl:dest}),angular.element(e.target).removeClass("ra-over"),angular.element(e.target).removeClass("ra-over-order")}),$rootScope.$on("RA-DRAG-START",function(){var el=document.getElementById(id);angular.element(el).addClass("ra-target")}),$rootScope.$on("RA-DRAG-END",function(){var el=document.getElementById(id);angular.element(el).removeClass("ra-target"),angular.element(el).removeClass("ra-over"),angular.element(el).removeClass("ra-over-order")})}}}]),components.directive("paletteCanvas",function($compile,uuid){return{restrict:"E",templateUrl:baseUrl+"palette-canvas.html",controller:function($scope){$scope.json=angular.element("#_cmb_component_canvas-cmb-field-0").val(),$scope.sections=angular.fromJson($scope.json),$scope.directives=["ra-carousel","ra-video"],$scope.addSection=function(){$scope.sections.push({id:uuid.new()}),$scope.json=angular.toJson($scope.sections)},$scope.removeSection=function(index){$scope.sections.splice(index,1),$scope.json=angular.toJson($scope.sections)},$scope.reorderSections=function(){console.log("reorderSections"),$scope.json=angular.toJson($scope.sections)},$scope.addToSection=function(dragEl,dropEl){console.log("addToSection");var drop=angular.element(dropEl),drag=angular.element(dragEl);console.log("before "+angular.toJson($scope.sections));for(var i=$scope.sections.length-1;i>=0;i-=1)if($scope.sections[i].id===drop.attr("id")){$scope.updateDataInSection(i,{id:drop.attr("id"),directive:drag.data("directive")});break}console.log("after "+angular.toJson($scope.sections)),$scope.json=angular.toJson($scope.sections)},$scope.updateDataInSection=function(sectionNumber,sectionData){console.log("updateDataInSection"),$scope.sections[sectionNumber]=sectionData,$scope.json=angular.toJson($scope.sections),$scope.$apply()},$scope.updateData=function(){console.log("updateData",$scope.sections),$scope.json=angular.toJson($scope.sections)}}}}),components.directive("sectionItem",function($http,$templateCache,$compile){return{restrict:"E",replace:!0,link:function(scope,element){scope.isAdmin=isAdmin,scope.content.directive&&$http.get(baseUrl+scope.content.directive+".html",{cache:$templateCache}).success(function(tplContent){element.replaceWith($compile(tplContent)(scope))})},controller:function($scope){$scope.updateData=function(){$scope.$parent.$parent.updateData()}},scope:{content:"="}}})),components.directive("raCarousel",function(){return{restrict:"E",require:"paletteCanvas",templateUrl:baseUrl+"ra-carousel.html"}}),components.directive("raVideo",function(){return{restrict:"E",require:"paletteCanvas",templateUrl:baseUrl+"ra-video.html"}})}(),function(){"use strict";var module;try{module=angular.module("ra.services")}catch(e){module=angular.module("ra.services",[])}module.factory("uuid",function(){var svc={"new":function(){function _p8(s){var p=(Math.random().toString(16)+"000000000").substr(2,8);return s?"-"+p.substr(0,4)+"-"+p.substr(4,4):p}return _p8()+_p8(!0)+_p8(!0)+_p8()},empty:function(){return"00000000-0000-0000-0000-000000000000"}};return svc})}();