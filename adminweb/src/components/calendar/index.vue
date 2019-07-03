<template>
    <div class="wrapper">
        <div class="cal-wrapper">
            <div class="cal-header">
                <div class="l" @click="preMonth">
                    <div class="arrow-left icon">&nbsp</div>
                </div>
                <div class="title">{{curYearMonth}}</div>
                <div class="r" @click="nextMonth">
                    <div class="arrow-right icon">&nbsp</div>
                </div>
            </div>
            <div class="cal-body">
                <div class="weeks">

                    <span v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames" class="item" :key="dayIndex">
                        {{i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7]}}
                    </span>
                </div>
                <div class="dates">
                    <div v-for="date in dayList" class="item" :class="[{
            today: date.status ? (today == date.date) : false,
            event: date.status ? (date.title != undefined) : false,
            [calendar.options.className] : (date.date == selectedDay)
          }, ...date.customClass]" :key="date.date">
                        <p class="date-num" @click="handleChangeCurday(date)" :style="{color: date.title != undefined ? ((date.date == selectedDay) ? '#fff' : customColor) : 'inherit'}">
                            {{date.status ? date.date.split('/')[2] : '&nbsp'}}</p>
                        <span v-if="date.status ? (today == date.date) : false" class="is-today" :style="{backgroundColor: customColor }"></span>
                        <span v-if="date.status ? (date.title != undefined) : false" class="is-event" :style="{borderColor: customColor, backgroundColor: (date.date == selectedDay) ? customColor : 'inherit'}"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import i18n from './i18n.js'
import { dateTimeFormatter, isEqualDateStr } from './tools.js'
const inBrowser = typeof window !== 'undefined'
export default {
    name: 'cal-panel',
    data() {
        return {
            i18n,
            calendar: this.calendarOpts
        }
    },
    props: {
        calendarOpts: {
            type: Object,
            default() {
                let dateObj = new Date()
                return {
                    options: {
                        locale: 'zh',
                        color: ' #f29543',
                        weekStartOn: 0
                    },
                    params: {
                        curYear: dateObj.getFullYear(),
                        curMonth: dateObj.getMonth(),
                        curDate: dateObj.getDate(),
                        curEventsDate: 'all'
                    }
                }
            }
        },
        selectedDay: {
            type: String,
            required: false
        }
    },
    computed: {
        dayList() {
            let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
            let dayOfWeek = firstDay.getDay()
            // 根据当前日期计算偏移量 // Calculate the offset based on the current date
            if (this.calendar.options.weekStartOn > dayOfWeek) {
                dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
            } else if (this.calendar.options.weekStartOn < dayOfWeek) {
                dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
            }
            let startDate = new Date(firstDay)
            startDate.setDate(firstDay.getDate() - dayOfWeek)
            let item, status, tempArr = [], tempItem
            for (let i = 0; i < 42; i++) {
                item = new Date(startDate);
                item.setDate(startDate.getDate() + i);
                if (this.calendar.params.curMonth === item.getMonth()) {
                    status = 1
                } else {
                    status = 0
                }
                tempItem = {
                    date: `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}`,
                    status: status,
                    customClass: []
                }
                tempArr.push(tempItem)
            }
            return tempArr
        },
        today() {
            let dateObj = new Date()
            return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
        },
        curYearMonth() {
            let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth + 1}/01`))
            return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
        },
        customColor() {
            return this.calendar.options.color
        }
    },
    methods: {
        _nextMonth() {
            if (this.calendar.params.curMonth < 11) {
                this.calendar.params.curMonth++
            } else {
                this.calendar.params.curYear++
                this.calendar.params.curMonth = 0
            }
        },
        _preMonth() {
            if (this.calendar.params.curMonth > 0) {
                this.calendar.params.curMonth--
            } else {
                this.calendar.params.curYear--
                this.calendar.params.curMonth = 11
            }
        },
        nextMonth() {
            this._nextMonth()
            this.$emit('month-changed', this.curYearMonth)
        },
        preMonth() {
            this._preMonth()
            this.$emit('month-changed', this.curYearMonth)
        },
        handleChangeCurday(date) {
            if (date.status) {
                this.$emit('cur-day-changed', date.date)
            }
        }
    }
}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
$base-orange: #f29543;
$white: #ffffff;
$gray: #e0e0e0;
$gray-dark: #b1b1b1;
$large-padding: 15px;
$small-padding: 10px;

$icon-border-size: 1px;

.wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  * {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.2);
  }
}
.cal-wrapper {
  .cal-header {
    position: relative;
    width: 100%;
    background-color: $white;
    // box-shadow: 0 6px 5px rgba(0,0,0,.1);
    font-weight: 500;
    overflow: hidden;
    padding-bottom: 10px;
    & > div {
      float: left;
      line-height: 20px;
      padding: $large-padding;
    }
    .title {
      width: 60%;
      text-align: center;
    }
    .l {
      text-align: left;
      width: 20%;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .r {
      text-align: right;
      width: 20%;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
  .cal-body {
    width: 100%;
    .weeks {
      width: 100%;
      overflow: hidden;
      text-align: center;
      font-size: 1rem;
      .item {
        line-height: 20px;
        float: left;
        width: 14.285%;
      }
    }
    .dates {
      width: 100%;
      overflow: hidden;
      text-align: center;
      font-size: 1rem;
      .item {
        position: relative;
        float: left;
        display: block;
        width: 14.285%;
        cursor: default;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        .date-num {
          position: relative;
          line-height: 30px;
          font-size: 14px;
          text-align: center;
          z-index: 3;
        }
        &.today{
            color:#fff;
        }
        &.event {
          cursor: pointer;
        }
        &.selected-day {
          .is-event {
            background-color: $base-orange;
          }
        }
        .is-event {
          content: "";
          border: 1px solid $base-orange;
          background-color: #fff;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          margin-left: -18px;
          margin-top: -19px;
        }
        .is-today {
          content: "";
          background-color: $base-orange;
          border-radius: 50%;
          opacity: 0.8;
          width: 36px;
          height: 36px;
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 2;
          margin-left: -18px;
          margin-top: -18px;
        }
      }
    }
  }
}
.arrow-left.icon {
  color: #000;
  position: absolute;
  left: 6%;
  margin-top: 10px;
}
.arrow-left.icon:before {
  content: "";
  position: absolute;
  left: 1px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-top: solid $icon-border-size currentColor;
  border-right: solid $icon-border-size currentColor;
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}
.arrow-right.icon {
  color: #000;
  position: absolute;
  right: 6%;
  margin-top: 10px;
}
.arrow-right.icon:before {
  content: "";
  position: absolute;
  right: 1px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-top: solid $icon-border-size currentColor;
  border-right: solid $icon-border-size currentColor;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
h3,
p {
  margin: 0;
  padding: 0;
}
</style>
