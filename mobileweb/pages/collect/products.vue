<template>
  <section class="container exhibition-detail">
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length" msg="暂无作品"></v-nodata>
      <div class="products" v-else>
        <div class="card-col-2">
          <div class="card col-2" v-for="item in dataList" :key="item.id">
            <div class="card-hd" @click="navWorkDetail(item.id)" :style='`background:url(${item.files[0].filePath}) center;background-size:cover`' >

             
            </div>
            <div class="card-bd">
              <h4 class="card-title">{{item.title}}</h4>
            </div>
          </div>
        </div>
      </div>
    </v-loadmore>
  </section>

</template>
<script>
import axios from "axios";
import loadmore from "~/components/loadmore";
import { paginationMixin } from "~/components/mixins";
import wechat from '~/util/wechat.js';

export default {
  head: {
    title: "征集作品"
  },
  mixins: [paginationMixin, wechat],
  components: {
    "v-loadmore": loadmore
  },
  data() {
    return {
      loadPath: '/collect/works/lst/'
    };
  },
  async created() {
    this.id = this.$route.query.id;
    this.search = 'id=' + this.id;
    await this.loadData(0)
  },
  methods: {
    navWorkDetail(workId) {
      this.$router.push({
        path: "/collect/workdetail",
        query: { workId: workId, activityId: this.id }
      });
    }
  },
  mounted() {
    this.wechatInit()
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/exhibition.scss";
</style>
 