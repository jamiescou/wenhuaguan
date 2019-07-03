<template>
  <section class="container heritage-container">
    <div class="list-wraper">
      <nuxt-link to='/heritage/hall' class="img-item">
        <img src='/images/heritage-hall.png'>
        <div class="center">
          <span class="box-content">
            <div class="icon-box">
              <img src="/images/hall.png">
            </div>
            <div class="img-item-title">非遗展厅</div>
          </span>
        </div>
      </nuxt-link>
      <nuxt-link to='/heritage/map' class="img-item">
        <img src='/images/heritage-map.png'>
        <div class="center">
          <span class="box-content">
            <div class="icon-box">
              <img src="/images/map.png">
            </div>
            <div class="img-item-title">非遗地图</div>
          </span>
        </div>
      </nuxt-link>

      <nuxt-link to='/heritage/resource' class="img-item">
        <img src='/images/heritage-resource.png'>
        <div class="center">
          <span class="box-content">
            <div class="icon-box">
              <img src="/images/resource.png">
            </div>
            <div class="img-item-title">非遗资源</div>
          </span>
        </div>
      </nuxt-link>

      <nuxt-link to='/heritage/information' class="img-item">
        <img src='/images/heritage-informat.png'>
        <div class="center">
          <span class="box-content">
            <div class="icon-box">
              <img src="/images/informat.png">
            </div>
            <div class="img-item-title">非遗资讯</div>
          </span>
        </div>
      </nuxt-link>
    </div>
  </section>
</template>
<script>
import wechat from '~/util/wechat.js';
export default {
  mixins: [wechat],
  head: {
    title: '非遗保护'
  },
  mounted() {
    this.wechatInit()
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/heritage.scss";
</style>