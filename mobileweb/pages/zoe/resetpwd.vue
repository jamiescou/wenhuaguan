<template>
    <section class="container signup-container">
        <div class="field-wrapper bg">
            <mt-field label="密 码" type="password" v-model="pswdForm.pswd" class="form-field"></mt-field>
            <mt-field label="重复密码" type="password" v-model="pswdForm.confirmpwd" class="form-field"></mt-field>
            <div class="hint">
                <span class="emphasize">*</span>密码为6-8位数字字母符号组合</div>
            <div class="operate-btns">
                <mt-button class="btn" type="primary" size="large" @click="resetPsw">确认修改</mt-button>
            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import rules from "~/util/validateRules";
import { toastMixin } from '~/components/mixins';
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    head() {
        return {
            title: '修改密码'
        }
    },
    data() {
        return {
            pswdForm: {
                pswd: '',
                confirmpwd: ''
            }
        };
    },
    methods: {
        async resetPsw() {
            if (!rules.required(this.pswdForm.pswd, '请输入密码！')) return false;
            if (!rules.required(this.pswdForm.confirmpwd, '请确认密码！')) return false;
            if (!rules.checkPass(this.pswdForm.pswd, this.pswdForm.confirmpwd)) return false;
            if (!rules.checkPassConfirm(this.pswdForm.pswd, this.pswdForm.confirmpwd)) return false;

            let data = {
                mobile: this.$store.state.user.mobile,
                newPwd: this.pswdForm.pswd
            };

            let res = await axios.post('/user/editpassword', data);
            if (res.data == '') {
                this.showMsg('修改成功');
                this.$router.push({ path: '/zoe' });
            } else {
                this.showMsg('修改失败');
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>