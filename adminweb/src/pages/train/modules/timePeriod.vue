<template>
    <div class="time-period-wrapper">
        <h4 class="time-period-title">{{title}}</h4>
        <div v-for="(timePeriod, index) in timeBlock" :key="index" class="time-period">
            <!--  -->
            <el-time-select placeholder="起始时间" v-model="timePeriod.startTime" :picker-options="{start: '00:00',step: '00:05', end: '24:00'}" size="small" :editable="false">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="timePeriod.endTime" :picker-options="{start: '00:00',step: '00:05', end: '24:00',minTime: timePeriod.startTime}" size="small" :editable="false">
            </el-time-select>
            <el-button @click.prevent="removeTimePeriod(timePeriod)" icon="minus" size="mini" :plain="true" type="danger"></el-button>
        </div>
        <el-button @click.prevent="addTimePeriod" icon="plus" size="small" type="success"></el-button>
    </div>
</template>

<script>
const parseTime = function(time) {
    if (time === undefined) return null;
    const values = ('' || time).split(':');
    if (values.length >= 2) {
        const hours = parseInt(values[0], 10);
        const minutes = parseInt(values[1], 10);

        return {
            hour: hours,
            minute: minutes
        };
    }
    return null;
};

const getMinutes = function(time) {
    const value1 = parseTime(time.startTime);
    const value2 = parseTime(time.endTime);
    if (!value1 || !value2) return null;
    return {
        startMins: value1.minute + value1.hour * 60,
        endMins: value2.minute + value2.hour * 60
    }
};

/**
 * 判断时间是否有重叠
 * @param {String} timePeriods 时间段集合
 * @returns {Number} 重叠时间段个数
 */
const compareTime = function(timePeriods) {
    let overlap = 0;
    for (let i = 0; i < timePeriods.length; i++) {
        let period = getMinutes(timePeriods[i]);
        if (!period) continue;

        for (let j = (i + 1); j < timePeriods.length; j++) {
            let period2 = getMinutes(timePeriods[j]);
            if (!period2) continue;
            // 时间段（x,y）、时间短（a,b） 如果y<a 或者 b<x 时间不冲突，反之有冲突
            if (period.endMins <= period2.startMins || period2.endMins <= period.startMins) {
            } else {
                overlap += 1;
                console.log('%s与%s发生冲突', JSON.stringify(timePeriods[i]), JSON.stringify(timePeriods[j]));
            }
        }
    }
    return overlap;
};
const clearEmpty = function(timePeriods) {
    let result = [];
    for (let i = 0; i < timePeriods.length; i++) {
        let period = getMinutes(timePeriods[i]);
        if (!period) continue;
        result.push(timePeriods[i]);
    }
    return result;
}

export default {
    props: {
        periods: {
            type: Array,
            deep: true,
            default() {
                return []
            }
        },
        title: {
            type: String,
            default: '时间段选择'
        }
    },
    data() {
        return {
            timeBlock: this.periods
        }
    },
    watch: {
        timeBlock: {
            handler: function(newVal, oldVal) {
                let overlap = compareTime(newVal);
                let val = clearEmpty(newVal);
                this.$emit('timePeriodChange', { periods: val, overlap: overlap });
            },
            deep: true
        }
    },

    methods: {
        removeTimePeriod(period) {
            var index = this.timeBlock.indexOf(period)
            if (index !== -1) {
                this.timeBlock.splice(index, 1)
            }
        },
        addTimePeriod() {
            this.timeBlock.push({ startTime: '', endTime: '' });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.time-period-wrapper {
    padding: 15px 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    text-align: center;
    .time-period {
        .el-date-editor.el-input {
            width: 80px;
        }
    }

    .time-period-title {
        margin: 0;
        line-height: 36px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }
}
</style>