 'use strict';

angular.module('app').directive('appPositionClass',[function () {
    return {
        scope:{
            com:'='
        },
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionClass.html',
        link:function (scope,element,attrs) {
            scope.showPositionList=function(idx) {
                        scope.positionList=scope.com.positionClass[idx].positionList;
                        scope.isActive=idx;
            }
            scope.$watch('com',function (newVal) {
                if(newVal){
                    scope.showPositionList(0);
                }
            })
        }
    }
}])