<template>
    <div>
        <el-option :key="venue.id" :label="venue.name" :value="venue.id" v-for="venue in venues"></el-option>
    </div>
</template>

<script>
import Api from '@/api';
export default {
    data() {
        return {
            venues: []
        }
    },
    methods: {
    },
    mounted() {
         // 获取场馆
        let orgUnit = this.$store.getters.user.orgUnit;
        let str = 'searchUnitId,isPublish:true';
        Api.venue.getVenueList(str, 1, -1).then((res) => {
            this.venues = res.content;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
