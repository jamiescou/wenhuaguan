<template>
    <div class="columnChart" style="width:100%;">

        <div ref="echart" class="main" style="width:100%;"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    props: {
        RegistRecource: {
            type: Object,
            default: {},
            deep: true
        }
    },
    watch: {
        RegistRecource: {
            handler: function(newVal, oldVal) {
                this.loadData();
            },
            deep: true
        }
    },
    data() {
        return {
            myChart: {},
             id: Math.random().toString(16).substring(2) + '_echart',
            option: {
                title: {
                    text: '',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'center',
                    left: 'right',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                color:['#62d1de','#54d6b6','#a6db69','#C7754C','#17BDB8','#85802B','#d1d1d1','#73C774','#17BDB8','#17BDB8','#85802B','#d1d1d1'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                            { value: 1548, name: '搜索引擎' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    },
    methods: {
        loadData() {
             this.myChart.showLoading();
            this.$nextTick(() => {               
                this.option.series[0].data = this.RegistRecource.list;
                this.option.legend.data = this.RegistRecource.legenddata;
                this.option.color = this.RegistRecource.color;
                this.myChart.setOption(this.option);
                   this.myChart.hideLoading();
            });
        },
        init() { // 初始化图表
            this.$refs.echart.id = this.id;
            this.myChart = echarts.init(document.getElementById(this.id));
        },
    },
    mounted() {
        this.init();
    }

}
</script>
<style>

</style>
