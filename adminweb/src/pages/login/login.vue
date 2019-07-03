<template>
    <div class="login-container">
        <div class="login-content">
            <h3 class="title">文化馆数字平台管理系统</h3>
            <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-form">
                <el-form-item prop="username">
                    <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入帐号">
                        <template slot="prepend">
                            <i class="sz-ico ico-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="请输入密码">
                        <template slot="prepend">
                            <i class="sz-ico ico-lock"></i>
                        </template>
                    </el-input>
                </el-form-item>

                <div>
                    <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">{{btnText}}</el-button>

                </div>
                <router-link to="/sendpwd" class="forget-pwd">忘记密码</router-link>
                <!-- <a href="/setpwd.html" class="forget-pwd">忘记密码</a> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
import { TOKEN } from '@/stores/types'
export default {
    data() {
        return {
            loading: false,
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{
                    required: true,
                    message: '用户名不能为空！',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空！',
                    trigger: 'blur'
                }]
            }
        }
    },
    computed: {
        btnText() {
            if (this.loading) return '登录中...';
            return '登录';
        }
    },
    created() {
        localStorage.clear();
    },
    methods: {
        GetQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store.dispatch('Login', this.loginForm).then((res) => {
                        this.$emit('login', this.$router.currentRoute.query.from,this);
                        // this.loading = false
                    }).catch((e) => {
                        this.loading = false
                    });;
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "src/styles/_variables.scss";

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: $lg-bg-color;
  overflow: hidden;
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

  .login-content {
    $content-height: 512px;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    padding-top: 160px;
    margin-top: -($content-height / 2);
    height: $content-height;
    background: $lg-bg-color url(loginBg.jpg) no-repeat 50% 0;
  }
  .title {
    width: $login-form-w;
    padding-left: 30px;
    margin: 0 auto 40px auto;
    font-size: 20px;
    font-weight: 400;
    color: #fff;
  }

  .login-form {
    width: $login-form-w;
    padding: 20px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .el-form-item {
    margin-bottom: 28px;
    border: 1px solid $input-b-color;
    background: $input-bg;
    border-radius: 4px;
    color: $input-fc;
    .el-input__inner,
    .el-input-group__prepend {
      border: 0;
      background: none;
    }
    .el-input-group__prepend {
      border-right: 1px solid $input-b-color;
      padding: 0 15px;
      color: #cccccc;
    }
  }

  .forget-pwd {
    /*color: #fff;*/
    display: block;
    z-index: 5;
    margin-top: 10px;
    margin-bottom: 15px;
    color: #17e2ff;
    font-size: 1;
    text-align: right;
    &:hover {
      color: darken(#fff, 10%);
    }
  }
}
</style>
