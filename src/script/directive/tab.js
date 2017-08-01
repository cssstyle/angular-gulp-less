'use strict'
angular.module('app').directive('appTab',[function () {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/tab.html',
        scope:{
            list:'=',
            tabClick:'&'
        },
        link:function (scope) {
            scope.click=function (tab) {
                scope.selectedId=tab.id;
                scope.tabClick(tab);
            }
        }
    }
}])