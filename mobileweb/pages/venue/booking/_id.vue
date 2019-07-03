<template>
    <section class="container venues-pre">
        <div class="flex-item media-box detail">
            <div class="cell fixed media-object left">
                <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="cell  media-bd">
                <h4 class="media-title">{{detail.venue.name}}&minus; {{detail.name}}</h4>
                <p class="media-info brief">
                    {{ detail.brief }}
                </p>
            </div>
        </div>
        <div class="split"></div>
        <section class="itms">
            <div class="field-wrapper venue-pre">
                <mt-field label="日 期：" :value="roomPreInfo[0].itmDate" readonly class="form-field border-bottom" :disableClear="true"></mt-field>
                <div class="flex-item">
                    <div class="pre-item-title mint-cell-title">
                        <span class="mint-cell-text"> 场 次：</span>
                    </div>
                    <div class="cell pre-item-value">
                        <div v-for="(item,index) in roomPreInfo" :key="index">{{item.itmStarttime + '-' + item.itmEndtime}}</div>
                    </div>
                </div>
                <!-- <mt-field label="场 次：" :value="item.itmStarttime + '-' + item.itmEndtime" readonly v-for="(item,index) in roomPreInfo" :key="index" class="form-field letter border-bottom" :disableClear="true"></mt-field> -->
            </div>
        </section>
        <div class="split"></div>
        <section class="pre-info">
            <div class="field-wrapper venue-pre">
                <mt-field label="预定联系人：" :value="user.name" readonly class="form-field border-bottom" :disableClear="true"></mt-field>
                <mt-field label="联系人手机：" :value="user.mobile" readonly class="form-field border-bottom" :disableClear="true"></mt-field>
                <mt-field label="预 定 用 途：" v-model="desc" placeholder="请输入你的用途" type="textarea" rows="4" class="desc"></mt-field>
            </div>
        </section>
        <footer class="footer pre-footer" ref="footWrapper">
            <mt-button class="btn" @click='preset'>确定预订</mt-button>
        </footer>
    </section>
</template>

<script>
import axios from 'axios';
import { toastMixin } from '~/components/mixins';
import { mapState } from 'vuex'
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    head: {
        title: '活动室预订'
    },
    computed: {
        ...mapState([
            'user',
            'roomPreInfo'
        ])
    },
    data() {
        return {
            desc: '',
            detail: {}
        }
    },
    async asyncData({ params, error, store, redirect }) {
        if (!store.state.roomPreInfo || !store.state.roomPreInfo.length) {
            redirect('/venue/' + params.id);
            return;
        }
        let detailInfo = await axios.get('/venueroom/detail/' + params.id);
        return {
            detail: detailInfo.data
        }
    },
    methods: {
        async preset() {
            let items = this.roomPreInfo.map((x) => {
                return {
                    itmDate: x.itmDate,
                    itmStarttime: x.itmStarttime,
                    itmEndtime: x.itmEndtime
                }
            });
            let data = {
                roomId: this.detail.id,
                roomName: this.detail.name,
                itms: items,
                use: this.desc
            }
            let res = await axios.post('/venue/orders', data);
            debugger;
            if (res.status === 200 && res.data.success) {
                this.showMsg('预订成功');
                this.$router.replace('/preset?id=venue');
            } else {
                this.showMsg(res.message || '预订失败');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/venue.scss";
</style>
