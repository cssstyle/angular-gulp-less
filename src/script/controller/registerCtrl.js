'use strict'

angular.module('app').controller('registerCtrl',['$state','$interval','$http','$scope',function ($state,$interval,$http,$scope) {
    $scope.submit=function () {
        $http.post('data/regist.json',$scope.user).success(function (resp) {
            $state.go('login')
        })
    }

    var count=3;
    $scope.send=function () {
        $http.get('data/code.json').success(function (resp) {
            if(1===resp.state){
                $scope.time='3s';
                count=3;
                var interval=$interval(function () {
                    if(count<=0){
                        $interval.cancel(interval);
                        $scope.time='';
                        return;
                    }else{
                        count--;
                        $scope.time=count+'s';
                    }

                },1000)
            }
        })
    }
}])