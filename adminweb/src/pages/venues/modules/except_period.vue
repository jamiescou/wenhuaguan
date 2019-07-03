<template>
    <div class="scheduled-wrapper">
        <v-nodata v-if="exceptDates.length===0" tipMsg='暂无例外时段规则'></v-nodata>
        <div class="period-card" v-for="(periodItem, index) in exceptDates" :key="index" v-else>
            <div class="period-card-actions" v-if="!disabled">
                <el-button @click="HandleEditPeriod(periodItem,index)" type="primary" icon="edit"></el-button>
                <el-button @click="HandleDelPeriod(periodItem,index)" type="primary" icon="delete"></el-button>
            </div>
            <h4 class="period-card-title">{{convertDate(periodItem.date)}} 时段规则</h4>
            <v-detailItem label="时段管理" type="custom">
                <div class="day-item">
                    <template v-for="(time,tIndex) in periodItem.times">
                        <div :key="tIndex">
                            <span class="start-time">{{time.startTime}}</span>
                            <span class="u-split">-</span>
                            <span class="end-time">{{time.endTime}}</span>
                        </div>
                    </template>
                </div>
            </v-detailItem>
        </div>
        <el-dialog :title="title" v-model="timePeriodDialog" :close-on-click-modal='false' @close="resetPeriodForm">
            <el-form ref="periodForm" :model="periodForm" :rules="periodFormRules" label-position="right" label-width="120px">
                <el-form-item label="开始时间：" prop="date">
                    <el-date-picker v-model="periodForm.date" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" @change="handleDataChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="时段管理：">
                    <v-timeBlock :periods="periodForm.times" ref="exceptTimes" class="time-select"></v-timeBlock>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="resetPeriodForm">取消</el-button>
                <el-button type="primary" @click="submitPeriodItem">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vRules from '@/config/validate_rules';

const DIALOG = {
    add: { title: '添加时段规则', flag: 'Add' },
    edit: { title: '编辑时段规则', flag: 'Edit' }
};
const INIT_PERIODS = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '10:30', endTime: '12:00' },
    { startTime: '14:00', endTime: '16:00' },
    { startTime: '16:30', endTime: '18:00' }
];
export default {
    props: {
        exceptItms: {
            type: Array,
            deep: true,
            default() {
                return []
            }
        },
        disabled: false
    },
    watch: {
        exceptItms(newVal) {
            this.exceptDates = this.exceptItms.slice(0);
        }
    },
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            timePeriodDialog: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            initForm: { date: '', times: [] },
            periodForm: {},
            periodFormRules: {
                date: [vRules.datarequired]
            },
            editIndex: -1,
            exceptDates: []
        }
    },
    methods: {
        // 添加时段规则
        HandleAddPeriod() {
            this.periodForm = Object.assign({}, this.initForm);
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
            this.timePeriodDialog = true;
        },
        // 编辑时段规则
        HandleEditPeriod(item, index) {
            this.periodForm = {
                date: this.convertToDate(item.date),
                times: item.times
            }
            this.editIndex = index;
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.timePeriodDialog = true;
        },
        // 删除时段规则
        HandleDelPeriod(item, index, except = false) {
            var self = this;
            self.delConfirm('时间段规则', function() {
                self.exceptDates.splice(index, 1);
            })
        },
        // 格式化日期
        convertDate(date, fmt = 'yyyy-MM-dd (EE)') {
            date = this.convertToDate(date);
            return this.formatDate(date, fmt);
        },
        // 重置
        resetPeriodForm() {
            this.$refs['periodForm'].resetFields();
            this.periodForm = Object.assign({}, this.initForm);
            this.timePeriodDialog = false;
        },
        handleDataChange(val) {
            if (val && !this.periodForm.times.length) {
                this.periodForm.times = INIT_PERIODS.slice();
            }
        },
        // 提交时段规则
        submitPeriodItem() {
          
            this.$refs['periodForm'].validate((valid) => {
                if (!valid) return;                
                let weekPeriods = this.$refs['exceptTimes'].getTimeBlock();
                if (weekPeriods.overlap > 0) { // 有重叠时段
                    this.showTip('有' + weekPeriods.overlap + '个重叠的时间段,请处理', 'error');
                    return;
                }
                if (!weekPeriods.periods.length) {
                    this.showTip('请设置预定时段', 'error');
                    return;
                }
                let item = {
                    date: this.formatDate(this.periodForm.date, 'yyyy-MM-dd'),
                    times: weekPeriods.periods
                }
                if (this.flag === DIALOG.add.flag) {
                    this.exceptDates.push(item);
                } else if (this.flag === DIALOG.edit.flag) {
                    this.exceptDates[this.editIndex] = item;
                }
                this.resetPeriodForm();
            });
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.scheduled-wrapper {
  .period-card {
    position: relative;
    padding: 15px 10px;
    .period-card-title {
      padding-left: 10px;
      margin: 0 0 10px;
      line-height: 20px;
      font-weight: 400;
      border-left: 4px solid #20a0ff;
    }
    .period-card-actions {
      position: absolute;
      right: 0;
      top: 10px;
    }
    .day-item {
      display: inline-block;
      padding: 15px 10px;
      margin: 5px;
      border: 1px solid #ccc;
      text-align: center;
      vertical-align: top;
      .week {
        margin: 0;
        font-weight: normal;
      }
      .start-time,
      .end-time {
        display: inline-block;
        width: 100px;
        border-radius: 6px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
      }
      .u-split {
      }
    }
  }
}
</style>