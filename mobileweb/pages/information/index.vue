<template>
    <section class="container issue-container">
        <tab>
            <tab-item :selected="index===0" v-for="(item, index) in infocolumns" @on-item-click="onItemClick(item)" :key="index">{{item.name}}</tab-item>
        </tab>
        <div class="split"></div>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length"></v-nodata>
            <div class="list-wraper" v-else>
                <nuxt-link :to="`/information/${news.type}/${news.id}`" class="flex-item media-box" v-for="news in dataList" :key="news.id">
                    <div class="cell media-bd">
                        <h4 class="media-title">{{news.title}}</h4>
                        <!--<div class="card-scan"><span class="iconNew-scan"></span>{{news.pageView}}</div>-->
                        <p class="media-info bottom">
                            {{news.publishTime}}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{news.source}}
                        </p>
                    </div>
                    <div class="cell fixed media-object">
                        <img v-lazy="news.coverPic" onerror="this.src='/images/default.png'">
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
    mixins: [paginationMixin, wechat],
    head: {
        title: '文化资讯'
    },
    components: {
        'v-loadmore': loadmore,
        Tab,
        TabItem
    },
    async created() {
        let columns = await axios.get("/columns/tops");
        this.infocolumns = columns.data;
        this.loadData(0);
    },
    data() {
        return {
            infocolumns: [],
            loadPath: '/information/'
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
