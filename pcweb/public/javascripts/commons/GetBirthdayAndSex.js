function getBirthday(personIDNum) {
    var errMsg = [
        '请输入合法的身份证!',
        '身份证号码出生日期超出范围或含有非法字符!'
    ];
    var noPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var result = {
        birthday: '',
        sex: 'unkown', // 女female，男male
        error: false,
        tipMsg: ''
    };
    if (!noPattern.test(personIDNum)) {
        result.error = true;
        result.tipMsg = errMsg[0];
        return result;
    }
    var len = personIDNum.length;
    var re, year, month, day, sexno;
    if (len === 18) {
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

    result.birthday =(year + '-' + month + '-' + day) ;
    result.sex = sexno % 2 === 0 ? 'female' : 'male'; // 女2，男1
    return result;
}
