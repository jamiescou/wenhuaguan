<template>
    <div class="time-period-wrapper">
        <h4 class="time-period-title">{{title}}</h4>
        <div v-for="(timePeriod, index) in timeBlock" :key="timePeriod.id" class="time-period">
            <v-period v-model="timeBlock[index]" class="time-select"></v-period>
            <el-button @click.prevent="removeTimePeriod(index)" icon="minus" size="mini" :plain="true" type="danger"></el-button>
        </div>
        <el-button @click.prevent="addTimePeriod" icon="plus" size="small" type="success"></el-button>
    </div>
</template>

<script>
import period from './time_select';
const parseTime = function(time) {
    if (time === undefined || time === null || time === '') return null;
    const values = time.split(':');
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
            // 时间段（x,y）、时间段（a,b） 如果y<a 或者 b<x 时间不冲突，反之有冲突
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

        result.push(
            {
                startTime: timePeriods[i].startTime,
                endTime: timePeriods[i].endTime
            }
        );
        // result.push(timePeriods[i]);
    }
    return result;
}

export default {
    components: {
        'v-period': period
    },
    props: {
        periods: {
            type: Array,
            default: () => []
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
        periods: {
            handler: function(val, oldVal) {
                if (!val.length && !oldVal.length) {
                    return;
                }
                // 原值存在、原值和新值长度相等，检测新数组所有元素是否都能在原数组中找到，那么数组没有发生变化，返回
                if (oldVal && val.length === oldVal.length && this.compare(val, oldVal)) return;

                let datas = val.slice();
                this.formatData(datas);
            },
            deep: true
        },
        // timeBlock: {
        //     handler: function(newVal, oldVal) {
        //         let overlap = compareTime(newVal);
        //         let val = clearEmpty(newVal);

        //         this.$emit('timePeriodChange', { periods: val, overlap: overlap });
        //     },
        //     deep: true
        // }
    },

    methods: {
        compare(arr, arr2) {
            for (const i of arr) {
                for (const j of arr2) {
                    if (i.startTime === j.startTime && i.endTime === j.endTime) {
                        return true;
                        break;
                    }
                }
            }
            return false;
        },
        formatData(datas) {
            this.timeBlock = datas.map((x, index) => {
                x.id = Math.random().toString(16).substring(2) + 'time' + index;
                return x;
            })
        },
        // 删除时间段
        removeTimePeriod(index) {
            this.timeBlock.splice(index, 1);
            let timeBlock = this.getTimeBlock();
            this.$emit('periodRemoveHandler', timeBlock);
        },
        // 添加时间段
        addTimePeriod() {
            this.timeBlock.push({ startTime: '', endTime: '' });
        },
        // 获取时间重叠
        getOverlap() {
            return compareTime(this.timeBlock);
        },
        getTimeBlock() {
            let overlap = compareTime(this.timeBlock);
            let val = clearEmpty(this.timeBlock);
            return { periods: val, overlap: overlap };
        }
    },
    mounted() {
        if (this.periods.length) {
            this.formatData(this.periods);
        }
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
    .time-select {
      display: inline-block;
    }
    .el-date-editor.el-input {
      width: 100px;
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