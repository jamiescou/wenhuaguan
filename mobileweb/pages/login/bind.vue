<template >
    <section class="container signup-container">
        <div class="field-wrapper bg">
            <mt-field label="手机号 +86" type="tel" v-model="pswdForm.mobile" class="form-field">
                <mt-button type="primary" class="captcha-btn" :disabled="disabled" @click.native.prevent="handleSendCode">
                    <countdown :start="disabled" @on-finish="disabled = false"></countdown>
                </mt-button>
            </mt-field>
            <mt-field label="验证码" v-model="pswdForm.captcha" class="form-field"></mt-field>
            <div class="operate-btns">
                <mt-button class="btn" type="primary" size="large" @click="verifyCode">下一步</mt-button>
            </div>
        </div>
    </section>
</template>
<script>
import axios from "axios";
import md5 from 'md5';
import rules from "~/util/validateRules";
import countdown from '~/components/countdown'
import { toastMixin } from '~/components/mixins';
import { mapState } from "vuex";
export default {
    mixins: [toastMixin],
    head: {
        title: '绑定帐号'
    },
    components: {
        countdown
    },
    computed: {
        ...mapState(['weAuth'])
    },
    data() {
        return {
            pswdForm: {
                mobile: '',
                captcha: ''
            },
            disabled: false
        };
    },
    asyncData({ store, redirect }) {
        if (!store.state.weAuth) {
            redirect('/login');
            return;
        }
    },
    methods: {
        async verifyCode() {
            if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
            if (!rules.required(this.pswdForm.captcha, '请输入验证码！')) return false;
            let authInfo = this.weAuth;

            let info = {
                mobile: this.pswdForm.mobile,
                code: this.pswdForm.captcha,
                wechartInfo: {
                    bindWeixin: true,
                    binds: [{
                        type: 'weixin',
                        account: authInfo.unionid
                    }]
                }
            }
            let { status, data } = await axios.post('/user/bindAccount', info);
            if (status === 200 && data.success) {
                this.showMsg('绑定成功')
                this.$store.commit('SET_USER', data.user)
                this.$router.replace('/zoe');
            } else {
                this.showMsg(data.message || '验证码错误')
            }
        },

        async handleSendCode() {
            if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
            if (!rules.checkPhone(this.pswdForm.mobile)) return false;
            var signStr = `mobile=${this.pswdForm.mobile}&flag=register` // md5校验
            let data = { mobile: this.pswdForm.mobile, state: 'registedMobile', signStr: md5(signStr) };
            let code = await axios.post('/vcodes', data);
            if (code.data.success) {
                this.disabled = true;
                this.showMsg('验证码已发送至手机,请查收');
            } else {
                this.showMsg(code.data.message);
            }
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>