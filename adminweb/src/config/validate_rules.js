/**
 * Created by chenyuan.
 * created dt 2017-6-1
 * description 常用的表单验证规则
 */
import { getBirthday } from '@/util/GetBirthdayAndSex';

var checkAmount = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('必填项'));
    }
    // let result = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    let result = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value);
    if (!result) {
        callback(new Error('请输入合理的数字值'));
    }
    callback();
};

let checkTel = (rule, value, callback) => {
    if (value != null && value !== '') {
        let mobile = /^1[3|5|8]\d{9}$/;
        let telPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        let result = mobile.test(value) || telPhone.test(value);

        if (!result) {
            callback(new Error('请输入有效的电话号码或手机号码'));
        }
    }

    callback();
}

let checkPersonIDNo = (rule, value, callback) => {
    if (value != null && value !== '') {
        let result = getBirthday(value);
        if (result.error) {
            return callback(new Error(result.tipMsg));
        }
    }
    callback();
}
let checkSpace = (rule, value, callback) => {
    let spacePattern = /^\s+$/;
    let hasSpace = spacePattern.test(value);
    if (value == null || value.length === 0 || hasSpace) {
        return callback(new Error('必填项'));
    }
    callback();
};

const checkArr = (rule, value, callback) => {
    if (!Array.isArray(value)) {
        return callback(new Error(rule.message));
    }
    if (value.length === 0) {
        return callback(new Error(rule.message));
    }
    callback();
}

/**
 * 日期比较；rule.type分为大于等于gte，小于等于lte，大于gt，小于lt，等于eq  5中类型
 *  只比较日期，不比较时间
 * @param {any} rule 规则定义
 * @param {any} value 值
 * @param {any} callback 回调函数
 */
const dateCompare = (rule, value, callback) => {
    let oneDate = rule.compareDate;
    let twoDate = value;
    if (oneDate && twoDate) {
        let compareResult = true;
        if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
            oneDate = oneDate.getTime();
            twoDate = twoDate.getTime();
            switch (rule.type) {
                case 'gte': // 大于等于
                    compareResult = oneDate >= twoDate;
                    break;
                case 'lte': // 小于等于
                    compareResult = oneDate <= twoDate;
                    break;
                case 'gt': // 大于
                    compareResult = oneDate > twoDate;
                    break;
                case 'lt': // 小于
                    compareResult = oneDate < twoDate;
                    break;

                default: // 等于
                    compareResult = oneDate === twoDate;
                    break;
            }
        }
        if (!compareResult) {
            return callback(new Error(rule.message));
        }
    }
    callback();
};

const checkTime = (rule, value, callback) => {
    if (value != null && value !== '') {
        // var pattern = /^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/;
        var pattern = /^\s*([01][0-9]|2[0-3])\:([0-5][0-9])(\:[0-5][0-9]){0,1}\s*$/;
        let valid = value.match(pattern);
        if (valid == null) {
            return callback(new Error('时间格式是24小时制,如：08:00'));
        }
    }
    callback();
};

let minNumber = (rule, value, callback) => {
    let pattern = /^[0-9]*$/;
    if (!pattern.test(value)) {
        callback(new Error('请输入数字值'));
    } else {
        value = parseInt(value, 10);
        if (value < rule.minNum) {
            callback(new Error('数值必须大于' + rule.minNum));
        } else {
            callback();
        }
    }
};
let namePattern = (rule, value, callback) => {
    let pattern = new RegExp('[\\\\/:*?\"<>| ？“”、\'‘’]');
    if (pattern.test(value)) {
        callback(new Error('请输入正确的作品标题（不能包含/:*?\"<>、\'“”’‘|等非法字符）'));
    }
    callback();
};

const rules = {
    required: { required: true, validator: checkSpace, message: '必填项', trigger: 'blur' },
    required_Msg: function(msg) {
        return { required: true, validator: checkSpace, message: msg, trigger: 'blur' };
    },
    required_Array: function(msg) {
        return { validator: checkArr, trigger: 'blur', message: msg };
    },
    requiredSelect: { required: true, message: '请选择一项', trigger: 'change' },
    requiredRadio: { required: true, message: '请选择一项', trigger: 'change', type: 'boolean' },
    requiredCbx: { type: 'array', required: true, message: '请至少选择一项', trigger: 'change' },
    datarequired: { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
    timePattern: { validator: checkTime, trigger: 'blur' },
    dateCompare: function(compareDate, type = 'eq', message = '两个日期必须相等') {
        return { validator: dateCompare, compareDate: compareDate, type: type, message: message }
    },
    mobilePhone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { min: 11, max: 11, message: '手机号码必须是11位', trigger: 'blur' },
        { pattern: /^1[34578]\d{9}$/, message: '请输入中国国内的手机号码' }
    ],
    instructionsMsg: [
        {
            required: true,
            message: '必填项！',
            trigger: 'blur'
        }, {
            type: 'email',
            message: '邮箱格式不正确！',
            trigger: 'blur'
        }
    ],
    /* eslint no-useless-escape: "off" */
    numberFloat: { pattern: /^[\+\-]?\d*?\.?\d*?$/, message: '必须为数字' },
    mobilePattern: { pattern: /^1[34578]\d{9}$/, message: '请输入中国国内的手机号码' },
    numberPattern: { pattern: /^[0-9]*$/, message: '必须为整数' },
    number_Msg: function(msg) {
        return { pattern: /^[0-9]*$/, message: msg, trigger: 'blur' };
    },
    minPattern: function(min = 1) { return { validator: minNumber, minNum: min } },
    titlePattern: function(max = 40) { return { validator: namePattern, maxLen: max } },

    // minNumber: { validator: minNumber, minNum: 10 },

    number: { type: 'number', message: '必须为数字值' },
    amount: { validator: checkAmount, trigger: 'blur', required: true },
    IDPattern: { validator: checkPersonIDNo, trigger: 'blur' },
    // titlePattern: {pattern: /[\\\\/:*?\"<>| ]/, message: '请输入正确的作品标题（不能包含/:*?\"<>|等非法字符）'},
    maxLen: function(len) {
        return { max: len, message: '文字超出最大限度' + len + '个字符', trigger: 'blur' };
    },
    rangeLen: function(min, max) {
        return { min: min, max: max, message: '长度在 ' + min + ' 到 ' + max + ' 个字符', trigger: 'blur' };
    },
    telPattern: { validator: checkTel, trigger: 'blur' }
};
export default rules;
