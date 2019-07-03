<template>
    <div class="">
        <el-checkbox v-for="period in weekPeriods" :key="period.key" v-model="period.checked" @change="handleChange($event,period)">{{period.text}}</el-checkbox>
        <div class="">
            <template v-for="block in weekPeriods">
                <!-- {{block.timePeriods}} -->
                <v-time-block v-show="block.checked" :title="block.text" :key="block.key" :ref="block.key" :periods="block.timePeriods" class="period-item" @periodRemoveHandler="periodsChange($event,block)"></v-time-block>
            </template>
        </div>
    </div>
</template>

<script>
import timeBlock from './time_block'
import { groupBy } from 'lodash';
const WEEK_ENUM = {
    Monday: '周一',
    Tuesday: '周二',
    Wednesday: '周三',
    Thursday: '周四',
    Friday: '周五',
    Saturday: '周六',
    Sunday: '周日'
}
const INIT_PERIODS = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '10:30', endTime: '12:00' },
    { startTime: '14:00', endTime: '16:00' },
    { startTime: '16:30', endTime: '18:00' }
];
const initItem = function(key, text, checked) {
    return {
        key: key,
        text: text,
        checked: checked,
        overlap: 0,
        timePeriods: [] // INIT_PERIODS.slice(0)
    }
}
function _initWeekPeriod() {
    let weeksData = [];
    for (var key in WEEK_ENUM) {
        weeksData.push(initItem(key, WEEK_ENUM[key], false));
    }
    return weeksData;
}
export default {
    components: {
        'v-time-block': timeBlock
    },
    // props: {
    //     value: {
    //         type: Array,
    //         deep: true,
    //         default() {
    //             return [];
    //         }
    //     }
    // },
    // watch: {
    //     value: {
    //         handler: function(newVal, oldVal) {
    //             // this.initValue();
    //         },
    //         deep: true
    //     }
    // },
    data() {
        return {
            weekPeriods: []
        }
    },
    methods: {
        initValue(weekValues) {
            this.weekPeriods = _initWeekPeriod();
            let weekData = this.timeRules(weekValues);
            if (!weekData.length) return;
            this.$nextTick(() => {
                for (var i = 0; i < weekData.length; i++) {
                    var periods = weekData[i];
                    let index = this.weekPeriods.findIndex(item => item.key === periods.key);
                    if (index >= 0) {
                        this.weekPeriods[index].checked = true;
                        this.weekPeriods[index].timePeriods = periods.items;
                    }
                }
            });
        },
        timeRules(weekValues) {
            // dayItems数据集合转换成[{ key: '', items: []}]格式
            let tGroup = groupBy(weekValues, 'weekDay');
            let periods = [];
            for (var key in tGroup) {
                periods.push({ key: key, items: tGroup[key] })
            }
            return periods;
        },
        // 勾选星期变化
        handleChange($event, week) {
            if (week.timePeriods.length === 0) {
                week.timePeriods = INIT_PERIODS.slice(0);
            }
        },
        // 时间段删除变化
        periodsChange(timePeriod, week) {
            if (timePeriod.periods.length === 0) {
                week.checked = false;
                week.timePeriods = [];
                week.overlap = 0;
            }
        },
        // 获取内容
        getContent() {
            let result = [];
            let overlap = 0;

            let self = this;
            if (self.weekPeriods.length) {
                let checkedWeek = self.weekPeriods.filter(x => x.checked); // 过滤选中的
                for (let i = 0; i < checkedWeek.length; i++) {
                    const dayData = checkedWeek[i]; // 一周中的某天的时间安排

                    let timeBlockObj = self.$refs[dayData.key][0];
                    if (!timeBlockObj) continue;

                    let timeBlockData = timeBlockObj.getTimeBlock();
                    let dayPeriodList = timeBlockData.periods.map((item) => {
                        return {
                            weekDay: dayData.key,
                            startTime: item.startTime,
                            endTime: item.endTime
                        };
                    });
                    overlap = overlap + timeBlockData.overlap;
                    result = result.concat(dayPeriodList); // 合并每天的时间段
                }
            }

            // return result;
            return {
                result: result,
                overlap: overlap
            };
        }
        // ,getOverlap() {
        //     let overlap = 0;
        //     let msg = '';
        //     let checkedWeek = this.weekPeriods.filter(x => x.checked); // 过滤选中的
        //     for (let i = 0; i < checkedWeek.length; i++) {
        //         overlap = overlap + checkedWeek[i].overlap;
        //     }

        //     if (overlap > 0) {
        //         msg = '有' + overlap + '个重叠的时间段'
        //     }
        //     return {
        //         count: overlap,
        //         msg: msg
        //     }
        // }
    },
    mounted() {
        // this.initValue();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.period-item {
  display: inline-block;
  vertical-align: top;
  margin: 5px;
}
</style>