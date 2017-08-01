'use strict'
angular.module('app').directive('appHeadBar',[function () {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/headBar.html',
        scope:{
            text:'='
        },
        link:function (scope) {
            scope.back=function () {
                window.history.back();
            }
            //接受
            scope.$on('abc',function (event,data) {
                console.log(event,data);
            })
            //向上广播事件
            scope.$emit('bac',{name:2});
            //在双向数据绑定失效时，强制同步数据
            //正常逻辑中使用会报错
            // scope.$digest();

        }

    }
}])