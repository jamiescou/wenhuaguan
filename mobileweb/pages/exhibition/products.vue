<template>
    <section class="container exhibition-detail">
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length" msg="暂无作品"></v-nodata>
            <div class="products" v-else>
                <div class="card-col-2">
                    <div class="card col-2" v-for="item in dataList" :key="item.id">
                        <div class="card-hd" @click="navWorkDetail(item.id)">
                            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
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
import loadmore from '~/components/loadmore';
import { paginationMixin } from '~/components/mixins';
import wechat from '~/util/wechat.js';

export default {
    head: {
        title: '展览作品'
    },
    mixins: [paginationMixin, wechat],
    components: {
        'v-loadmore': loadmore
    },
    async created() {
        this.id = this.$route.query.id;
        this.loadPath = '/exhibition/products/' + this.id + '/'
        await this.loadData(0)
    },
    methods: {
        navWorkDetail(workId) {
            this.$router.push({
                path: "/exhibition/workdetail",
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
 