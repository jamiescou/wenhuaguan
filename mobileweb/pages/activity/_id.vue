<template>
    <section class="container activity-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap" v-html="detailInfo.activityTypeName">
                </div>
            </div>
            <div class="card-bd">
                <!--<div class="flex-item">-->
                <!--<div class="cell reserve-tip">-->
                <h4 class="card-title"> {{detailInfo.name}}</h4>
                <div class="card-scan"><span class="iconNew-scan"></span>{{detailInfo.pageView}}</div>
                <span class="remain-type" v-if="detailInfo.reserve!==1">{{detailInfo.reserveMsg}}</span>
                <template v-else>
                    <span class="remain">
                        <em class="remain-num">{{detailInfo.remainTicket}}</em> 余票 </span>
                </template>
                <!--</div>-->
                <!--<v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="Activity" :objectId="detailInfo.id"></v-favorite>-->
                <!--</div>-->

            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-clock"></i>
            </div>
            <div class="cell">
                {{detailInfo.holdStartDate}}
            </div>
            <div class="cell fixed right-addon">
                <span class="num">{{detailInfo.itms && detailInfo.itms.length ? '共' + detailInfo.itms.length + '场':''}}</span>
                <!-- <i  class="icon icon-angle-left"></i> -->
            </div>
        </div>

        <div class="flex-item desc-list border-bottom" v-if="detailInfo.address" @click="openMapCallback">
            <div class="cell fixed addon">
                <i class="icon icon-position"></i>
            </div>
            <div class="cell">{{detailInfo.address}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
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
        <div class="block-heading">
            <h4 class="title">活动简介</h4>
        </div>
        <div class="brief">
            {{detailInfo.brief}}
        </div>

        <div class="split"></div>
        <template v-if="detailInfo.attach && detailInfo.attachName">
            <div class="block-heading">
                <h4 class="title">相关附件</h4>
            </div>
            <div class="flex-item desc-list" @click="dowload(detailInfo.attach)">
                <div class="cell attach-name">{{detailInfo.attachName}}</div>
                <a class="cell fixed">
                    <i class="icon icon-angle-left"></i>
                </a>
            </div>
        </template>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">问卷调查</h4>
        </div>
        <nuxt-link class="flex-item desc-list attach" :to="'/activity/research?id='+detailInfo.id">
            <div class="cell">
                {{detailInfo.name}}问卷调查
            </div>
            <span class="cell fixed">
                <i class="icon icon-angle-left"></i>
            </span>
        </nuxt-link>

        <div class="split"></div>
        <mt-navbar v-model="currentTab" class="border-bottom project-nav">
            <mt-tab-item id="1" class="v-line">活动详情</mt-tab-item>
            <mt-tab-item id="2" class="v-line">活动纪实</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="currentTab" class="activity-content">
            <mt-tab-container-item id="1">
                <div class="remark" v-html="detailInfo.desc"></div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <div class="digits-list card-col-2" v-if="detailInfo.digitinfos && detailInfo.digitinfos.length">
                    <div class="card col-2" v-for="(item,index) in detailInfo.digitinfos" :key="'digits_'+index">
                        <div class="card-hd">
                            <template v-if="item.type=='audio'">
                                <audio :src="item.file" controls>
                                </audio>
                            </template>
                            <template v-if="item.type=='video'">
                                <video :poster="item.pic" controls>
                                    <source :src="item.file">
                                </video>
                            </template>
                            <template v-if="item.type=='pic'">
                                <img :src="item.pic" onerror="this.onerror=null;this.src='/images/default.png'">
                            </template>
                        </div>
                        <div class="card-bd">
                            <h4 class="card-title" style="width: auto;">{{item.name}}</h4>
                        </div>
                    </div>
                </div>
                <v-nodata msg="暂无活动纪实" v-else></v-nodata>
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
            <!--<div class="more border-top">
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'activity'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>-->
        </div>
        <div class="split"></div>
        <!--<footer class="footer pre-footer" ref="footWrapper">
            <mt-button class="btn" v-if="detailInfo.isAuthenticate&&user&&user.identifyStatus!='Yes'">请先完成实名认证</mt-button>
            <mt-button class="btn go" v-else-if="detailInfo.reserve === 2">{{detailInfo.reserveMsg}}</mt-button>
            <mt-button class="btn" v-else-if="detailInfo.reserve === 1" @click="showPopup">{{detailInfo.reserveMsg}}</mt-button>
            <mt-button class="btn end" v-else>{{detailInfo.reserveMsg}}</mt-button>
        </footer>-->

        <div class="footBtnWrapWc" style="height: 0;">
            <div class="footBtnWrap clearfix">
                <v-favorite class="fBtn" v-model="detailInfo.favorited" favType="Activity" :objectId="detailInfo.id"></v-favorite>
                <v-share></v-share>
                <nuxt-link class="fBtn" :to="{path: '/comments/'+detailInfo.id,query:{type:'activity'}}"><span class="iconNew iconNew-comment"></span>评论</nuxt-link>
                <div class="fOrder real" v-if="detailInfo.isAuthenticate&&user&&user.identifyStatus!='Yes'" @click='goVerify'>请先完成实名认证</div>
                <div class="fOrder" v-else-if="detailInfo.reserve === 2">{{detailInfo.reserveMsg}}</div>
                <div class="fOrder" v-else-if="detailInfo.reserve === 1" @click="showPopup">{{detailInfo.reserveMsg}}</div>
                <div class="fOrder end" v-else>{{detailInfo.reserveMsg}}</div>
            </div>
        </div>

        <mt-popup v-model="isShow" position="bottom" class="act-pre-schedule" v-if="detailInfo.reserve === 1">
            <mt-picker :slots="slots" valueKey="content" :itemHeight="100" @change="onValuesChange"></mt-picker>
            <div class="operations">
                <mt-button class="btn" @click='onConfirmClick'>确定</mt-button>
            </div>
        </mt-popup>
        <v-overlayer v-model="isShowTip" :overStyle="{zIndex:200}">
            <div class="shareHelp" style=" text-align:right;padding-right:60px;">
                <img src="/images/mask.png" alt="提示">
            </div>
        </v-overlayer>
    </section>
</template>

<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
import { mapState } from 'vuex'
import wechat, { openMap } from '~/util/wechat.js';

import favorite from '~/components/favorite.vue';
import share from '~/components/share.vue';

export default {
    layout: 'detail',
    mixins: [toastMixin, wechat],
    head: {
        title: '活动详情'
    },
    components: {
        'v-favorite': favorite,
        'v-share': share
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get('/activity/detail/' + params.id);
        let comments = await axios.get('/comments/activity/' + params.id + '/0?size=1')
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content
        };
    },
    data() {
        return {
            currentTab: '1',
            isShow: false,
            isShowTip: false,
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'm-picker-slot',
                    textAlign: 'center'
                }
            ],
            selectedItm: undefined
        }
    },
    methods: {
        showPopup() {
            if (!this.$store.state.user) {
                this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
                return;
            }

            this.isShow = true;
        },
        onValuesChange(picker, values) {
            if (values === undefined) return;
            this.selectedItm = values[0]
        },
        goVerify(){
            this.$router.replace({ path: "/zoe/authentication", query: { redirect: this.$route.fullPath } }); 
        },
        dowload(url) {
            let ua = navigator.userAgent.toLowerCase();
            ua = ua.indexOf('micromessenger') !== -1;
            if (ua) {
                this.isShowTip = true;
            } else {
                window.location.href = url;
            }
        },
        onConfirmClick() {
            if (!this.selectedItm || this.selectedItm.overDue) {
                this.showMsg('该场次已结束，请选择其他场次');
                return;
            }
            if (this.selectedItm.remainTicket === 0) {
                this.showMsg('该场次已定完，请选择其他场次');
                return;
            }

            if (this.detailInfo.reserveType === 'free') {
                this.$router.push({
                    path: '/activity/free/' + this.detailInfo.id,
                    query: {
                        id: this.selectedItm.id
                    }
                })
            } else if (this.detailInfo.reserveType === 'online') {
                this.$router.push({
                    path: '/activity/online/' + this.detailInfo.id,
                    query: {
                        id: this.selectedItm.id
                    }
                })
            }
        },
        openMapCallback() {
            var href = window.location.href;
            var lat = this.detailInfo.coordinate.latitude;
            var lng = this.detailInfo.coordinate.longitude;
            openMap({
                latitude: lat,
                longitude: lng,
                name: this.detailInfo.name,
                address: this.detailInfo.address,
                href: href
            })
        }
    },
    async beforeMount() {
        this.slots[0].values = this.detailInfo.itms;
        if (this.user && this.user.id) {
            await this.$store.dispatch('fetchUsers'); // 更新用户新
        }
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.shareOpts.desc = this.detailInfo.brief
        await this.wechatInit()
    },
    // async created() {
    //     this.shareOpts.imgUrl = this.detailInfo.coverPic
    //     this.shareOpts.title = this.detailInfo.name
    //     this.shareOpts.desc = this.detailInfo.brief
    //     console.log('this.shareOpts===========>>>', this.shareOpts)
    //     await this.wechatInit()
    // },
    // async mounted() {
    //     this.shareOpts.imgUrl = this.detailInfo.coverPic
    //     this.shareOpts.title = this.detailInfo.name
    //     this.shareOpts.desc = this.detailInfo.brief
    //     console.log('this.shareOpts===========>>>', this.shareOpts)
    //     await this.wechatInit()
    // }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/activity.scss";
</style>
