<template>
    <section class="container train-schedule-container sign-container">
        <div class="month-schedules flex-item" v-for="(month,key,index) in schedules" :key="index">
            <div class="cell fixed month">
                <p> {{month.year}}</p>
                <p> {{month.month}}</p>
            </div>
            <div class="cell schedules">
                <div class="schedule-itm" :class="{'overdue':itm.overdue}" v-for="(itm,i) in month.items" :key="i">
                    <span>{{itm.itmDateStr}}</span>
                    <span>{{itm.itmTimeStr}}</span>
                    <mt-button class="btn end" v-if="hadSign(itm)">已签到</mt-button>
                    <mt-button class="btn" v-else-if="itm.enableSign" @click="handleSign(itm)">签到</mt-button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { toastMixin } from "~/components/mixins"
import wechat, { getLocation } from '~/util/wechat.js'
export default {
    middleware: 'auth',
    mixins: [toastMixin, wechat],
    head: {
        title: '培训签到'
    },
    computed: {
        ...mapState({
            'trainOrder': 'currentTrain'
        })
    },
    async created() {
        if (!this.trainOrder || !this.trainOrder.users) {
            this.$router.replace('/zoe/train');
        }
        const id = this.$route.query.id
        this.trainId = id;
        let schedules = await axios.get('/train/schedule/' + id);
        this.schedules = schedules.data;
    },
    async mounted() {
        await this.wechatInit()
    },
    data() {
        return {
            schedules: {},
            trainId: ''
        }
    },
    methods: {
        // 通过经纬度获取距离(单位：米)   
        getDistance(lat1, lng1, lat2, lng2) {
            let radLat1 = lat1 * Math.PI / 180.0;
            let radLat2 = lat2 * Math.PI / 180.0;
            let radLng1 = lng1 * Math.PI / 180.0;
            let radLng2 = lng2 * Math.PI / 180.0;
            let a = radLat1 - radLat2; //两点纬度之差
            let b = radLng1 - radLng2; //经度之差
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
                + Math.cos(radLat1) * Math.cos(radLat2)
                * Math.pow(Math.sin(b / 2), 2))); // 计算两点距离的公式
            s = s * 6378.137;// 弧长乘地球半径（半径为千米）
            s = Math.round(s * 10000) / 10000; // 精确距离的数值
            s = s * 1000;
            return s;
        },
        hadSign(itm) {
            if (!this.trainOrder || !this.trainOrder.signList) return;
            for (const sign of this.trainOrder.signList) {
                if (sign.itmDate == itm.itmDate && sign.startTime == itm.startTime && sign.endTime == itm.endTime) {
                    return true;
                }
            }
            return false;
        },
        async handleSign(itm) {
            // TODO:地域范围
            let self = this;
            await getLocation(async (location) => {
                if (!location) {
                    this.showMsg('请检查是否启用了微信定位');
                    return
                } else {
                    let lng1 = this.trainOrder.coordinate.longitude
                    let lat1 = this.trainOrder.coordinate.latitude
                    let distance = this.getDistance(lat1, lng1, location.latitude, location.longitude);
                    // alert('与签到地址的距离：' + distance + '米')
                    if (distance > 1000) {
                        this.showMsg('您所在位置不在签到范围内');
                        return;
                    }
                }
                let info = {
                    "itmDate": itm.itmDate,
                    "startTime": itm.startTime,
                    "endTime": itm.endTime,
                    "students": this.trainOrder.users
                }
                let { status, data } = await axios.post('/train/sign/' + this.trainId, info);
                if (data.success) {
                    this.showMsg('签到成功');
                    this.$store.dispatch('updateCurrentTrain', {
                        id: this.trainOrder.id,
                        sign: {
                            "itmDate": itm.itmDate,
                            "startTime": itm.startTime,
                            "endTime": itm.endTime,
                            "isSign": true
                        }
                    })
                    // this.$router.replace('/zoe/train');
                } else {
                    this.showMsg(data.message);
                }
            });
        }
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/train.scss";
</style>
