<template>
    <section class="container hall-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="exhibition.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="card-bd">
                <h4 class="card-title"> {{exhibition.title}}</h4>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">展厅简介</h4>
        </div>
        <div class="hall-content">
            <p>{{exhibition.brief}}</p>
            <p>{{'联系电话：'+exhibition.contact}}</p>
            <p>{{'联 系 人：'+exhibition.phone}}</p>
            <p>{{'展厅地址：'+exhibition.address}}</p>
            <p>欢迎团体用户提前预约，我们可为您安排讲解及更好的服务。</p>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">展厅单元</h4>
        </div>
        <div class="unit-list card-col-2">
            <nuxt-link :to="`/heritage/hall/${item.id}`" class="card col-2" v-for="(item,index) in unit.content" :key="'unit_'+index">
                <div class="card-hd">
                    <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                </div>
                <div class="card-bd">
                    <h4 class="card-title"> 第 {{ index+1 }} 单元 &minus; {{item.name}}</h4>
                </div>
            </nuxt-link>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import wechat from '~/util/wechat.js';
export default {
    mixins: [wechat],
    layout: 'detail',
    head: {
        title: '非遗展厅'
    },
    async asyncData({ req, params }) {
        let hall = await axios.get('/heritage');
        return {
            exhibition: hall.data.exhibition,
            unit: hall.data.unit
        }
    },
    mounted() {
        this.wechatInit()
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/heritage.scss";
</style>