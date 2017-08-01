'use strict'

angular.module('app',['ui.router','ngCookies','validation']);

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

'use strict';
angular.module('app').config(["$provide",function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
        var get=$delegate.get;
        $delegate.post=function (url,data,config) {
            var def=$q.defer();
            get(url).success(function (resp) {
                 def.resolve(resp)
            }).error(function (err) {
                 def.reject(err)
            })
            return {
                success:function (cb) {
                    def.promise.then(cb);
                },
                error:function (cb) {
                    def.promise.then(null,cb);
                }
            }
        }
        return $delegate;
    }])
}])
'use strict'

angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $stateProvider.state('main',{
        url:'/main',
        templateUrl:'view/main.html',
        controller:'mainCtrl'
    }).state('position',{
        url:'/position/:id',
        templateUrl:'view/position.html',
        controller:'positionCtrl'
    }).state('company',{
        url:'/company/:id',
        templateUrl:'view/company.html',
        controller:'companyCtrl'
    }).state('search',{
        url:'/search/:id',
        templateUrl:'view/search.html',
        controller:'searchCtrl'
    }).state('login',{
        url:'/login',
        templateUrl:'view/template/login.html',
        controller:'loginCtrl'
    }).state('register',{
        url:'/register',
        templateUrl:'view/template/register.html',
        controller:'registerCtrl'
    }).state('me',{
        url:'/me',
        templateUrl:'view/template/me.html',
        controller:'meCtrl'
    }).state('post',{
        url:'/post',
        templateUrl:'view/template/post.html',
        controller:'postCtrl'
    }).state('favorite',{
        url:'/favorite',
        templateUrl:'view/template/favorite.html',
        controller:'favoriteCtrl'
    })
    $urlRouterProvider.otherwise('/main');
}])


'use strict';
angular.module('app').config(['$validationProvider', function ($validationProvider) {
    // 设置校验规则
    var expression = {

        // 手机号
        phone : /^1[\d]{10}$/,

        // 密码
        password : function (value) {
            var str = value + '';
            return str.length > 5
        },

        // 必须有值
        required : function (value) {
            return value!==undefined;
        }
    };

    // 设置当表单输入条件不满足规则的时候的提醒文字
    var defaultMessage = {
        phone : {
            success : '',
            error : '手机号不符合规则'
        },

        password : {
            success : '',
            error : '密码必须大于6位'
        },

        required : {
            success : '',
            error : '该项不能为空'
        }
    };

    // 使用validation服务设置校验规则, 让校验规则生效
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMessage);

}]);

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
'use strict'

angular.module('app').controller('favoriteCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('data/myFavorite.json').success(function (resp) {
        $scope.list=resp;
    })
}])
'use strict'

angular.module('app').controller('loginCtrl',['cache','$state','$http','$scope',function (cache,$state,$http,$scope) {
    $scope.submit=function () {
        $http.post('data/login.json',$scope.user).success(function(resp){
            cache.put('id',resp.id);
            cache.put('name',resp.name);
            cache.put('image',resp.image);
            $state.go('main');
        })
    }

}])
'use strict'

angular.module('app').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
   $http.get('/data/positionList.json').success(function (resp) {

       $scope.list=resp;
       console.log($scope.$root);
   })
}])
'use strict'

angular.module('app').controller('meCtrl',['$state','cache','$http','$scope',function ($state,cache,$http,$scope) {
     if(cache.get('name')){
         $scope.name=cache.get('name');
         $scope.image=cache.get('image');
     }

     $scope.logout=function () {
         cache.remove('id');
         cache.remove('name');
         cache.remove('image');
         $state.go('main');
     }
}])
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
'use strict'

angular.module('app').controller('postCtrl',['$http','$scope',function ($http,$scope) {
    $scope.tabList=[{
        id:"all",
        name:"全部"
    },{
        id:"pass",
        name:"面试邀请"
    },{
        id:"fail",
        name:"不合适"
    }]
    $http.get('data/myPost.json').success(function (res) {
        $scope.positionList=res;
    })


    $scope.filterObj={};
    $scope.tClick=function (id,name) {
        switch(id){
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state='1';
                break;
            case 'fail':
                $scope.filterObj.state='-1';
                break;
            default:
        }
    }
}])
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
'use strict';

angular.module('app').controller('searchCtrl',['dist','$http','$state','$scope',function (dist,$http,$state,$scope) {
    $scope.name='';
    $scope.search=function () {
        $http.get('data/positionList.json').success(function (resp) {
            $scope.positionList=resp;
        })
    };
    $scope.search();
    $scope.sheet={};
    $scope.tabList=[{
        id:'city',
        name:'城市'
    },{
        id:'salary',
        name:'薪水'
    },{
        id:'scale',
        name:'公司规模'
    }];
    $scope.filterObj={};
    var tabId='';
    $scope.tClick=function (id,name) {
        tabId=id;
        $scope.sheet.list=dist[id];
        $scope.sheet.visible=true;
    };
    $scope.sClick=function (id,name) {
        if(id){
            angular.forEach($scope.tabList,function (item) {
                if(item.id===tabId){
                    item.name=name;
                }
            });
            $scope.filterObj[tabId+'Id']=id;
        }else{
            delete $scope.filterObj[tabId+'Id'];
            angular.forEach($scope.tabList,function (item) {
                if(item.id===tabId){
                    switch(item.id){
                        case 'city':
                            item.name='城市';
                            break;
                        case 'salary':
                            item.name='薪水';
                            break;
                        case 'scale':
                            item.name='公司规模';
                            break;
                        default:
                    }
                }
            })
        }
    };

}])
'use strict'

angular.module('app').directive('appCompany',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/company.html',
        scope:{
            data:"="
        }
    }
}])
'use strict'

angular.module('app').directive('appFoot',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/foot.html'
    }
}])
'use strict'
angular.module('app').directive('appHead',['cache',function (cache) {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/head.html',
        link:function ($scope) {
            $scope.name=cache.get('name')||'';
        }
    }
}])
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
'use strict'

angular.module("app").directive('appPositionInfo',['$http',function ($http) {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionInfo.html',
        scope:{
            isActive:'=',
            isLogin:'=',
            pos:'='
        },
        link:function (scope) {
            scope.$watch('pos',function (newVal) {
                if(newVal){
                    scope.pos.select=scope.pos.select||false;
                    scope.imagePath=scope.pos.select?'image/star-active.png':'image/star.png';
                }
            })


            scope.favorite=function () {
                $http.post('data/favorite.json',{
                    id:scope.pos.id,
                    select:scope.pos.select
                }).success(function (resp) {
                    scope.pos.select=!scope.pos.select;
                    scope.imagePath=scope.pos.select?'image/star-active.png':'image/star.png';
                })
            }
        }
    }
}])
'use strict'

angular.module('app').directive('appPositionList',['$http',function ($http) {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionList.html',
        scope:{
            data:"=",
            filterObj:'=',
            isFavorite:'='
        },
        link:function ($scope) {
            $scope.select=function (item) {
                $http.post('data/favorite.json',{
                    id:item.id,
                    select:!item.select
                }).success(function (resp) {
                    item.select=!item.select;
                });
            }
        }
    }
}])
'use strict'

angular.module('app').directive('appSheet',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/sheet.html',
        scope:{
            list:'=',
            visible:'=',
            select:'&'
        }
    }
}])
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
'use strict';
angular.module('app').filter('filterByObj',[function () {
    return function (list,obj) {
        var result=[];
        angular.forEach(list,function (item) {
            var isEqual=true;
            for(var e in obj){
                if(item[e]!==obj[e]){
                    isEqual=false;
                }
            }
            if(isEqual){
                result.push(item);
            }
        });
        return result;
    }
}])
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