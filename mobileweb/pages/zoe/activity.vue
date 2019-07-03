<template>
    <section class="container zoe-orders">
        <mt-navbar v-model="currentTab" class="dd">
            <mt-tab-item id="current">当前活动</mt-tab-item>
            <mt-tab-item id="history">历史活动</mt-tab-item>
        </mt-navbar>
        <div class="split"></div>
        <mt-tab-container v-model="currentTab">
            <mt-tab-container-item id="current">
                <v-nodata msg="您还没有活动订单！" v-if="!currentOrders.length && currentLoaded"></v-nodata>
                <div class="list-wraper" v-else>
                    <div v-for="item in currentOrders" :key="item.id" class="order">
                        <div class="order-number clearfix">
                            <span class="pull-left">订单号:{{item.orderCode}}</span>
                            <span class="pull-right time">{{item.createTime}}</span>
                        </div>
                        <nuxt-link :to="`/activity/${item.activityInfo.id}`" class="flex-item media-box">
                            <div class="cell fixed media-object">
                                <img :src="item.activityInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                            </div>
                            <div class="cell media-bd">
                                <h4 class="media-title">{{item.activityName}}</h4>
                                <div class="media-info">
                                    <p>
                                        <i class="icon icon-clock"></i>{{ item.itmDateTime }}</p>
                                    <p>
                                        <i class="icon icon-position"></i>{{item.activityAddress}}</p>
                                </div>
                            </div>
                        </nuxt-link>
                        <div class="pre-info border-top border-bottom">
                            <span v-for="(ticket, i) in item.seats" :key="'pre_'+i" class="tag">{{ticket.seatNo}}</span>
                        </div>
                        <div class="order-status flex-item">
                            <div class="cell fixed" :class="{'status':!item.isoverdue}">{{item.orderStatusName}}</div>
                            <div class="cell operate-btns">
                                <mt-button class="btn outline" v-if="hasCancel(item)" @click="showDialog(item)">退订</mt-button>
                                <mt-button class="btn outline" v-if="item.orderStatus==='canceled'" @click="orderDel(item)">删除</mt-button>
                                <mt-button class="btn" v-if="hasDrawn(item)" @click='onInrollClick(item)'>入场券</mt-button>
                            </div>
                        </div>
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="history" class="history">
                <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
                    <v-nodata v-if="loaded && !dataList.length" msg="您没有历史订单！"></v-nodata>
                    <div class="list-wraper" v-else>
                        <div v-for="item in dataList" :key="item.id" class="order">
                            <div class="order-number clearfix">
                                <span class="pull-left">订单号:{{item.orderCode}}</span>
                                <span class="pull-right time">{{item.createTime}}</span>
                            </div>
                            <nuxt-link :to="`/activity/${item.activityInfo.id}`" class="flex-item media-box">
                                <div class="cell fixed media-object">
                                    <img :src="item.activityInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                                </div>
                                <div class="cell media-bd">
                                    <h4 class="media-title">{{item.activityName}}</h4>
                                    <div class="media-info">
                                        <p>
                                            <i class="icon icon-clock"></i>{{ item.itmDateTime }}</p>
                                        <p>
                                            <i class="icon icon-position"></i>{{item.activityAddress}}</p>
                                    </div>
                                </div>
                            </nuxt-link>
                            <div class="pre-info border-top border-bottom">
                                <span v-for="(ticket, i) in item.seats" :key="'pre_'+i" class="tag">{{ticket.seatNo}}</span>
                            </div>
                        </div>
                    </div>
                </v-loadmore>
            </mt-tab-container-item>
        </mt-tab-container>
        <div class="split"></div>
        <mt-popup v-model="popupRefund" position="bottom" popup-transition="popup-fade" class="popup-refund">
            <div class="edit-wrapper">
                <div class="resion-eidt">
                    <textarea rows="8" v-model="cancelOrder.reason" placeholder="请输入退订理由" class="form-textarea"></textarea>
                    <mt-button class="btn" @click="orderCancel">退订</mt-button>
                    <mt-button class="btn outline" @click="popupRefund=false">取消</mt-button>
                </div>
            </div>
        </mt-popup>

        <mt-popup v-model="popupVisible" popup-transition="popup-fade" :closeOnClickModal="false" class="pop-code">
            <div class="border-bottom drawnCode">
                取票码
                <p class="emphasize">{{curAct.drawnCode}}</p>
            </div>
            <div v-swiper:mySwiper="swiperOption" class="swipe-codes">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in curAct.seats" :key="curAct.id + index">
                        <qrcode :value="item.code" :size="500"></qrcode>
                        <p class="emphasize">{{item.seatNo}}</p>
                    </div>
                </div>
                <div class="j-loop swiper-pagination round-bullets gray"></div>
            </div>
            <!-- <qrcode :value="qrcodeInfo" :size="500"></qrcode> -->
            <p>请向工作人员出示二维码进行验票</p>
            <div class="opres">
                <div class="line"></div>
                <i class="icon icon-times-circle" @click="popupVisible = false"></i>
            </div>
        </mt-popup>
    </section>
</template>

<script>
import axios from "axios";
import loadmore from "~/components/loadmore";
import { toastMixin, paginationMixin } from "~/components/mixins";
import Qrcode from '~/components/qrcode'
import rules from "~/util/validateRules";
export default {
    middleware: "auth",
    mixins: [toastMixin, paginationMixin],
    components: {
        "v-loadmore": loadmore,
        Qrcode
    },
    head: {
        title: '我的活动'
    },
    data() {
        return {
            currentTab: 'current',
            currentOrders: [],
            curAct: { drawnCode: '', seats: [] },
            popupVisible: false,
            popupRefund: false,
            cancelOrder: { id: '', reason: '' },
            loadPath: '/user/activity/history/',
            currentLoaded: false,
            swiperOption: {
                // loop: true
                pagination: {
                    el: '.j-loop',
                    bulletActiveClass: 'bullet-active'
                }
            }
        };
    },
    async created() {
        await this.loadCurrent();
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
    methods: {
        // 是否有取票码
        hasDrawn(item) {
            return !(item.orderStatus === 'canceled' || item.isoverdue);
        },
        // 是否有取消（退订）操作
        hasCancel(item) {
            return item.orderStatus === 'reserved' && !item.isoverdue && item.usedSeats == 0
        },
        async loadCurrent() {
            let currentOrders = await axios.get("/user/activity/current");
            this.currentOrders = currentOrders.data
        },

        showDialog(order) {
            this.cancelOrder = {
                id: order.id,
                reason: ""
            };
            this.popupRefund = true;
        },
        // 退订
        async orderCancel(item) {
            if (!rules.required(this.cancelOrder.reason, '请输入退订理由')) return;
            let info = {
                orderid: this.cancelOrder.id,
                reason: this.cancelOrder.reason
            };

            let { status, data } = await axios.post("/activity/cancel", info);
            if (data.success) {
                this.showMsg('退订成功');
                if (this.currentTab === 'current') {
                    await this.loadCurrent();
                } else {
                    this.loadData(this.page);
                }
            } else {
                this.showMsg(data.message);
            }
            this.popupRefund = false;
        },
        async orderDel(order) {
            this.confirm('是否删除该订单？', async () => {
                let { status, data } = await axios.post("/activity/del/" + order.id);
                if (data.success) {
                    this.showMsg('删除成功');
                    if (this.currentTab === 'current') {
                        await this.loadCurrent();
                    } else {
                        this.loadData(this.page);
                    }
                } else {
                    this.showMsg(data.message);
                }
            });
        },
        // 生成二维码信息
        onInrollClick(item) {
            this.curAct = item;
            this.popupVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>