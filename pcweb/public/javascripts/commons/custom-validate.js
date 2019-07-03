//手机号格式
$.validator.addMethod("phoneType", function(value) {
    var reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    return reg.test(value);
}, '请输入正确的手机号码');

//密码格式
$.validator.addMethod("pwdType", function(value) {
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return reg.test(value);
}, '密码必须由6-18位的数字加字母组成');