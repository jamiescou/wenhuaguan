<template>
    <el-pagination v-show="isShow" @current-change="onCurrentChange" :page-size="size" layout="total, prev, pager, next" :total="total">
    </el-pagination>
</template>
<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        size: {
            type: Number,
            default: 15
        },
        total: {
            type: Number,
            default: 0
        }
    },
    methods: {
        onCurrentChange(page) {
            this.$emit('pageChange', page);
        }
    }
}
</script>
