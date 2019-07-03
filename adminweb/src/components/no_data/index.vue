<template>
    <div class="m-nodata">
        <!--<img src="css/images/no-data.png" alt="暂无数据">-->
        <p class="tip-msg">{{tipMsg}}</p>
    </div>
</template>

<script>
    export default{
        props: {
            tipMsg: {
                type: String,
                default: '暂无数据'
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .m-nodata {
        $bg-position-y: 30px;
        $bg-w:101px;
        $bg-h:87px;
        min-width:$bg-w;
        min-height:$bg-h;
        background: #fff url('nodata.png') no-repeat 50% $bg-position-y;
        background-size: $bg-w $bg-h;
        padding-top: ($bg-h + $bg-position-y * 2);
        .tip-msg {
            text-align: center;
            line-height: 24px;
            font-size: 16px;
            color: #bfbfbf;
        }
    }
</style>