<template>
    <div>
        <el-time-select placeholder="起始时间" v-model="timePeriod.startTime" :picker-options="startPickerOpts" size="small" :editable="false" @change="handleChange">
        </el-time-select>
        <el-time-select placeholder="结束时间" v-model="timePeriod.endTime" :picker-options="endPickerOpts" size="small" :editable="false">
        </el-time-select>
    </div>
</template>

<script>
const getMinutes = function(time) {
    if (time === undefined || time === null || time === '') return 0;
    const values = time.split(':');
    if (values.length >= 2) {
        const hours = parseInt(values[0], 10);
        const minutes = parseInt(values[1], 10);
        return minutes + hours * 60
    }
    return 0;
};
export default {
    props: {
        value: {
            type: Object,
            deep: true,
            default() {
                return {
                    startTime: undefined,
                    endTime: undefined
                };
            }
        }
    },
    data() {
        return {
            timePeriod: this.value,
            startPickerOpts: { start: '00:00', step: '00:05', end: '23:59' }
        }
    },
    computed: {
        endPickerOpts() {
            let defaultOpts = Object.assign({}, this.startPickerOpts);
            if (this.timePeriod.startTime) {
                defaultOpts.start = this.timePeriod.startTime;
                defaultOpts.minTime = this.timePeriod.startTime;
            }

            return defaultOpts;
        }
    },
    watch: {
        timePeriod: {
            handler: function(newVal, oldVal) {
                this.$emit('input', newVal);
            },
            deep: true
        }
    },
    methods: {
        handleChange(val) {
            if (this.timePeriod.endTime) {
                let end = getMinutes(this.timePeriod.endTime)
                let start = getMinutes(val);
                if (end < start) {
                    this.timePeriod.endTime = null;
                }
            }
        }
    },
    mounted() {
    }
}
</script>
