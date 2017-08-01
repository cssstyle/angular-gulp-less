'use strict';
angular.module('app').value('dist',{}).run(['dist','$http',function (dist,$http) {
    $http.get('data/city.json').success(function (resp) {
        dist.city=resp
    })
    $http.get('data/salary.json').success(function (resp) {
        dist.salary=resp
    })
    $http.get('data/scale.json').success(function (resp) {
        dist.scale=resp
    })
}])
