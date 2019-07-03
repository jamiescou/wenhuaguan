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
                <mt-button class="btn" type="primary" size="large" @click="submitMobile">下一步</mt-button>
            </div>
        </div>
    </section>
</template>
<script>
import axios from 'axios';
import md5 from 'md5';
import countdown from '~/components/countdown'
import rules from "~/util/validateRules"
import { toastMixin } from '~/components/mixins';
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    head: {
        title: '修改手机绑定'
    },
    components: {
        countdown
    },
    data() {
        return {
            pswdForm: {
                mobile: '',
                captcha: '',
            },
            disabled: false
        }
    },
    created() {
        this.pswdForm.mobile = this.$store.state.user.mobile;
    },
    methods: {
        async submitMobile() {
            if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
            if (!rules.required(this.pswdForm.captcha, '请输入验证码！')) return false;
            let { status, data } = await axios.post('/verifyVcodes', { mobile: this.pswdForm.mobile, code: this.pswdForm.captcha });
            if (status !== 200 || !data.success) {
                this.showMsg(data.message || '验证码错误')
            } else {
                let { status, data } = await axios.post('/user/userinfo', {
                    mobile: this.pswdForm.mobile,
                    id: this.$store.state.user.id
                });

                if (status === 200) {
                    this.showMsg('修改手机成功！')
                    await this.$store.dispatch('fetchUsers')
                    this.$router.push({ path: '/zoe/' });
                } else {
                    this.showMsg('修改手机失败，请重试！')
                }
            }
        },
        async handleSendCode() {
            if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
            if (!rules.checkPhone(this.pswdForm.mobile)) return false;
            var signStr = `mobile=${this.pswdForm.mobile}&flag=register` // md5校验
            let codeData = { mobile: this.pswdForm.mobile, state: 'newMobile', signStr: md5(signStr) };
            let { data } = await axios.post('/vcodes', codeData);
            if (data.success) {
                this.disabled = true;
                this.showMsg('验证码已发送至手机,请查收');
            } else {
                this.showMsg(data.message);
            }
        }
    }
}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>
        