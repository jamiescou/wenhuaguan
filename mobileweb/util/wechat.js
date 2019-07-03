export default {
    data() {
        return {
            signature: null,
            signatureUrl: null,
            shareOpts: {
                title: '', // 分享标题
                desc: '', // 分享描述
                link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: () => {
                    // 用户确认分享后执行的回调函数
                    this.$toast({
                        message: '分享成功',
                        className: 'toast-tip '
                    })
                },
                cancel: () => {
                    // 用户取消分享后执行的回调函数
                    this.$toast({
                        message: '取消分享',
                        className: 'toast-tip '
                    })
                },
                fail: function(res) {
                    console.log(res);
                    // alert(JSON.stringify(res));
                }
            }
        }
    },

    beforeMount() {
        this.shareOpts.link = location.protocol + '//' + location.host + this.$route.fullPath
        this.shareOpts.imgUrl = this.$store.getters.unit.logoPic;
        this.shareOpts.title = document.title
    },
    methods: {
        isWeChat() {
            var ua = navigator.userAgent.toLowerCase();
            var isWeixin = ua.indexOf('micromessenger') != -1;
            if (isWeixin) {
                return true;
            } else {
                return false;
            }
        },
        isIOS() {
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            return isiOS
        },
        //  jssdk的在每一次url变化的时候都需要重新config,每一个跳转一个页面都需要重新去进行config,
        async wechatInit() {
            console.log('分享内容', this.shareOpts)
            if (!this.isWeChat()) {
                console.log('请在微信中打开当前页面')
                return
            }

            let url = window.location.href
            if (!this.$store.getters.enterUrl) {
                url = encodeURIComponent(url)
                this.$store.commit('SET_URL', url)
            }

            if (this.isIOS()) {
                url = this.$store.getters.enterUrl
            }

            if (this.signature && url === this.signatureUrl) {
                console.log('已初始化签名')
            } else {
                const res = await this.$store.dispatch('getWechatSignature', url)
                const { data, success } = res.data
                if (!success) throw new Error('不能成功获取服务器签名！')

                // alert('签名地址：' + data.url + '\r\n当前地址：' + url)
                // if (data.url !== url) { // 判断路由是否已经变化
                //     alert('签名URL与当前页面URL不一致')
                //     return
                // }

                this.signature = data
                console.log('signature=============>>', data)
                this.signatureUrl = url
            }

            const wx = window.wx

            wx.config({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                // debug: true,
                appId: this.signature.appId, // 必填，公众号的唯一标识
                timestamp: this.signature.timestamp, // 必填，生成签名的时间戳
                nonceStr: this.signature.noncestr, // 必填，生成签名的随机串
                signature: this.signature.signature, // 必填，签名，见附录1
                jsApiList: [
                'openLocation',
                'getLocation',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
              ]
            })

            wx.ready(() => {
                this.shareOpts.imgUrl = encodeURI(this.shareOpts.imgUrl)
                wx.onMenuShareTimeline(this.shareOpts) // 分享到朋友圈
                wx.onMenuShareAppMessage(this.shareOpts) // 分享给朋友
            })
            wx.error(p => {
                // window.alert(JSON.stringify(p))
            })
        },
        wxShare(title, desc, link, imgUrl) {
            const wx = window.wx
            wx.ready(() => {
                let shareOption = Object.assign({}, this.shareOpts)
                shareOption.title = title // 分享标题
                shareOption.desc = desc // 分享描述
                shareOption.link = link // 分享链接 默认以当前链接
                shareOption.imgUrl = imgUrl // 分享图标
                wx.onMenuShareTimeline(shareOption) // 分享到朋友圈
                wx.onMenuShareAppMessage(shareOption) // 分享给朋友
            })
        },
        openMap(options) {
            if (!this.isWeChat()) {
                console.log('请在微信中打开当前页面')
                return
            }

            const wx = window.wx
            wx.ready(() => {
                let info = {
                    latitude: Number(options.latitude),
                    longitude: Number(options.longitude),
                    name: options.name,
                    address: options.address,
                    scale: 16,
                    infoUrl: options.href,
                    success: function() {
                        // alert('地图调用成功');
                    },
                    fail: function(err) {
                        // alert('地图调用失败')
                        // alert(JSON.stringify(err))
                    }
                }
                wx.openLocation(info)
            })
        }
    }
}

export function openMap(options) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') != -1) {
        //使用微信内置地图查看位置接口
        let info = {
            latitude: Number(options.latitude),
            longitude: Number(options.longitude),
            name: options.name,
            address: options.address,
            scale: 16,
            infoUrl: options.href,
            success: function() {
                // alert('地图调用成功');
            },
            fail: function(err) {
                // alert('地图调用失败')
                // alert(JSON.stringify(err))
            }
        }
        window.wx.openLocation(info);
    } else {
        // alert('非微信')
    }
}

/**
 *获取位置信息
 *
 * @export
 * @param {*} callback 回调函数
 */
export async function getLocation(callback) {
    let that = this;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') != -1) {
        await window.wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function(res) {
                let location = {
                    latitude: res.latitude,
                    longitude: res.longitude,
                    speed: res.speed,
                    accuracy: res.accuracy
                }
                callback(location);
            },
            cancel: function(res) {
                alert('用户拒绝授权获取地理位置');
            },
            fail: function() {
                alert("未能获取地理位置！首先检查手机是否启用微信定位。");
            }
        });
    }
}
