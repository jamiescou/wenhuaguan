<template>
    <div v-if="optType==='select'">
        <el-option v-for="item in values" :label="item.value" :value="item.code" :key="item.code">
        </el-option>
    </div>
    <div v-else-if="optType==='check'">
        <el-checkbox v-for="item in values" :label="item.code" :value="item.code" :key="item.code">{{item.value}}</el-checkbox>
    </div>
    <div v-else-if="optType==='radio'">
        <el-radio v-for="item in values" :label="item.code" :value="item.code" :key="item.code">{{item.value}}</el-radio>
    </div>
</template>

<script>
// import Api from '@/api';
export default {
    props: {
        typeName: {
            type: String
        },
        optType: {
            type: String,
            default: 'select'
        }
    },
    data: function() {
        return {
            values: []
        }
    },
    created() {
        this.dicts.dictInit(this.typeName);
    },
    methods: {
        getCodeValue() {
            let result = this.$store.getters.dicts[this.typeName];
            if (result) {
                this.values = result;
            } else {
                this.$store.dispatch('ADD_DICT', this.typeName).then((res) => {
                    this.values = res;
                });
            }
            // Api.system.getDicItem(this.typeName).then((res) => {
            //     this.values = res;
            // })
        }
    },
    mounted() {
        this.getCodeValue();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>