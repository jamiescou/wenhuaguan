 
const config = require('../config')
const fs = require('fs')
const path = require('path')
class assist {
    getSave(objid, usersave) {
        for (let i = 0, len = usersave.length; i < len; i++) {
            if (objid === usersave[i].objectId) {
                let info = {
                    savestatus: true,
                    objid: usersave[i].id
                }
                return info;
            }
        }
        return false;
    }

    subTextLimit34(text) {
        return text.length > 34 ? text.substr(0, 34) + '......' : text
    }

    formateHtmlToText(html) {
        return html.replace(/<[^>]+>/g, "");
    }
    dateFormat(date, fmt) {
        if (date === undefined || date === null || date === '') return '';

        if (typeof date === 'string') {
            date = new Date(date);
        }

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
     * 获取年龄
     * @param {String} strBirthday 生日
     * @returns Age
     */
    getAge(strBirthday) {
        if (strBirthday === '') return '';

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
    
    /**
     * 删除文本中的换行符号
     */
    replaceTxtNLine(txt) {

        return txt?txt.replace(/[\r\n]/g, ""):txt
    }
    getBirthday(personIDNum) {
        var errMsg = [
            '请输入合法的身份证!',
            '身份证号码出生日期超出范围或含有非法字符!'
        ];
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
   
        var result = {
            birthday: '',
            sex: 0, // 女2，男1,0未知
            error: false,
            tipMsg: ''
        };
        if (!regIdCard.test(personIDNum)) {
            result.error = true;
            result.tipMsg = errMsg[0];
            return result;
        }
       
        var len = personIDNum.length;
        var re, year, month, day, sexno;
        if (len === 18) {

            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9,
                10, 5, 8, 4, 2);
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
            var idCardWiSum = 0;
            for (var i = 0; i < 17; i++) {
                idCardWiSum += personIDNum.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;
            var idCardlast = personIDNum.substring(17);
            if (idCardMod == 2) {
                if (idCardlast != "X" && idCardlast != "x") {
                    result.error = true;
                    result.tipMsg = errMsg[0];
                    return result;
                }
            } else {
                if (idCardlast != idCardY[idCardMod]) {
                    result.error = true;
                    result.tipMsg = errMsg[0];
                    return result;
                }
            }

            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/);
            var arrSplit = personIDNum.match(re);
            year = arrSplit[2];
            month = arrSplit[3];
            day = arrSplit[4];
            sexno = personIDNum.substring(16, 17);
        } else if (len === 15) {

            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = personIDNum.match(re);
            year = '19' + arrSplit[2];
            month = arrSplit[3];
            day = arrSplit[4];
            sexno = personIDNum.substring(14, 15);
        }
    
        var dtmBirth = new Date(year + '/' + month + '/' + day);
        var bGoodDay = (dtmBirth.getFullYear() === Number(year)) && ((dtmBirth.getMonth() + 1) === Number(month)) && (dtmBirth.getDate() === Number(day));
    
        if (!bGoodDay) {
            result.error = true;
            result.tipMsg = errMsg[1];
            return result;
        }
        
        var age=new Date().getFullYear()-year;
      
        result.age=age;
        result.birthday =(year + '-' + month + '-' + day) ;
        result.sex = sexno % 2 === 0 ? 2 : 1; // 女2，男1
        result.sexstr = sexno % 2 === 0 ? 'female' : 'male'; // 女2，男1
        return result;
    }

    /**
     * 修改图片url
     * @param {*} url 
     */
    getFileUrl(url) {
        if (url === null || url === undefined || url === '') return '';
        else if (url.indexOf('http') === 0) return url;
        return config.multiMediaServer.host + url;
      }

      mkdirsSync(dirname) {  
      
        if (fs.existsSync(dirname)) {  
            return true;  
        } else { 
            if (this.mkdirsSync(path.dirname(dirname))) {  
                fs.mkdirSync(dirname);  
                return true;  
            }  
        }  
    }  
      
    formateDateNumber(v){
        return v>=10?v:'0'+v
    }
}



module.exports = new assist()