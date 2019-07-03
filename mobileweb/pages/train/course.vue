<template>
    <section class="container train-schedule-container">
        <template>
            <div class="month-schedules flex-item" v-for="(month,key,index) in schedules" :key="index">
                <div class="cell fixed month">
                    <p> {{month.year}}</p>
                    <p> {{month.month}}</p>
                </div>
                <div class="cell schedules">
                    <div class="schedule-itm" :class="{'overdue':itm.overdue}" v-for="(itm,i) in month.items" :key="i">
                        <span>{{itm.itmDateStr}}</span>
                        <span>{{itm.itmTimeStr}}</span>
                    </div>
                </div>
            </div>
        </template>
    </section>
</template>

<script>
import axios from 'axios'
export default {
    head: {
        title: '课程表'
    },
    async asyncData({ params, error, req, query }) {
        let schedules = await axios.get('/train/schedule/' + query.id);
        return {
            schedules: schedules.data,
        };
    },
    data() {
        return {
            schedules: {}
        }
    },
    methods: {
        getHeight(length) {
            return length * 30 + 'px'
        }
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/train.scss";
</style>