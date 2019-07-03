<template>
    <div class="scheduled-wrapper">
        <v-nodata v-if="periodRules.length===0" tipMsg='暂无预定时段规则'></v-nodata>
        <div class="period-card" v-for="(item, index) in periodRules" :key="index" v-else>
            <div class="period-card-actions" v-if="!disabled">
                <el-button @click="HandleEditPeriod(item,index)" type="primary" icon="edit"></el-button>
                <el-button @click="HandleDelPeriod(item,index)" type="primary" icon="delete"></el-button>
            </div>
            <h4 class="period-card-title">预订时段规则{{index}}</h4>
            <v-detailItem label="开始时间" :value="convertDate(item.effectiveDate)"></v-detailItem>
            <v-detailItem label="预订时段" type="custom">
                <template v-for="(periods,dIndex) in timeRules(item.dayItms)">
                    <div :key="dIndex" class="day-item">
                        {{item.periods}}
                        <h4 class="week">{{periods.text}}</h4>
                        <div v-for="(dayItem, i) in periods.items" :key="periods.key+'_'+i">
                            <span class="start-time">{{dayItem.startTime}}</span>
                            <span class="u-split">-</span>
                            <span class="end-time">{{dayItem.endTime}}</span>
                        </div>
                    </div>
                </template>
            </v-detailItem>
        </div>
        <el-dialog :title="title" v-model="timePeriodDialog" :close-on-click-modal='false' @close="resetPeriodForm">
            <el-form ref="periodForm" :model="periodForm" :rules="periodFormRules" label-position="right" label-width="120px">
                <el-form-item label="开始时间：" prop="effectiveDate">
                    <el-date-picker v-model="periodForm.effectiveDate" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="时段管理：">
                    <v-weekPeriod ref="periodItem"></v-weekPeriod>
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
import weekPeriod from '@/components/time_period/week_period'
import vRules from '@/config/validate_rules';
import { groupBy } from 'lodash';
const DIALOG = {
    add: { title: '添加时段规则', flag: 'Add' },
    edit: { title: '编辑时段规则', flag: 'Edit' }
};

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
    components: {
        'v-week-period': weekPeriod
    },
    props: {
        rules: {
            type: Array,
            deep: true,
            default() {
                return []
            }
        },
        disabled: false
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
            initForm: { effectiveDate: '', dayItms: [] },
            periodForm: {},
            periodRules: [],
            periodFormRules: {
                effectiveDate: [vRules.datarequired]
            },
            editIndex: -1 // 当前编辑的时段规则
        }
    },
    watch: {
        rules(newVal, oldVal) {
            this.periodRules = this.rules.slice(0);
        }
    },
    methods: {
        timeRules(dayItms) {
            // dayItems数据集合转换成[{ key: '', items: []}]格式
            let tGroup = groupBy(dayItms, 'weekDay');
            let periods = [];
            for (var key in tGroup) {
                periods.push({ text: WEEK_ENUM[key], key: key, items: tGroup[key] })
            }
            return periods;
        },
        // 添加时段规则
        HandleAddPeriod() {
            this.periodForm = Object.assign({}, this.initForm);
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
            this.timePeriodDialog = true;
            this.$nextTick(() => {
                this.$refs['periodItem'].initValue([]);
            });
        },
        // 编辑时段规则
        HandleEditPeriod(item, index) {
            this.periodForm = {
                effectiveDate: this.convertToDate(item.effectiveDate),
                dayItms: item.dayItms
            }
            this.editIndex = index;
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.timePeriodDialog = true;
            this.$nextTick(() => {
                this.$refs['periodItem'].initValue(this.periodForm.dayItms);
            });
        },
        // 删除时段规则
        HandleDelPeriod(item, index) {
            var self = this;
            self.delConfirm('时间段规则', function() {
                self.periodRules.splice(index, 1);
            })
        },
        // 格式化日期
        convertDate(date, fmt = 'yyyy-MM-dd') {
            date = this.convertToDate(date);
            return this.formatDate(date, fmt);
        },
        // 重置
        resetPeriodForm() {
            this.$refs['periodForm'].resetFields();
            this.timePeriodDialog = false;
        },
        // 提交时段规则
        submitPeriodItem() {
            this.$refs['periodForm'].validate((valid) => {
                if (!valid) return;

                let weekPeriods = this.$refs['periodItem'].getContent();
                if (weekPeriods.overlap > 0) { // 有重叠时段
                    this.showTip('有' + weekPeriods.overlap + '个重叠的时间段,请处理', 'error');
                    return;
                }

                if (!weekPeriods.result.length) {
                    this.showTip('请设置预定时段', 'error');
                    return;
                }
                let item = {
                    effectiveDate: this.formatDate(this.periodForm.effectiveDate, 'yyyy-MM-dd'),
                    dayItms: weekPeriods.result
                }

                if (this.flag === DIALOG.add.flag) {
                    this.periodRules.push(item);
                } else if (this.flag === DIALOG.edit.flag) {
                    this.periodRules[this.editIndex] = item;
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