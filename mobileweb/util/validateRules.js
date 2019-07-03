/**
 * Created by chenyuan.
 * created dt 2017-6-1
 * description 常用的表单验证规则
 */
import { Toast } from 'mint-ui';
import { getBirthday } from './GetBirthdayAndSex';

function validateResult(error) {
    if (error && error.message !== '') {
        Toast({
            message: error.message,
            className: 'toast-tip ',
            position: 'middle',
            duration: 2000
        });
        return false;
    }
    return true;
};

export function checkAmount(value, msg = '请输入合理的数字值') {
    if (!value) {
        return validateResult(new Error('必填项'));
    }
    // let result = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    let result = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value);
    if (!result) {
        return validateResult(new Error(msg));
    }
    return validateResult();
};
export function checkPhone(value, msg = '请输入正确的手机号码') {
    if (value) {
        var reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        let result = reg.test(value);
        if (!result) {
            return validateResult(new Error(msg));
        }
    }
    return validateResult();
}

export function checkTel(value, msg = '请输入有效的电话号码或手机号码') {
    let mobile = /^1[3|5|8]\d{9}$/;
    let telPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    let result = mobile.test(value) || telPhone.test(value);

    if (!result) {
        return validateResult(new Error(msg));
    }
    return validateResult();
}

export function checkPersonIDNo(value) {
    if (value != null && value !== '') {
        let result = getBirthday(value);
        if (result.error) {
            return validateResult(new Error(result.tipMsg));
        }
    }
    return validateResult();
}
export function required(value, msg = '必填项') {
    let spacePattern = /^\s+$/;
    let hasSpace = spacePattern.test(value);
    if (value == null || value.length === 0 || hasSpace) {
        return validateResult(new Error(msg));
    }
    return validateResult();
};

export function checkPass(value, confirm, msg = '密码必须由6-18位的数字加字母组成') {
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    let result = reg.test(value);
    if (!result) {
        return validateResult(new Error(msg));
    }
    if (confirm !== '') {
        return checkPassConfirm(value, confirm);
    }

    return validateResult();
}
export function checkPassConfirm(value, confirm, msg = '两次输入密码不一致!') {
    if (value !== confirm) {
        return validateResult(new Error(msg));
    }
    return validateResult();
}
export function checkLen(value, len, msg = '字符长度超出限定范围!') {
    if (value && value.length > len) {
        return validateResult(new Error(msg));
    }
    return validateResult();
}

const rules = {
    required,
    validateResult,
    checkAmount,
    checkTel,
    checkPersonIDNo,
    checkPhone,
    checkPass,
    checkPassConfirm,
    checkLen
};
export default rules;
