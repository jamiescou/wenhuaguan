<template>
    <div class="blank-panel">
        <img src="/images/no-result.png" alt="">
        <div class="u-hint">{{msg}}</div>
    </div>
</template>
<script>
export default {
    props: {
        msg: {
            type: String,
            default: '没有搜索到相关内容'
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/components/nodata";
</style>