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
        },
        type: {
            type: String,
            default: 'bar',

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
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLabel: {
                        // interval: 0,
                        rotate: -30
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} 新增用户 {c} "
                },
            }
        }
    },
    methods: {
        loadData() {
            this.myChart.showLoading();
            this.$nextTick(() => {
                if (this.RegistRecource) {
                    this.option.series[0].type = this.type;
                    this.option.series[0].data = this.RegistRecource.list;
                    this.option.xAxis.data = this.RegistRecource.legenddata;
                    if (this.RegistRecource.tooltip) this.option.tooltip.formatter = this.RegistRecource.tooltip.formatter;

                    // this.option.color = this.RegistRecource.color;
                }
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
