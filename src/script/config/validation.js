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
