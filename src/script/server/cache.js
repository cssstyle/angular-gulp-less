'use strict';

angular.module('app').service('cache', ['$cookieStore',function ($cookieStore) {
    this.put=function (key,value) {
        $cookieStore.put(key,value);
    };
    this.get=function (key) {
        return $cookieStore.get(key);
    };
    this.remove=function (key) {
        $cookieStore.remove(key);
    };

}])