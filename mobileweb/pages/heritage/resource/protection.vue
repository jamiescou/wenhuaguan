<template>
    <section class="container project-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="card-bd">
                <h4 class="card-title"> {{detailInfo.name}}</h4>
                <p class="card-info">
                    {{ detailInfo.levelName }}
                </p>
            </div>
        </div>
        <div class="split"></div>
        <mt-navbar v-model="currentTab" class="border-bottom project-nav">
            <mt-tab-item id="1" class="v-line">保护区介绍</mt-tab-item>
            <mt-tab-item id="2" class="v-line">非遗项目</mt-tab-item>
            <mt-tab-item id="3">代表性传承人</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="currentTab" class="project-content">
            <mt-tab-container-item id="1">
                <div class="remark" v-html="detailInfo.remark"></div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <div class="digits-list card-col-2" v-if="detailInfo.projects && detailInfo.projects.length">
                    <nuxt-link :to="`/heritage/resource/project?id=${item.id}`" class="card col-2" v-for="(item,index) in detailInfo.projects" :key="'digits_'+index">
                        <div class="card-hd">
                            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                        </div>
                        <div class="card-bd">
                            <h4 class="card-title">{{item.name}}</h4>
                        </div>
                        <p class="card-info">
                            {{ item.levelName }}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{item.batchName}}
                        </p>
                    </nuxt-link>
                </div>
                <v-nodata msg="暂无相关非遗项目" v-else></v-nodata>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <template v-if="detailInfo.successors && detailInfo.successors.length">
                    <nuxt-link :to="`/heritage/resource/successor?id=${item.id}`" class="flex-item successor border-bottom" v-for="(item,index) in detailInfo.successors" :key="'successor_'+index">
                        <div class="cell fixed">
                            <img :src='item.coverPic' onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
                        </div>
                        <h4 class="cell name">{{item.name}}</h4>
                        <span class="cell fixed">
                            <i class="icon icon-angle-left"></i>
                        </span>
                    </nuxt-link>
                </template>
                <v-nodata msg="暂无代表性传承人" v-else></v-nodata>
            </mt-tab-container-item>
        </mt-tab-container>
        <div class="split"></div>
        <div class="comments">
            <div class="block-heading">
                <h4 class="title">评论列表</h4>
            </div>
            <div class="comment" v-if="comments.length">
                <div class="flex-item">
                    <div class="cell fixed">
                        <img :src='comments[0].pic' onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
                    </div>
                    <h4 class="cell nickname">{{comments[0].nickname}}</h4>
                    <span class="cell fixed time">{{comments[0].time}}</span>
                </div>
                <p class="c-content">{{comments[0].content}}</p>
            </div>
            <v-nodata msg="还没有评论，快去评论吧(☄⊙ω⊙)☄" class="no-data" v-else></v-nodata>
            <div class="more border-top">
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'protection'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>
        </div>
        <div class="split"></div>
    </section>
</template>

<script>
import axios from "axios";
import wechat from '~/util/wechat.js';

export default {
    layout: 'detail',
    mixins: [wechat],
    head: {
        title: '非遗保护区'
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get('/protection/detail/' + query.id);
        let comments = await axios.get('/comments/protection/' + query.id + '/0?size=1');
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content
        };
    },
    data() {
        return {
            currentTab: '1'
        }
    },
    mounted() {
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.shareOpts.desc = this.detailInfo.brief
        this.wechatInit()
    }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/heritage.scss";
</style>