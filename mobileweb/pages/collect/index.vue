<template>
  <section class="container collect-container">
    <mt-navbar v-model="currentTab" class="dd">
      <mt-tab-item id="activity">作品征集</mt-tab-item>
      <mt-tab-item id="competition">群文艺术赛事</mt-tab-item>
    </mt-navbar>
    <div class="split"></div>
    <mt-tab-container v-model="currentTab">
      <mt-tab-container-item id="activity">
        <v-loadmore ref="activityMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
          <v-nodata v-if="!collects['activity'].content.length"></v-nodata>
          <div class="list-wraper" v-else>
            <nuxt-link :to="`/collect/${item.id}`" class="card" v-for="item in collects['activity'].content" :key="item.id">
              <div class="card-hd">
                <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
              </div>
              <div class="card-bd">
                <h4 class="card-title">{{item.name}}</h4>
                <p class="card-info desc">{{item.brief}}</p>
                <div class="card-info border-top favorite-reserve">
                  <div class="flex-item">
                    <v-favorite class="cell fixed" v-model="item.favorited" favType="ArtWorks" :objectId="item.id"></v-favorite>
                    <div class="cell reserve-tip">{{item.tag}}</div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </v-loadmore>
      </mt-tab-container-item>
      <mt-tab-container-item id="competition">
        <v-loadmore ref="competitionMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
          <div class="list-wraper" v-if="collects['competition'].content.length">
            <nuxt-link :to="`/collect/${item.id}`" class="card" v-for="item in collects['competition'].content" :key="item.id">
              <div class="card-hd">
                <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
              </div>
              <div class="card-bd">
                <h4 class="card-title">{{item.name}}</h4>
                <p class="card-info desc">{{item.brief}}</p>
                <div class="card-info border-top favorite-reserve">
                  <div class="flex-item">
                    <v-favorite class="cell fixed" v-model="item.favorited" favType="ArtWorks" :objectId="item.id"></v-favorite>
                    <div class="cell reserve-tip">{{item.tag}}</div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
          <v-nodata v-else></v-nodata>
          <div class="split"></div>
        </v-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>
  </section>
</template>

<script>
import axios from "axios";
import loadmore from '~/components/loadmore';
import favorite from '~/components/favorite.vue';
import wechat from '~/util/wechat.js';

export default {
  head: {
    title: '作品征集'
  },
  mixins: [wechat],
  components: {
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ req, params }) {
    let [aCollects, cCollects] = await Promise.all([
      axios.get('/collects/0'),
      axios.get('/collects/0?type=competition')
    ]);
    return {
      collects: { 'activity': aCollects.data, 'competition': cCollects.data }
    }
  },
  data() {
    return {
      currentTab: 'activity',
      collects: {
        'activity': { content: [], totalPages: 0, page: 0 },
        'competition': { content: [], totalPages: 0, page: 0 }
      }
    }
  },
  watch: {
    currentTab() {
      this.$nextTick(() => {
        this.$refs[this.currentTab + 'More'].rebuildScroll();
      })
    }
  },
  methods: {
    async loadData(pageNo) {
      let { data } = await axios.get('/collects/' + pageNo + '?type=' + this.currentTab);
      let DataList = data.content;
      if (pageNo === 0) {
        this.collects[this.currentTab].content = DataList;
      } else {
        this.collects[this.currentTab].content = this.collects[this.currentTab].content.concat(DataList);
      }
      this.collects[this.currentTab].totalPages = data.totalPages;
      this.$refs[this.currentTab + 'More'].forceUpdate(true)
        ;
    },
    // 加载更多
    handleLoadMore() {
      let totalPages = this.collects[this.currentTab].totalPages || 0;
      let page = this.collects[this.currentTab].page || 0;
      if (totalPages === 0 || totalPages === (page + 1)) {
        this.$refs[this.currentTab + 'More'].forceUpdate()
      } else {
        page += 1;
        this.collects[this.currentTab].page = page;
        this.loadData(page);
      }
    },
    // 刷新
    async handleRefresh() {
      await this.loadData(0);
      this.$refs[this.currentTab + 'More'].forceUpdate()
    }
  },
  mounted() {
    this.wechatInit()
  }
}
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/collect.scss";
</style>
 