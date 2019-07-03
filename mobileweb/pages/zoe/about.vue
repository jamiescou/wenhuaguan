<template>
  <section class="container about-container">
    <div class="about-content">
      <div class="logo">
        <img :src="unit.logoPic" alt="logo" onerror="this.onerror=null;this.src='/images/logo.png'" />
      </div>
      <p>
        湖南省文化馆是一个聚合中国传统、促进文化交流的互联网平台，它不仅提供全国一流的文化场馆信息，包含大量电影、曲艺、讲座、舞蹈、歌剧、等文化活动资讯，提供最热门的文化活动预订，建立最全的文化大师交流渠道，更能让用户足不出户的了解天下，参与云上文化活动，引领品质生活，从文化云开始
      </p>
    </div>
  </section>
</template>
<script>

import { mapState } from 'vuex'
export default {
  head: {
    title: '关于我们'
  },
  computed: {
    ...mapState([
      'unit'
    ])
  },
  data() {
    return {};
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/zoe.scss";
</style>
       
        