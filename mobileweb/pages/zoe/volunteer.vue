<template>
    <section class="container zoe-orders">
        <mt-navbar v-model="currentTab" class="dd">
            <mt-tab-item id="current">当前志愿活动</mt-tab-item>
            <mt-tab-item id="history">历史志愿活动</mt-tab-item>
        </mt-navbar>
        <div class="split"></div>
        <mt-tab-container v-model="currentTab">
            <mt-tab-container-item id="current">
                <v-nodata msg="您还没有志愿活动订单！" v-if="!currentOrders.length && currentLoaded"></v-nodata>
                <div class="list-wraper" v-else>
                    <div v-for="item in currentOrders" :key="'cur_ord_'+item.id" class="order">
                        <div class="order-number clearfix">
                            <span class="pull-right time">{{item.applyTime}}</span>
                        </div>
                        <nuxt-link :to="`/volunteer/${item.volInfo.id}`" class="flex-item media-box">
                            <div class="cell fixed media-object">
                                <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                            </div>
                            <div class="cell media-bd">
                                <h4 class="media-title">{{item.recruitName}}</h4>
                                <div class="media-info bottom">
                                    <p>
                                        <i class="icon icon-clock"></i>{{ item.startTime + ' 至 ' + item.endTime }}</p>
                                    <p>
                                        <i class="icon icon-position"></i>{{item.volInfo.address}}</p>
                                </div>
                            </div>
                        </nuxt-link>
                        <div class="order-status flex-item">
                            <div class="cell fixed status">{{item.orderStatusName}}</div>
                        </div>
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="history" class="history">
                <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
                    <v-nodata v-if="loaded && !dataList.length" msg="您没有历史订单！"></v-nodata>
                    <div class="list-wraper" v-else>
                        <div v-for="item in dataList" :key="'his_ord_'+item.id" class="order">
                            <div class="order-number clearfix">
                                <span class="pull-right time">{{item.applyTime}}</span>
                            </div>
                            <nuxt-link :to="`/volunteer/${item.volInfo.id}`" class="flex-item media-box">
                                <div class="cell fixed media-object">
                                    <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                                </div>
                                <div class="cell media-bd">
                                    <h4 class="media-title">{{item.recruitName}}</h4>
                                    <div class="media-info bottom">
                                        <p>
                                            <i class="icon icon-clock"></i>{{ item.startTime + ' 至 ' + item.endTime }}</p>
                                        <p>
                                            <i class="icon icon-position"></i>{{item.volInfo.address}}</p>
                                    </div>
                                </div>
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="split"></div>
                </v-loadmore>
            </mt-tab-container-item>
        </mt-tab-container>
    </section>
</template>

<script>
import axios from "axios";
import loadmore from "~/components/loadmore";
import { paginationMixin } from "~/components/mixins";
export default {
    middleware: 'auth',
    head: {
        title: '志愿服务'
    },
    mixins: [paginationMixin],
    components: {
        "v-loadmore": loadmore
    },
    async created() {
        let currentOrders = await axios.get('/user/volunteer/current');
        this.currentOrders = currentOrders.data
        await this.loadData(0)
        this.currentLoaded = true
    },
    watch: {
        currentTab(val) {
            this.$nextTick(() => {
                if (val === 'history') {
                    this.$refs.loadMore.rebuildScroll();
                }
            })
        }
    },
    data() {
        return {
            currentTab: 'current',
            currentOrders: [],
            loadPath: '/user/volunteer/history/',
            currentLoaded: false
        };
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>