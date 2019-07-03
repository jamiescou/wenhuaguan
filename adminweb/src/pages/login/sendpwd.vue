<template>
  <div class="sendpwd-container">
    <el-form autoComplete="off" :model="pwdForm" :rules="rules" ref="resetForm" label-position="left" label-width="0px" class="reset-form">
      <div>
        <router-link to="/login" class="back-icon">
          <i class="el-icon-arrow-left"></i>
        </router-link>
        <h3 class="title">设置密码</h3>
      </div>
      <el-form-item prop="account">
        <el-input type="text" v-model="pwdForm.account" placeholder="帐号"></el-input>
      </el-form-item>
      <el-form-item prop="vcode">
        <el-input type="text" v-model="pwdForm.vcode" placeholder="验证码">
          <el-button slot="append" class="btn-vcode" :disabled="disabled || time > 0" @click.native.prevent="handleSendPWD">{{ text }}
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleFindPWD">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/api';
const msg = {
  OK: '操作成功',
  FAIL: '操作失败',
  towncode: '0000',
};
export default {
  data() {
    return {
      loading: false,
      second: 60,
      disabled: false,
      pwdForm: {
        account: '',
        identifier: '123',
        vcode: '',
        newPwd: '',
        confirmPwd: ''
      },
      rules: {
        account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        vcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      time: 0
    }
  },
  computed: {
    text: function() {
      return this.time > 0 ? this.time + 's 后重获取' : '获取验证码';
    }
  },
  methods: {
    start: function() {
      this.time = this.second;
      this.timer();
    },
    timer: function() {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      } else {
        this.disabled = false;
      }
    },
    stop: function() {
      this.time = 0;
      this.disabled = false;
    },
    handleSendPWD() {
      let self = this;
      self.disabled = true;
      self.$refs.resetForm.validateField('account', function(errorMsg) {
        if (errorMsg === '') {
          self.start(); //启动倒计时
          let loginId = self.pwdForm.account;
          Api.user.sendCode(loginId).then((res) => {
            self.$message.success('验证码已发送至手机,请查收');
            self.start(); //启动倒计时
          }).catch(self.stop);
        } else {
          self.disabled = false;
        }
      });
    },
    handleFindPWD() {
      let self = this;
      self.$refs['resetForm'].validate((valid) => {
        if (valid) {
          let loginId = self.pwdForm.account;
          Api.user.validateCode(loginId, self.pwdForm.vcode).then((res) => {
            if (res.success) {
              Api.user.resetPwd(loginId).then((res) => {
                this.$message({ showClose: true, message: msg['OK'], type: 'success' });
                this.$refs['resetForm'].resetFields();
                this.$router.push('/login')
              })
            } else {
              self.$message.error('验证码输入不正确');
            }
          });
        }
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/_variables.scss";
.sendpwd-container {
  height: 100vh;
  background-color: $lg-bg-color;
  padding: 120px 20px;
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: $placeholder-color;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: $placeholder-color;
  }

  input:-ms-input-placeholder {
    color: $placeholder-color;
  }

  input::-webkit-input-placeholder {
    color: $placeholder-color;
  }

  .back-icon {
    float: left;
    margin-top: 5px;
  }
  .reset-form {
    width: 450px;
    padding: 40px 30px;
    margin: 0 auto;
    background: #fff;
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .el-input-group__append {
    border: 0;
    .btn-vcode {
      color: #fff;
      background-color: #20a0ff;
      border: 1px solid #20a0ff;
      border-radius: 0 4px 4px 0;
      &.is-disabled {
        color: #fff;
        cursor: not-allowed;
        background: #8fc8f3 none;
        border-color: #8fc8f3;
      }
    }
  }
}
</style>
