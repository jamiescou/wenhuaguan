export function getBirthday(personIDNum) {
    let result = {
        birthday: '',
        sex: 'unkown', // 女female，男male,unkown未知
        error: false,
        tipMsg: ''
    };

    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
   
    var idnumber = personIDNum;
    if (regIdCard.test(idnumber)) {
        if (idnumber.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9,
                10, 5, 8, 4, 2);
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
            var idCardWiSum = 0;
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idnumber.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;
            var idCardlast = idnumber.substring(17);
            if (idCardMod == 2) {
                if (idCardlast != "X" && idCardlast != "x") {
                    result.error = true;
                }
            } else {
                if (idCardlast != idCardY[idCardMod]) {
                    result.error = true;
                }
            }
        }
    } else {
        result.error = true;
    }
    if (result.error) {
        result.tipMsg = '请输入合法的身份证号!';
        return result;
    }

    // var errMsg = [
    //     '请输入合法的身份证!',
    //     '身份证号码出生日期超出范围或含有非法字符!'
    // ];
    let noPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!noPattern.test(personIDNum)) {
        result.error = true;
        // result.tipMsg = errMsg[0];
        return result;
    }
    let len = personIDNum.length;
    let re, year, month, day, sexno;
    if (len === 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/);
        let arrSplit = personIDNum.match(re);
        year = arrSplit[2];
        month = arrSplit[3];
        day = arrSplit[4];
        sexno = personIDNum.substring(16, 17);
    } else if (len === 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        let arrSplit = personIDNum.match(re);
        year = '19' + arrSplit[2];
        month = arrSplit[3];
        day = arrSplit[4];
        sexno = personIDNum.substring(14, 15);
    }

    let dtmBirth = new Date(year + '/' + month + '/' + day);
    let bGoodDay = (dtmBirth.getFullYear() === Number(year)) && ((dtmBirth.getMonth() + 1) === Number(month)) && (dtmBirth.getDate() === Number(day));

    if (!bGoodDay) {
        result.error = true;
        // result.tipMsg = errMsg[1];
        return result;
    }

    result.birthday = dtmBirth;
    result.sex = sexno % 2 === 0 ? 'female' : 'male';
    return result;
}
