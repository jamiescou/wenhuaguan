<template>
    <div class="scheduled-wrapper">
        <el-button @click="HandleAddPeriod" type="text" icon="plus" v-if="!disabled">添加例外日期课程时间</el-button>
        <v-nodata v-if="!hasSchedule && !edit && !add" tipMsg='暂无例外日期课程时间'></v-nodata>
        <div class="schedule-card" v-if="add">
            <el-form ref="weekScheduleForm" :model="weekScheduleForm" :rules="rules" label-position="right" label-width="100px">
                <el-form-item label="例外类型：" prop="type" style="margin-bottom:22px;">
                    <el-radio-group v-model="weekScheduleForm.type" @change="cancelChange">
                        <el-radio label="cancel" value="cancel" key="cancel">取消当天</el-radio>
                        <el-radio label="ajust" value="ajust" key="ajust">调整时间</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="例外日期：" prop="date" style="margin-bottom:22px;">
                    <el-date-picker v-model="weekScheduleForm.date" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="handleDataChange" :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="时段管理：" v-if="!isCancel && weekScheduleForm.date">
                    <v-timeBlock :periods="weekScheduleForm.times" ref="exceptTimes"></v-timeBlock>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button @click="resetForm('weekScheduleForm')">取消</el-button>
                    <el-button type="primary" @click="submitItem('weekScheduleForm')">保存</el-button>
                </div>
            </el-form>
        </div>
        <div class="schedule-card" v-for="(except, index) in exceptTimes" :key="except.date">
            <template v-if="edit && editIndex === index">
                <el-form :ref="'weekScheduleForm_'+index" :model="weekScheduleForm" :rules="rules" label-position="right" label-width="100px">
                    <el-form-item label="例外类型：" prop="type" style="margin-bottom:22px;">
                        <el-radio-group v-model="weekScheduleForm.type" @change="cancelChange">
                            <el-radio label="cancel" value="cancel" key="cancel">取消当天</el-radio>
                            <el-radio label="ajust" value="ajust" key="ajust">调整时间</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="例外日期：" prop="date" style="margin-bottom:22px;">
                        <el-date-picker v-model="weekScheduleForm.date" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="handleDataChange" :clearable="false">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="时段管理：" v-if="!isCancel && weekScheduleForm.date">
                        <v-timeBlock :periods="weekScheduleForm.times" :ref="'exceptTimes'+index"></v-timeBlock>
                    </el-form-item>
                    <div class="dialog-footer">
                        <el-button @click="resetForm('weekScheduleForm_'+index)">取消</el-button>
                        <el-button type="primary" @click="submitItem('weekScheduleForm_'+index)">保存</el-button>
                    </div>
                </el-form>
            </template>
            <template v-else>
                <div class="schedule-actions except" v-if="!disabled">
                    <el-button @click="HandleEdit(index,except)" type="primary" icon="edit"></el-button>
                    <el-button @click="HandleDel(index,except)" type="primary" icon="delete"></el-button>
                </div>
                <div class="day-item">
                    <h4 class="week">{{convertDate(except.date,'yyyy-MM-dd（EE）')}}</h4>
                    <span v-if="except.type==='cancel'">取消当天</span>
                    <template v-if="except.type!=='cancel'">
                        <div v-for="(time, i) in except.times" :key="i" class="time-itms">
                            <span class="start-time">{{time.startTime}}</span>
                            <span class="u-split">~</span>
                            <span class="end-time">{{time.endTime}}</span>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { groupBy } from 'lodash';
import vRules from '@/config/validate_rules';
const INIT_PERIODS = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '10:30', endTime: '12:00' },
    { startTime: '14:00', endTime: '16:00' },
    { startTime: '16:30', endTime: '18:00' }
];
const DIALOG = {
    add: { title: '新增', flag: 'add' },
    edit: { title: '编辑点播', flag: 'edit' }
};
export default {
    props: {
        exceptTimes: {
            type: Array,
            default() {
                return [];
            }
        },
        disabled: false
    },
    computed: {
        hasSchedule() {
            return this.exceptTimes && this.exceptTimes.length;
        },
        isCancel() {
            return this.weekScheduleForm.type === 'cancel'
        }
    },
    data() {
        return {
            add: false,
            edit: false,
            editIndex: -1,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            exceptList: [],
            initForm: {
                date: '',
                type: 'ajust',
                times: []
            },
            weekScheduleForm: {},
            rules: {
                date: [vRules.required]
            }
        }
    },
    methods: {
        HandleAddPeriod() {
            this.weekScheduleForm = Object.assign({}, this.initForm);
            this.add = true;
        },
        // 日期变化
        handleDataChange(val) {
            if (this.exceptTimes!==null&&this.exceptTimes.findIndex(x => x.date === val) !== -1) {
                this.showCenterTip('该日期已设置，请重新选择日期！', 'error');
                this.weekScheduleForm.date = null;
                return;
            }
            if (this.isCancel) return;
            if (val && !this.weekScheduleForm.times.length) {
                this.weekScheduleForm.times = INIT_PERIODS.slice();
            }
        },
        // 是否取消当天
        cancelChange() {
            if (this.isCancel) {
                this.weekScheduleForm.times = [];
            } else if (this.weekScheduleForm.date && !this.weekScheduleForm.times.length) {
                this.weekScheduleForm.times = INIT_PERIODS.slice();
            }
        },
        resetForm(formName) {
            this.add = false;
            this.edit = false;
            if (this.editIndex === -1) {
                this.$refs[formName].resetFields();
            } else {
                this.$refs[formName][0].resetFields();
            }
            this.editIndex = -1;
            this.weekScheduleForm = {};
        },
        submitItem(formName) {
            let $submitForm = null;
            let $excetpTime = null;
            if (this.editIndex === -1) {
                $submitForm = this.$refs[formName];
            } else {
                $submitForm = this.$refs[formName][0];
            }
            $submitForm.validate((valid) => {
                if (!valid) return;
                if (!this.isCancel) {
                    
                    let $excetpTime = this.editIndex === -1 ? this.$refs['exceptTimes'] : this.$refs['exceptTimes' + this.editIndex][0];
                    let timeBlock = $excetpTime.getTimeBlock();
                    if (timeBlock.overlap > 0) {
                        this.showCenterTip('有重叠时段,请处理重叠时段', 'error');
                        return;
                    }
                    if (!timeBlock.periods.length) {
                        this.showCenterTip('至少添加一个时间段', 'error');
                        return;
                    }
                    this.weekScheduleForm.times = timeBlock.periods;
                }
                let item = {
                    date: this.formatDate(this.weekScheduleForm.date, 'yyyy-MM-dd'),
                    type: this.weekScheduleForm.type,
                    times: this.weekScheduleForm.times
                }
                let exceptList = JSON.parse(JSON.stringify(this.exceptTimes))||[];
                if (this.editIndex === -1) {
                    exceptList.push(item);
                } else {
                    exceptList[this.editIndex] = item;
                }
                this.resetForm(formName);
                this.$emit('weekTimeChange', exceptList);
            });
        },
        HandleEdit(index, form) {
            this.editIndex = index;
            this.weekScheduleForm = Object.assign({}, form);
            this.weekScheduleForm.date = this.convertToDate(this.weekScheduleForm.date);
            this.edit = true;
        },
        HandleDel(index) {
            var self = this;
            self.delConfirm('例外日期的课程安排', function() {
                self.exceptTimes.splice(index, 1);
                self.$emit('saveExepTimes', self.exceptTimes);
                // self.$emit('weekTimeChange', []);
                // self.weekTimes = [];
            })
        },
        // 格式化日期
        convertDate(date, fmt = 'yyyy-MM-dd') {
            date = this.convertToDate(date);
            return this.formatDate(date, fmt);
        },
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.scheduled-wrapper {
  .schedule-card {
    position: relative;
    padding: 15px 10px;
    border-bottom: 1px dashed #ccc;
    .schedule-actions {
      height: 40px;
      line-height: 40px;
      text-align: right;
      &.except {
        margin-bottom: -40px;
      }
    }
    .day-item {
      display: inline-block;
      line-height: 36px;
      padding: 15px 15px 0;
      margin: 5px;
      border: 1px solid #ccc;
      text-align: center;
      vertical-align: top;
      .time-itms {
        border-bottom: 1px solid #f5f5f5;
      }
      .week {
        margin: 0;
        font-weight: 700;
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
