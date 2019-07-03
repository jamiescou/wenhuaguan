<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '修改密码' }]"></v-pageheader>
        <el-row :gutter="20" style="padding-top:30px;">
            <el-col :span="12" :offset="6">
                <el-form :model="pwdForm" :rules="rules" ref="resetForm" label-width="150px">
                    <el-form-item label="输入原始密码：" prop="oriPwd">
                        <el-input type="password" v-model="pwdForm.oriPwd" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="输入新密码：" prop="newPwd">
                        <el-input type="password" v-model="pwdForm.newPwd" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码：" prop="confirmPwd">
                        <el-input type="password" v-model="pwdForm.confirmPwd" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('resetForm')">提交</el-button>
                        <el-button @click="resetForm('resetForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Api from '@/api';
export default {
    data() {
        let validatePass = (rule, value, callback) => {
            let msg = '密码必须是字母加数字且长度不小于6位';
            let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
            if (!regExp.test(value)) {
                callback(new Error(msg));
            }
            if (this.pwdForm.confirmPwd !== '') {
                this.$refs.resetForm.validateField('confirmPwd');
            }
            callback();
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pwdForm.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            pwdForm: {
                oriPwd: '',
                newPwd: '',
                confirmPwd: ''
            },
            rules: {
                oriPwd: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
                newPwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
                confirmPwd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let formData = {
                        'oldPwd': this.pwdForm.oriPwd,
                        'newPwd': this.pwdForm.newPwd
                    }
                    Api.system.editPassword(this.$store.state.user.info.orgUnit.id, this.$store.state.user.info.username, formData).then((res) => {
                        this.$refs[formName].resetFields();
                        this.callback();
                    });
                } else {
                    return false;
                }
            });
        },
        callback() {
            this.showTip();
            this.$router.replace('/');
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>