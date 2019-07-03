<template>
  <div id="app">
    <nuxt/>
    <div id="fixed-btn" ref="fixedBtn" v-finger:tap.stoppropagation="tap" v-finger:press-move.stoppropagation="pressMove.bind(this, 12)" v-finger:single-tap.stoppropagation="singleTap" v-finger:touch-start="touchStart" v-finger:touch-move="touchMove" v-finger:touch-end="touchEnd"></div>
    <v-overlayer v-model="popupVisible" :isTransparent="true" :overStyle="{zIndex:2000}">
      <mt-popup v-model="popupVisible" position="left" id="right-bar-panel">
        <div class="top-panel" ref="topPanel">
          <div class="face-panel">
            <div class="face" @click="handleClose">
              <nuxt-link :to="`/zoe`"><img :src="user ? user.pic : '/images/portrait.png'" onerror="this.src='/images/portrait.png'" alt="头像"></nuxt-link>
            </div>
          </div>
          <div class="nick-name">{{ user ? user.nickname : "游客在线" }}</div>
        </div>
        <div class="nav-panel" :style="{ height: navPanelHeight + 'px' }">
          <scroll ref="scroll" :mouseWheel="mouseWheel">
            <ul @click="handleClose">
              <nuxt-link :to="`${item.value}`" exact tag="li" v-for="item in navType" :key="item.value">
                <a v-html="item.label"></a>
              </nuxt-link>
            </ul>
          </scroll>
        </div>
        <!--<div @click="popupVisible = false" class="fixed-close-btn">-->
        <!--<i class="icon icon-chacha"></i>-->
        <!--</div>-->
      </mt-popup>
    </v-overlayer>
  </div>
</template>
<script type="text/javascript">
  import { mapState } from "vuex";
  import Scroll from '~/components/scroll'

  export default {
    components: {
      Scroll
    },
    head() {
      return {
        title: this.$store.getters.unit.name || '艺术馆'
      }
    },
    computed: {
      //draggable,
      ...mapState(['user']),
      volunteerPersonal() {
        var rolesType = null
        if (this.user && this.user.roles) {
          for (var i in this.user.roles) {
            if (this.user.roles[i] === "volunteerPersonal") {
              rolesType = '个人志愿者';
            }
          }
        }
        return rolesType;
      },
      volunteerTeam() {
        var rolesType = null
        if (this.user && this.user.roles) {
          for (var i in this.user.roles) {
            if (this.user.roles[i] === "volunteerTeam") {
              rolesType = '团队志愿者';
            }
          }
        }
        return rolesType;
      },
      realUser() {
        return (this.user && this.user.identifyStatus && this.user.identifyStatus === "Yes") ? '已实名' : '未实名'
      }
    },
    data() {
      return {
        popupVisible: false,
        mouseWheel: true,
        navPanelHeight: 0,
        fixedBtnPosition: {
          width: 0,
          height: 0,
          left: 0,
          minLeft: 0,
          maxLeft: 0,
          top: 0,
          minTop: 0,
          maxTop: 0,
          opacity: 0.8
        },
        navType: [
          { value: '/', label: '<span class="iconNew-rNav iconNew-shouye"></span>首页' },
          { value: '/information', label: '<span class="iconNew-rNav iconNew-neirong2"></span>资讯' },
          { value: '/vod', label: '<span class="iconNew-rNav iconNew-faxian"></span>直播点播' },
          { value: '/exhibition', label: '<span class="iconNew-rNav iconNew-shuzi"></span>数字展览' },
          { value: '/activity', label: '<span class="iconNew-rNav iconNew-huodongxiangqu"></span>活动预约' },
          { value: '/venue', label: '<span class="iconNew-rNav iconNew-shuzizhanguan"></span>场馆预订' },
          { value: '/train', label: '<span class="iconNew-rNav iconNew-youji"></span>培训报名' },
          { value: '/collect', label: '<span class="iconNew-rNav iconNew-jinnang"></span>作品征集' },
          { value: '/team', label: '<span class="iconNew-rNav iconNew-jieban"></span>文艺社团' },
          { value: '/heritage', label: '<span class="iconNew-rNav iconNew-anquanzhongxin"></span>文化非遗' },
          { value: '/volunteer', label: '<span class="iconNew-rNav iconNew-xihuan"></span>志愿服务' },
          { value: '/brand', label: '<span class="iconNew-rNav iconNew-wenhuapinpai"></span>文化品牌' },
          { value: '/zoe', label: '<span class="iconNew-rNav iconNew-shezhi"></span>个人中心' },
          { value: '/zoe/about', label: '<span class="iconNew-rNav iconNew-guanyuwomen"></span>关于我们' }
        ]
      }
    },
    async beforeCreate() {
      await this.$store.dispatch('clientInit');
    },
    async mounted() {
      await this.$store.dispatch('valid');
      this.$nextTick(() => {
        let el = this.$refs.fixedBtn;
        el.style.opacity = this.fixedBtnPosition.opacity;
        Transform(el);
        let containerW = (document.documentElement || document.body).offsetWidth;
        let containerH = (document.documentElement || document.body).offsetHeight;
        let rect = el.getBoundingClientRect();
        let width = parseInt(el.offsetWidth) || 0,
          height = parseInt(el.offsetHeight) || 0,
          left = parseInt(rect.left) || 0,
          top = parseInt(rect.top) || 0;

        this.fixedBtnPosition.width = width;
        this.fixedBtnPosition.height = height;
        this.fixedBtnPosition.left = left;
        this.fixedBtnPosition.minLeft = 0;
        this.fixedBtnPosition.maxLeft = left - (containerW - width - left);
        this.fixedBtnPosition.top = top;
        this.fixedBtnPosition.minTop = 0;
        this.fixedBtnPosition.maxTop = containerH - height;
      })
    },
    methods: {
      handleShow() {
        this.popupVisible = true;
        //计算侧边栏菜单高度
        this.$nextTick(() => {
          this.navPanelHeight = document.documentElement.clientHeight - this.$refs.topPanel.getBoundingClientRect().bottom;
          setTimeout(() => {
            this.$refs.scroll.refresh();
          }, 20)
        })
      },
      handleClose() {
        this.popupVisible = false
      },
      tap() { this.handleShow() },
      pressMove(num, evt) {
        this.$refs.fixedBtn.translateX += evt.deltaX;
        this.$refs.fixedBtn.translateY += evt.deltaY;
        evt.preventDefault();
      },
      singleTap() { this.handleShow() },
      touchStart() {
        let el = this.$refs.fixedBtn
        el.style.transition = 'none';
        el.style['-webkit-transition'] = 'none';
        el.style.opacity = '1';
      },
      touchMove() { },
      touchEnd() {
        let el = this.$refs.fixedBtn;
        let rect = el.getBoundingClientRect();
        let left = parseInt(rect.left) || 0,
          top = parseInt(rect.top) || 0;

        el.style.transition = 'all .5s';
        el.style['-webkit-transition'] = 'all .5s';
        el.style.opacity = this.fixedBtnPosition.opacity;
        if (left >= this.fixedBtnPosition.maxLeft) {
          el.translateX = -this.fixedBtnPosition.minLeft;
        } else if (left <= this.fixedBtnPosition.minLeft) {
          el.translateX = -this.fixedBtnPosition.maxLeft;
        }

        if (top >= this.fixedBtnPosition.maxTop) {
          el.translateY = this.fixedBtnPosition.maxTop - this.fixedBtnPosition.top - 20;
        } else if (top <= this.fixedBtnPosition.minTop) {
          el.translateY = - this.fixedBtnPosition.top + 20;
        }
      }
    }
  }
</script>


<style type="text/css" lang="scss" rel="stylesheet/scss">
  @import "~static/styles/base/variable";

  html,
  body {
    background-color: $body-bg;
  }
</style>
