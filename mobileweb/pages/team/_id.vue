<template>
    <section class="container team-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap" v-html="detailInfo.artTypeName">
                </div>
            </div>
            <div class="card-bd">
                <div class="flex-item">
                    <div class="cell reserve-tip">
                        <h4 class="card-title">{{detailInfo.name}}</h4>
                    </div>
                    <v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="ArtTeam" :objectId="detailInfo.id"></v-favorite>
                </div>

            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-user"></i>
            </div>
            <div class="cell">
                {{detailInfo.contactName}}
            </div>
        </div>

        <div class="flex-item desc-list border-bottom" v-if="detailInfo.address">
            <div class="cell fixed addon">
                <i class="icon icon-position"></i>
            </div>
            <div class="cell">{{detailInfo.address}}</div>
        </div>

        <div class="flex-item desc-list" v-if="detailInfo.contactPhone" @click="callPhone(detailInfo.contactPhone)">
            <div class="cell fixed addon">
                <i class="icon icon-phone"></i>
            </div>
            <div class="cell">{{detailInfo.contactPhone}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>
        <div class="split"></div>
        <mt-navbar v-model="currentTab" class="border-bottom project-nav">
            <mt-tab-item id="1" class="v-line">团队详情</mt-tab-item>
            <mt-tab-item id="2" class="v-line">团队风采</mt-tab-item>
            <mt-tab-item id="3">团队成员</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="currentTab" class="project-content">
            <mt-tab-container-item id="1" class="brief">
                <div v-html="detailInfo.desc"></div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2" class="digitals">
                <template v-if="styles && styles.length>0">
                    <div class="digital border-bottom" v-for="(item,index) in styles" :key="'style_'+index">
                        <h4 class="title clearfix">{{item.title}}
                            <span class="time pull-right">{{item.createTime}}</span>
                        </h4>
                        <h4 class="content">{{item.content}}</h4>
                        <div class="file-wrapper" v-if="item.files && item.files.length>0">
                            <img :src="file.filePath" onerror="this.onerror=null;this.src='/images/default.png'" class="file col-3" v-for="(file,i) in item.files" :key="'file_'+index+'_'+i">
                        </div>
                    </div>
                </template>
                <v-nodata msg="暂无团队风采" v-else></v-nodata>
            </mt-tab-container-item>
            <mt-tab-container-item id="3" class="members">
                <template v-if="members && members.length>0">
                    <div class="img-card member col-4" v-for="(item,index) in members" :key="'member_'+index">
                        <img :src='item.coverPic' onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
                        <h6 class="caption">{{item.name}}</h6>
                    </div>
                </template>
                <v-nodata msg="暂无团队成员" v-else></v-nodata>
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
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'team'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>
        </div>
        <div class="split"></div>
    </section>
</template>

<script>
import axios from "axios";
import favorite from '~/components/favorite.vue';
import { toastMixin } from '~/components/mixins';
import wechat from '~/util/wechat.js';

export default {
    mixins: [toastMixin, wechat],
    layout: 'detail',
    head: {
        title: '团队详情'
    },
    components: {
        'v-favorite': favorite
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get('/team/detail/' + params.id);
        let comments = await axios.get('/comments/team/' + params.id + '/0?size=1')
        let members = await axios.get('/team/members/' + params.id)
        let styles = await axios.get('/team/styles/' + params.id)
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content,
            members: members.data,
            styles: styles.data
        };
    },
    mounted() {
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.wechatInit()
    },
    data() {
        return {
            currentTab: '1'
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/team.scss";
</style>