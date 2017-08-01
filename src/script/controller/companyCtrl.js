'use strict';

angular.module('app').controller('companyCtrl',['$http','$state','$scope',function ($http,$state,$scope) {
    $http.get('data/company.json?id='+$state.params.id).success(function (resp) {
        console.log('success')
        $scope.com=resp;
        //向下一级广播
        $scope.$broadcast('abc',{id:1});
    })

        //接受
        $scope.$on('bac',function (event,data) {
            console.log(event,data);
        })
}])