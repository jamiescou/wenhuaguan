<template>
    <section class="container issue-container">
        <tab>
            <tab-item :selected="index===0" v-for="(item, index) in infocolumns" @on-item-click="onItemClick(item)" :key="index">{{item.name}}</tab-item>
        </tab>
        <div class="split"></div>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length"></v-nodata>
            <div class="list-wraper" v-else>
                <nuxt-link :to="`/heritage/information/${news.type}/${news.id}`" class="flex-item media-box" v-for="news in dataList" :key="news.id">
                    <div class="cell media-bd">
                        <h4 class="media-title">{{news.title}}</h4>
                        <p class="media-info bottom">
                            {{news.publishTime}}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{news.source}}
                        </p>
                    </div>
                    <div class="cell fixed media-object">
                        <img :src="news.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                    </div>
                </nuxt-link>
            </div>
            <div class="split"></div>
        </v-loadmore>
    </section>
</template>

<script>
import axios from "axios";
import loadmore from '~/components/loadmore';
import { paginationMixin } from '~/components/mixins';
import { Tab, TabItem } from '~/components/tab'
import wechat from '~/util/wechat.js';

export default {
    head: {
        title: '非遗资讯'
    },
    mixins: [paginationMixin, wechat],
    components: {
        Tab,
        TabItem,
        'v-loadmore': loadmore
    },
    async created() {
        let columns = await axios.get("/heritage/columns");
        this.infocolumns = columns.data;
        this.loadData(0);
    },
    data() {
        return {
            infocolumns: [],
            currentColumn: 'all',
            loadPath: '/heritageNews/'
        }
    },
    methods: {
        onItemClick(tab) {
            this.search = 'column=' + tab.id;
            this.loadData(0);
        }
    },
    mounted() {
        this.wechatInit()
    }
}
</script>


<style scoped lang="scss">
@import "~static/styles/pages/issue.scss";
</style>
