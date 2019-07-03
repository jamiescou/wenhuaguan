<template>
  <section class="container message-container">
    <section class="message-entry">
      <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
        <v-nodata v-if="loaded && !dataList.length" msg="当前还没有系统消息~"></v-nodata>
        <div class="message" v-else>
          <ul v-for="item in dataList" :key="item.id">
            <li>
              <i class="icon icon-lingdang"></i>
              <div class="info-panel">
                <h2>{{item.name}}</h2>
                <p class="time">{{item.createTime}}</p>
                <div class="message-panel">
                  {{item.content}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </v-loadmore>
    </section>
    <div class="split"></div>
  </section>
</template>
<script>
import loadmore from "~/components/loadmore";
import { paginationMixin } from "~/components/mixins";
import { mapState } from 'vuex'
export default {
  middleware: "auth",
  mixins: [paginationMixin],
  components: {
    "v-loadmore": loadmore
  },
  head: {
    title: '系统消息'
  },
  data() {
    return {
      loadPath: '/user/message/current/'
    };
  },
  async beforeMount() {
    await this.loadData(0);
  },
  methods: {
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/zoe.scss";
</style>

