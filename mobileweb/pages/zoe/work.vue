<template>
    <section class="container zoe-orders">
        <div class="split"></div>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length" msg="您还没有作品发布！"></v-nodata>
            <div class="list-wraper" v-else>
                <div v-for="item in dataList" :key="'ord_'+item.id" class="order">
                    <div class="order-number clearfix">
                        <span class="pull-left title">{{item.activity.name}}</span>
                        <span class="pull-right time">{{item.createTime}}</span>
                    </div>
                    <nuxt-link :to="`/collect/${item.activity.id}`" class="flex-item media-box">
                        <div class="cell fixed media-object">
                            <img v-lazy="item.files[0].filePath" onerror="this.onerror=null;this.src='/images/default.png'">
                        </div>
                        <div class="cell media-bd">
                            <h4 class="media-title">{{item.title}}</h4>
                            <div class="media-info brief bottom">
                                <p>{{ item.brief }}</p>
                            </div>
                        </div>
                    </nuxt-link>

                    <div class="order-status flex-item border-top">
                        <div class="cell fixed status">{{item.orderStatusName}}</div>
                        <div class="cell operate-btns">
                        </div>
                    </div>
                </div>
                <div class="split"></div>
            </div>
        </v-loadmore>
    </section>
</template>

<script>
import axios from "axios";
import loadmore from "~/components/loadmore";
import { paginationMixin } from "~/components/mixins";
export default {
    head: {
        title: '我的作品'
    },
    middleware: 'auth',
    mixins: [paginationMixin],
    components: {
        'v-loadmore': loadmore
    },
    async created() {
        this.loadData(0);
    },
    data() {
        return {
            loadPath: '/user/works/'
        };
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>
