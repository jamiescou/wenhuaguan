/**
 * 深拷贝对象
 * @param {Obect} obj 要复制的对象
 */
const deepClone = function(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone)
    } else if (obj && typeof obj === 'object') {
        var cloned = {}
        var keys = Object.keys(obj)
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            cloned[key] = deepClone(obj[key])
        }
        return cloned
    } else {
        return obj
    }
}

/**
 * 时间日期转换成指定格式的字符串
 * @param {Date} date 时间日期
 * @param {String} fmt 格式化类型，如“yyyy-MM-dd HH:mm:ss” 、“yyyy-MM-dd HH:mm:ss EE”
 */
function _formatDate(date, fmt) {
    if (date === undefined || date === null || date === '') return '';

    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日期
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
        'H+': date.getHours(), // 24小时制
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    let week = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d'
    };
    // 匹配y，匹配成功，用date中的year替换fmt中的y
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    // 匹配周 EE对应周一……；EEE对应星期一……
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt;
}
/**
 * 字符串格式成日期格式
 * @param {String} value 待格式化字符
 * @returns {Date}
 */
function convertToDate(value) {
    if (typeof value !== 'string') {
        return;
    }
    if (value.length === 4) { // 只有年 yyyy
        return new Date(parseInt(value, 10), 0, 1);
    } else if (value.length === 8) { // 年月日 yyyyMMdd
        let year = value.substr(0, 4);
        let month = parseInt(value.substr(4, 2), 10) - 1;
        let day = value.substr(6, 2);
        return new Date(year, month, day);
    } else {
        return new Date(Date.parse(value.replace(/-/g, '/')));
    }
}
/**
 * 判断对象是否是空对象，如{}
 * @param {*} obj 判断对象
 */
const _isEmptyObject = function(obj) {
    for (var key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
};

/**
 * 判断任意对象是否为空对象；如{}、[]、{key:''}都属于空对象
 * @param {*} object 判断对象
 */
const isBlank = function(object) {
    var attrNum = 0;
    var emptyAttr = 0;

    function searchEmptyProperty(obj) {
        for (var i in obj) {
            var value = object[i];
            attrNum += 1;
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        emptyAttr += 1;
                        continue;
                    }
                }
                searchEmptyProperty(value);
                if (_isEmptyObject(value)) {
                    emptyAttr += 1;
                }
            } else {
                if (value === '' || value === null || value === undefined) {
                    emptyAttr += 1;
                    console.log('empty attribute: ', i);
                } else {
                    console.log('noteEmpty ', i, value);
                }
            }
        }
    }

    searchEmptyProperty(object);
    return attrNum === emptyAttr;
}

/**
 * 删除确认提示
 * @param {String} msg  提示信息
 * @param {Fun} thenFun 回调函数
 */
const delConfirm = function(msg = '数据', thenFun) {
    this.$confirm('此操作将永久删除该' + msg + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(thenFun).catch(() => {});
}

/**
 * 显示提示
 * @param {String} msg 提示信息
 * @param {*} type 提示类型 success/warning/info/error
 */
const ShowTip = function(msg = '操作成功', type = 'success') {
    this.$message({
        showClose: true,
        message: msg,
        type: type
    });
};
/**
 * 显示提示
 * @param {String} msg 提示信息
 * @param {*} type 提示类型 success/warning/info/error
 */
const ShowCenterTip = function(msg = '操作成功', type = 'success') {
    this.$message({
        showClose: true,
        message: msg,
        type: type,
        customClass: 'center'
    });
};
/**
 * 创建并下载文件
 * @param  {String} fileName 文件名
 * @param  {blob} fileContent  blob类型的文件内容
 */
function createAndDownloadFile(fileName, fileContent) {
    let type = typeof fileContent;
    if (type === 'object') {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName); // 文件另存为
        } else {
            var blob = new Blob([fileContent]);
            var data = window.URL.createObjectURL(blob); // 创建包含blob的ObjectURL的链接。
            var aTag = document.createElement('a');
            aTag.download = fileName;
            aTag.href = data;
            aTag.taget = '_blank';
            document.body.appendChild(aTag);
            aTag.click();
            setTimeout(() => {
                document.body.removeChild(aTag);
                window.URL.revokeObjectURL(data); // 对于Firefox，需要延迟撤销ObjectURL
            }, 100);
        }
    } else if (type === 'string') {
        let aTag = document.createElement('a');
        aTag.download = fileName;
        aTag.href = fileContent;
        aTag.taget = '_blank';
        document.body.appendChild(aTag);
        aTag.click();
    }
}
/**
 * 字母序号
 *
 * @param {any} index 索引值
 * @returns 对应索引的字母
 */
function letterSeq(index) {
    let letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let i = index % 26;
    return letter[i];
}
/**
 * 获取年龄
 * @param {String} strBirthday 生日
 * @returns Age
 */
function getAge(strBirthday) {
    if (!strBirthday || strBirthday === '') return '';

    var birthDate = new Date(strBirthday);
    var bYear = birthDate.getFullYear();
    var bMonth = birthDate.getMonth();
    var bDay = birthDate.getDate();

    var nowDateTime = new Date();
    var nowYear = nowDateTime.getFullYear();
    var nowMonth = nowDateTime.getMonth();
    var nowDay = nowDateTime.getDate();

    var ageDiff = nowYear - bYear; // 年差值
    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowMonth < bMonth || (nowMonth === bMonth && nowDay < bDay)) {
        ageDiff--;
    }
    return ageDiff;
}

const SEX = { 'male': '男', 'female': '女', 'unkown': '未知' };
const TYPE = { 'pic': '图片', 'video': '视频', 'audio': '音频', 'attach': '附件' };
import Vue from 'vue';
import axios from 'axios'
import { merge } from 'lodash'
// 全局配置文件
Vue.prototype.configs = require('@/config');
if (process.env.NODE_ENV === 'production') {
    axios.get('/appConfig').then((result) => {
        if (result.status === 200) {
            Vue.prototype.configs = merge(Vue.prototype.configs, result.data);
        }
    }).catch((error) => { console.log(error) });
}

/**
 * 2个数据段是否有重叠
 *  1数据段（a,b）、2数据段（x,y） 如果 y<a 或者 b<x 表示数据段没有冲突，反之有冲突
 * @param {any} a 1数据段A端
 * @param {any} b 1数据段B段
 * @param {any} x 2数据段X段
 * @param {any} y 2数据段Y端
 * @returns true/false
 */
function checkOverlap(a, b, x, y) {
    if (y < a || b < x) {
        return false;
    } else {
        return true;
    }
}

import moment from 'moment' // 时间处理插件
Vue.prototype.$moment = moment;
Vue.prototype.deepClone = deepClone;
Vue.prototype.formatDate = _formatDate;
Vue.prototype.delConfirm = delConfirm;
Vue.prototype.isEmptyObject = _isEmptyObject;
Vue.prototype.isBlank = isBlank;
Vue.prototype.convertToDate = convertToDate;
Vue.prototype.showTip = ShowTip;
Vue.prototype.showCenterTip = ShowCenterTip;
Vue.prototype.downloadFile = createAndDownloadFile;
Vue.prototype.formatSex = function convertSex(key) { return SEX[key] };
Vue.prototype.formaType = function convertType(key) { return TYPE[key] };
Vue.prototype.letterSeq = letterSeq;
Vue.prototype.getAge = getAge;
Vue.prototype.checkOverlap = checkOverlap;
