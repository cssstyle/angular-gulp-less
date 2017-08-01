'use strict'

angular.module('app').controller('positionCtrl',['$q','$http','$state','$scope','cache',function ($q,$http,$state,$scope,cache) {
    cache.remove('to');
    $scope.isLogin=!!cache.get('name');
    $scope.message=$scope.isLogin?'投个简历':'去登陆';
    function getPosition() {
        var def=$q.defer();
        $http.get('/data/position.json?id='+$state.params.id).success(function (resp) {
            // console.log(resp);
            $scope.position=resp;
            if(resp.posted){
                $scope.message='已投递';
            }
            def.resolve(resp);
        }).error(function(error){
            def.reject(error);
        });
        return def.promise;
    }
    function getCompany(id){
        $http.get('/data/company.json?id='+id).success(function (resp) {
            // console.log(resp);
            $scope.com=resp;
        })
    }

    getPosition().then(function (obj) {
        getCompany(obj.companyId);
    })
    $scope.go=function () {
        if($scope.isLogin && $scope.message!=='已投递'){
            $http.post('data/handle.json',{
                id:$scope.position.id
            }).success(function (resp) {
                console.log(resp)
                $scope.message='已投递';
            })
        }else{
            $state.go('login')
        }
    }
}])