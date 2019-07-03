<template>
    <div class="scheduled-wrapper">
        <el-button @click="HandleAddPeriod" type="text" icon="plus" v-if="!hasSchedule && !edit">添加课程时间</el-button>
        <v-nodata v-if="!hasSchedule && !edit" tipMsg='暂无课程时间'></v-nodata>
        <div class="schedule-card" v-show="edit">
            <el-form ref="scheduleForm" :model="scheduleForm" :rules="rules" label-position="right" label-width="100px">
                <el-form-item label="培训时间：" required style="margin-bottom:22px;">
                    <el-col :span="11">
                        <el-form-item prop="startDate">
                            <el-date-picker v-model="scheduleForm.startDate" type="date" format="yyyy-MM-dd" placeholder="培训开始时间" :editable="false" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="line"> &sim;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endDate">
                            <el-date-picker v-model="scheduleForm.endDate" type="date" format="yyyy-MM-dd" placeholder="培训结束时间" :editable="false" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="时间安排：" prop="weekTimes" required>
                    <v-weekPeriod ref="periodItem"></v-weekPeriod>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button @click="resetForm('scheduleForm')">取消</el-button>
                    <el-button type="primary" @click="submitItem('scheduleForm')">保存</el-button>
                </div>
            </el-form>
        </div>
        <div class="schedule-card" v-show="!edit && hasSchedule">
            <div class="schedule-actions" v-if="!disabled">
                <el-button @click="HandleEdit" type="primary" icon="edit"></el-button>
                <el-button @click="HandleDel" type="primary" icon="delete"></el-button>
            </div>
            <v-detailItem label="培训时间" :value="convertDate(startDate) + '  到  ' + convertDate(endDate)"></v-detailItem>
            <div class="day-item" v-for="(item, index) in weekTimes" :key="item.weekDay">
                <h4 class="week">{{convertWeek(item.weekDay)}}</h4>
                <div v-for="(time, i) in item.trainTimes" :key="item.weekDay + '_' + i" class="time-itms">
                    <span class="start-time">{{time.startTime}}</span>
                    <span class="u-split">~</span>
                    <span class="end-time">{{time.endTime}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { groupBy } from 'lodash';
import vRules from '@/config/validate_rules';
const WEEK_ENUM = {
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
    Sunday: '星期日'
}
export default {
    props: {
        weekTimes: {
            type: Array,
            default() {
                return [];
            }
        },
        startDate: {
            type: [String, Date]
        },
        endDate: {
            type: [String, Date]
        },
        disabled: false
    },
    data() {
        /**
         * 日期比较
         *  只比较日期，不比较时间
         * @param {any} rule 规则定义
         * @param {any} value 值
         * @param {any} callback 回调函数
         */
        const dateCompare = (rule, value, callback) => {
            let oneDate = this.scheduleForm[rule.type];
            let twoDate = value;
            if (oneDate && twoDate) {
                let compareResult = true;
                if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
                    oneDate = oneDate.getTime();
                    twoDate = twoDate.getTime();
                    if (rule.type === 'endDate') {
                        compareResult = oneDate >= twoDate;
                        this.$refs.scheduleForm.validateField(rule.type);
                    } else {
                        compareResult = oneDate <= twoDate;
                    }
                }
                if (!compareResult) {
                    return callback(new Error('开始日期不能大于结束日期'));
                }

                // this.$refs.scheduleForm.validateField(rule.type);
            }
            callback();
        };

        return {
            edit: false,
            scheduleForm: {
                startDate: null,
                endDate: null,
                weekTimes: []
            },
            rules: {
                startDate: [vRules.datarequired, { validator: dateCompare, type: 'endDate', trigger: 'change' }],
                endDate: [vRules.datarequired, { validator: dateCompare, type: 'startDate', trigger: 'change' }],
                weekTimes: [vRules.required_Array('请添加时间安排')]
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    computed: {
        hasSchedule() {
            return this.weekTimes && this.weekTimes.length;
        }
    },
    watch: {
        'scheduleForm.weekTimes'(val) {
            if (val && val.length && this.$refs.scheduleForm) {
                this.$nextTick(() => {
                    this.$refs.scheduleForm.validateField('weekTimes');
                });
            }
        }
    },
    methods: {
        HandleAddPeriod() {
            this.scheduleForm = {
                startDate: null,
                endDate: null,
                weekTimes: []
            };
            this.$nextTick(() => {
                this.$refs['periodItem'].initValue([]);
            });
            this.edit = true;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.edit = false;
        },
        submitItem(formName) {
            let weekPeriods = this.$refs['periodItem'].getContent();
            this.scheduleForm.weekTimes = weekPeriods.result;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (weekPeriods.overlap > 0) {
                    this.showCenterTip('时间段有重叠，请处理', 'error');
                    return;
                }
                let newForm = Object.assign({}, this.scheduleForm);
                let periods = [];
                if (newForm.weekTimes.length) {
                    // 数据集合转换成[{ weekDay: '', trainTimes: []}]格式
                    let tGroup = groupBy(newForm.weekTimes, 'weekDay');
                    for (var key in tGroup) {
                        let dayItems = tGroup[key].map((x) => {
                            return {
                                startTime: x.startTime,
                                endTime: x.endTime
                            };
                        })
                        periods.push({ weekDay: key, trainTimes: dayItems })
                    }
                }

                let data = {
                    startDate: newForm.startDate,
                    endDate: newForm.endDate,
                    weekTimes: periods
                }
                this.$emit('weekTimeChange', data);
                // this.resetForm(formName);
                this.edit = false;
            });
        },
        HandleEdit() {
            this.scheduleForm = {
                startDate: (typeof this.startDate === 'string') ? this.convertToDate(this.startDate) : this.startDate,
                endDate: (typeof this.startDate === 'string') ? this.convertToDate(this.endDate) : this.endDate,
                weekTimes: []
            };
            if (this.weekTimes && this.weekTimes.length) {
                for (const item of this.weekTimes) {
                    let itemTims = item.trainTimes.map((x) => {
                        return {
                            weekDay: item.weekDay,
                            startTime: x.startTime,
                            endTime: x.endTime
                        }
                    })
                    this.scheduleForm.weekTimes = this.scheduleForm.weekTimes.concat(itemTims);
                }
            }
            this.$nextTick(() => {
                this.$refs['periodItem'].initValue(this.scheduleForm.weekTimes);
            });
            this.edit = true;
        },
        HandleDel() {
            var self = this;
            self.delConfirm('课程时间表', function() {
                let data = {
                    startDate: null,
                    endDate: null,
                    weekTimes: []
                }
                self.$emit('weekTimeChange', data);
                // self.weekTimes = [];
            })
        },
        // week转换成中文
        convertWeek(week) {
            return WEEK_ENUM[week];
        },
        // 格式化日期
        convertDate(date, fmt = 'yyyy-MM-dd') {
            if (typeof date === 'string') {
                date = this.convertToDate(date);
            }
            return this.formatDate(date, fmt);
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.scheduled-wrapper {
  .schedule-card {
    position: relative;
    padding: 15px 10px;
    &.edit {
      text-align: center;
    }
    .schedule-actions {
      height: 40px;
      line-height: 40px;
      text-align: right;
    }
    .day-item {
      display: inline-block;
      padding: 15px 15px 0;
      line-height: 36px;
      margin: 5px;
      border: 1px solid #ccc;
      text-align: center;
      vertical-align: top;
      .time-itms {
        border-bottom: 1px solid #f5f5f5;
      }
      .week {
        margin: 0;
        font-weight: normal;
      }
      .start-time,
      .end-time {
        display: inline-block;
        width: 80px;
        border-radius: 6px;
      }
      .u-split {
      }
    }
  }
}
</style>
