<template>
    <div>
        <el-checkbox v-for="item in values" :label="item.code" :value="item.code" :key="item.code">{{item.value}}</el-checkbox>
    </div>
</template>

<script>
import Api from '@/api';
export default {
    props: {
        typeName: {
            type: String
        }
    },
    data: function() {
        return {
            values: []
        }
    },
    methods: {
        getCodeValue() {
            Api.system.getDicItem(this.typeName).then((res) => {
                this.values = res;
            })
        }
    },
    mounted() {
        this.getCodeValue();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>