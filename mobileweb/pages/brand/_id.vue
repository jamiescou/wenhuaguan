<template>
    <section class="container brand-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="card-bd">
                <h4 class="card-title"> {{detailInfo.name}}</h4>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">品牌描述</h4>
        </div>
        <div class="brief" v-html="detailInfo.describe"></div>

        <div class="split"></div>
        <mt-navbar v-model="currentTab" class="border-bottom project-nav">
            <mt-tab-item id="1" class="v-line">品牌视频</mt-tab-item>
            <mt-tab-item id="2" class="v-line">品牌纪实</mt-tab-item>
            <mt-tab-item id="3">品牌活动</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="currentTab" class="project-content">
            <mt-tab-container-item id="1" class="digitals">
                <div class="card-col-2" v-if="videos && videos.length>0">
                    <div class="card col-2" v-for="(item,index) in videos" :key="'video_'+index">
                        <div class="card-hd">
                            <video :poster="item.pic" controls>
                                <source :src="item.file">
                            </video>
                        </div>
                        <div class="card-bd">
                            <h4 class="card-title">{{item.name}}</h4>
                        </div>
                    </div>
                </div>
                <v-nodata msg="暂无品牌视频" v-else></v-nodata>
            </mt-tab-container-item>
            <mt-tab-container-item id="2" class="digitals">
                <div class="card-col-2" v-if="pics && pics.length>0">
                    <div class="col-2" v-for="(item,index) in pics" :key="'pic_'+index">
                        <div class="img-card">
                            <img :src="item.pic" onerror="this.onerror=null;this.src='/images/default.png'">
                            <h6 class="card-title">{{item.name}}</h6>
                        </div>
                    </div>
                </div>
                <v-nodata msg="暂无品牌纪实" v-else></v-nodata>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <template v-if="activitys.length>0">
                    <nuxt-link :to="`/activity/${item.id}`" class="flex-item media-box border-bottom" v-for="(item,index) in activitys" :key="'activity_'+index">
                        <div class="cell fixed media-object left">
                            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                        </div>
                        <div class="cell media-bd">
                            <h4 class="media-title">{{item.name}}</h4>
                            <div class="media-info bottom">
                                <p>
                                    <i class="icon icon-clock"></i>
                                    <span>{{item.holdStartDate}}&nbsp;至&nbsp;{{item.holdEndDate}}</span>
                                </p>
                                <p>
                                    <i class="icon icon-position"></i>
                                    <span>{{item.address}}</span>
                                </p>
                            </div>
                        </div>
                    </nuxt-link>
                    <div class="more border-top" v-if="newsList.length>0">
                        <nuxt-link :to="`/activity?brand=${detailInfo.id}`">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
                    </div>
                </template>
                <v-nodata msg="暂无相关活动" v-else></v-nodata>
            </mt-tab-container-item>
        </mt-tab-container>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">品牌资讯</h4>
        </div>
        <div class="news" v-if="newsList.length>0">
            <nuxt-link :to="`/information/${news.type}/${news.id}`" class="flex-item media-box border-bottom" v-for="(news,index) in curNews" :key="'new_'+index">
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
            <div class="more border-top" v-if="newsList.length>3 && !isMore" @click="isMore = true">
                查看更多&nbsp;&nbsp;&rarr;
            </div>
        </div>
        <v-nodata msg="暂无品牌资讯" v-else></v-nodata>

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
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'brand'}}">
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
        title: '品牌详情'
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get('/brand/detail/' + params.id);
        let news = await axios.get('/brand/news/' + params.id);
        let comments = await axios.get('/comments/brand/' + params.id + '/0?size=1');
        let digitals = await axios.get('/brand/digitals/' + params.id);
        let activitys = await axios.get("/activitys/0?size=4&brand=" + params.id);
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content,
            newsList: news.data,
            activitys: activitys.data.content,
            videos: digitals.data.video,
            pics: digitals.data.pic,
        };
    },
    data() {
        return {
            currentTab: '1',
            isMore: false,
            news: []
        }
    },
    computed: {
        curNews() {
            if (!this.isMore && this.newsList.length > 3) {
                return this.newsList.slice(0, 3);
            } else {
                return this.newsList
            }
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
@import "~static/styles/pages/brand.scss";
</style>