<template>
    <header>
        <div class="head">
            <div class="brand" @click="goHome">
                <!-- <img :src="user && user.logo" alt="" class="logo"> -->
                <h4 class="title">{{user && user.orgUnit.name}}数字平台管理系统</h4>
            </div>
            <div class="userinfo">
                <span class="head-menu use-name">
                    <i class="sz-ico ico-user"></i> {{user && user.name}}</span>
                <span class="split-line"></span>
                <router-link to="/resetpwd" class="head-menu">修改密码</router-link>
                <span @click='logoutDirect' class="head-menu logo-out">退出</span>
            </div>
        </div>
    </header>
</template>
<script>
import { LOGOUT } from '@/stores/types'
export default {
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        // 退出登录，清除权限，回到登录页
        logoutDirect() {
            this.$store.dispatch(LOGOUT)
            this.$root.menuData = {};
            this.$router.replace({ path: '/login' });
        //    location.reload()
        },
        goHome() {
            this.$router.push('/home')
        }
    },

}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "src/styles/_variables.scss";
@import "src/styles/mixin.scss";
.head {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  z-index: $head-zindex;
  height: $head-height;
  overflow: hidden;
  padding: 0 15px;
  color: $head-fc;
  background-color: $head-bg;
  @include clearfix;

  .brand {
    float: left;
    cursor: pointer;
    .logo {
      display: inline-block;
      height: $head-height - 10px;
      margin-top: 5px;
      margin-right: 5px;
      vertical-align: top;
    }
    .title {
      display: inline-block;
      margin: 0;
      font-size: $head-brand-fs;
      line-height: $head-height;
      text-align: center;
      font-weight: normal;
    }
  }

  .userinfo {
    float: right;
    padding-right: 20px;
    line-height: $head-height;
    text-align: right;
    font-size: $head-fs;
    .head-menu {
      display: inline-block;
      vertical-align: middle;
      color: $head-fc;
      text-decoration: none;
      .sz-ico,
      .user-name {
        vertical-align: middle;
      }
    }
    .split-line {
      display: inline-block;
      height: $head-fs;
      width: 1px;
      line-height: $head-height;
      vertical-align: middle;
      background-color: $head-fc;
      margin-left: 8px;
      margin-right: 8px;
    }
    .logo-out {
      cursor: pointer;
      margin-left: 20px;
      color: darken($head-fc, 20%);
    }
  }
}
</style>
