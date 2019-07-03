var assist = {
    showMsg: function(msg, type) {
        $().toastmessage('showToast', {
            text: msg,
            sticky: false,
            inEffectDuration: 300, // in effect duration in miliseconds
            stayTime: 1000,
            position: 'middle-center',
            type: type || 'notice' //success  notice  error  warning
        });
    },
    verifyPswd: function(pswd) {
        var regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,50}$/;
        if (!regExp.test(pswd)) {
            return {
                success: false,
                msg: '密码为至少8位的数字和字母组合'
            }
        } else {
            return {
                success: true,
                msg: ''
            }
        }
    },
      /**
     * 删除文本中的换行符号
     */
    replaceTxtNLine:function(txt) {
        return txt?txt.replace(/[\r\n]/g, ""):txt
    },
    
    verifyMobile: function(value, msg) {
        var regExp = /^1[34578]\d{9}$/;
        if (!regExp.test(value)) {
            this.showMsg(msg);
            return false;
        }
        return true;
    },
    required: function(value, msg) {
        var spacePattern = /^\s+$/;
        var hasSpace = spacePattern.test(value);
        if (value == null || value.length == 0 || hasSpace) {
            this.showMsg(msg);
            return false;
        }
        return true;
    },
    formateDateNumber: function(v) {
        return v > 10 ? v : '0' + v
    },
    /**
     * 倒计时
     * @param  {Object}   selector      选择器
     * @param  {number}   waitTime      等待时间，单位毫秒
     * @param  {Function} callback 回调函数，调用远程接口
     * @return {[type]}            [description]
     */
    count_down: function(selector, waitTime, callback) {
        var time = Math.ceil(waitTime / 1000),
            self = $(selector),
            disabledClass = 'disabled';
        if (self.hasClass('disabled'))
            return;


        self.addClass(disabledClass).html(time + 's重新发送');
        var timer = setInterval(function() {
            if (time > 1) {
                time--;
                self.html(time + 's重新发送');
            } else {
                clearInterval(timer);
                self
                    .removeClass(disabledClass)
                    .html('获取验证码');
            }
        }, 1000);

        if (typeof callback === 'function') {
            callback();
        }
    },
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




}


function initClamp($rsTexts) {
    $rsTexts.each(function() {
        var rstext = '',
            dataparam = '',
            charnum = 150,
            subStr = '',
            textLength = 0,
            $riseSwitch = null,
            $shrinkSwitch = null,
            $temp = $('<div></div>'),
            riseSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-riseswitch">展开<span>︾</span></span>',
            shrinkSwitchHtml = '<span class="u-rstext-switch" data-as="rstext-shrinkswitch">收起<span>︽</span></span>';

        $riseSwitch = $(this).find('[data-as="rstext-riseswitch"]');
        $shrinkSwitch = $(this).find('[data-as="rstext-shrinkswitch"]');

        //如果存在自定义的展开开关，获取其对应的html
        if ($riseSwitch.length > 0) {
            $temp.append($riseSwitch);
            riseSwitchHtml = $temp.html();
        }

        //如果存在自定义的关闭开关，获取其对应的html
        if ($shrinkSwitch.length > 0) {
            $temp = $('<div></div>');
            $temp.append($shrinkSwitch);
            shrinkSwitchHtml = $temp.html();
        }

        rstext = $(this).html();
        textLength = rstext.length;
        dataparam = $(this).data('param');

        //如果指定了限制字符数且指定的字符数能转换为整数就用指定的字符数作限制字符数，否则默认最多显示200个字符
      
        if (typeof dataparam != "undefined") {
            charnum = isNaN(parseInt(dataparam)) ? 200 : parseInt(dataparam);
        }

        //仅当文本字符数大于限制字符个数时，才显示切换开关
        if (textLength > charnum) {
            subStr = rstext.substring(0, charnum);
            $(this).html(subStr + '...' );
        }

  
    });
};

//图片出错处理
$(document).ready(function() {
    $("img").each(function(index, img) {
        // console.log($(img).attr('src'))
        if (!$(img).attr('src') && $(img).data('type') != 'upload') {
            if ($(img).data('type') == 'portrait') {

                $(img).attr('src', '/images/portrait.png')
            } else {
                $(img).attr('src', '/images/img404.png')
            }

        }
    })
    $("img").on('error', function() {
        var imgType = $(this).data('type');
        if (imgType == 'portrait') {
          
            $(this).attr('src', '/images/portrait.png')
        } else if ($(this).data('type') != 'upload') {
            $(this).attr('src', '/images/img404.png')
        }
    })
    


    var $rsTexts = $('[data-as="clamp"]');
    //当页面存在收缩文本,对升缩文本进行初始化
    if ($rsTexts.length > 0) {
         initClamp($rsTexts);
    }
})

function noImg() {
    var img = event.srcElement;
    img.src = '/images/img404.png';
    img.onerror = null;
}