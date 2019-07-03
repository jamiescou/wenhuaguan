<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <div class="welcom-header bottom">
            <!--<h4 class="heading">欢迎您进入文化馆数字平台管理系统</h4>-->
            <h6 class="sub-heading" style="float:left;">
                <span class="welcome">欢迎,您进入文化馆控制台</span><br>您好，{{user.name}}!</h6>
            <!-- <h6 class="sub-heading" style="float:right;">
                <span class="welcome">实名会员数数量</span><br>{{general.identifyCount}}</h6>
            <h6 class="sub-heading" style="float:right;">
                <span class="welcome">会员数量</span><br>{{general.total}}</h6> -->
            <div style="clear:both;"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">会员数量</div>
                <v-echartsPie class="main" :RegistRecource="RegistRecourcedata2"></v-echartsPie>
            </el-col>
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">会员注册来源</div>
                <v-echartsPie class="main" :RegistRecource="RegistRecourcedata"></v-echartsPie>
            </el-col>
        </el-row>
        <div class="tree-heading content-heading">
            <div class="v-line"></div>
            <h5 class="u-title">新增会员统计</h5>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">{{year}}年{{month}}月用户新增趋势
                    <div style="float:right;">
                        <el-button class="btn-act" @click="provmonth()">
                            <上月</el-button>
                                <el-button class="btn-act" @click="thismonth()">本月</el-button>
                                <el-button class="btn-act" @click="nextmonth()">下月></el-button>
                    </div>
                </div>
                <v-echartBar class="main" :RegistRecource="UserbyDaydata" :type="'line'"></v-echartBar>
            </el-col>
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">{{dangyear}}年用户新增趋势</div>
                <v-echartBar class="main" :RegistRecource="UserbyMonthdata" :type="'bar'"></v-echartBar>
            </el-col>
        </el-row>
        <div class="tree-heading content-heading">
            <div class="v-line"></div>
            <h5 class="u-title">会员大数据统计</h5>
        </div>
        <el-row :gutter="20">
            <el-col :span="8" style="text-align:center;">
                <div class="statisTitle">总活跃用户百分比</div>
                <v-echartsPie class="main" :RegistRecource="RegistRecourcedata2"></v-echartsPie>
            </el-col>
            <el-col :span="8" style="text-align:center;">
                <div class="statisTitle">pc活跃用户百分比</div>
                <v-echartsPie class="main" :RegistRecource="RegistRecourcedata2"></v-echartsPie>
            </el-col>
            <el-col :span="8" style="text-align:center;">
                <div class="statisTitle">微信活跃用户百分比</div>
                <v-echartsPie class="main" :RegistRecource="RegistRecourcedata2"></v-echartsPie>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24" style="text-align:center;">
                <div class="statisTitle">{{dangyear}}年用户粘度趋势</div>
                <v-echartBar class="main" :RegistRecource="UserbyDaydata" :type="'line'"></v-echartBar>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">{{dangyear}}年参与活动的会员趋势</div>
                <v-echartBar class="main" :RegistRecource="Userbyactivitydata" :type="'bar'"></v-echartBar>
            </el-col>
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">{{dangyear}}年参与培训的会员趋势</div>
                <v-echartBar class="main" :RegistRecource="Userbytraindata" :type="'bar'"></v-echartBar>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Api from '@/api';
import {
    mapGetters
} from 'vuex';
import echartsPie from './echartsPie'
import echartBar from './echartBar'
export default {
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    components: {
        "v-echartsPie": echartsPie,
        "v-echartBar": echartBar
    },
    data() {
        return {
            dangyear: "",
            month: "",
            year: "",
            titleInfo: {
                name: "会员统计",
            },
            general: { //会员基础统计        
                total: "",
                identifyCount: ""
            },
            RegistRecourcedata: {
                list: [],
                legenddata: [],
                color: []
            },
            RegistRecourcedata2: {
                list: [],
                legenddata: [],
                color: []
            },
            UserbyMonthdata: {
                list: [],
                legenddata: [],
                color: []
            },
            UserbyDaydata: {
                list: [],
                legenddata: [],
                color: []
            },
            Userbyactivitydata: {
                list: [],
                legenddata: [],
                color: []
            },
            Userbytraindata: {
                list: [],
                legenddata: [],
                color: []
            },
            array: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        }
    },
    methods: {
        provmonth() {
            let year = parseInt(this.year);
            let month = parseInt(this.month);
            if (month == 1) {
                month = 12;
                year = year - 1;
            } else {
                month = month - 1 > 9 ? (month - 1) + "" : "0" + (month - 1);
            }
            this.getCurrentMonthLast(year, month);
        },
        thismonth() {
            let myDate = new Date(); //获取系统当前时间
            let FullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            let Month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月) 
            this.getCurrentMonthLast(FullYear, Month);
        },
        nextmonth() {
            let year = parseInt(this.year);
            let month = parseInt(this.month);
            if (month == 12) {
                month = '01';
                year = year + 1;
            } else {
                month = month + 1 > 9 ? (month + 1) + "" : "0" + (month + 1);
            }
            this.getCurrentMonthLast(year, month);
        },
        getLastDay(year, month) {
            var new_year = year; //取当前的年份   
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）   
            if (month > 12) //如果当前大于12月，则年份转到下一年   
            {
                new_month -= 12; //月份减   
                new_year++; //年份增   
            }
            var newnew_date = new Date(new_year, new_month, 1); //取当年当月中的第一天   
            return (new Date(newnew_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期   
        },
        getCurrentMonthLast(year, month) {
            this.UserbyDaydata = {
                list: [],
                legenddata: [],
                color: []
            };
            let lastDay = this.getLastDay(year, month);
            this.year = year;
            this.month = month;
            let daytstr = 'startDay=' + year + month + "01" + '&endDay=' + year + month + lastDay;
            let parseIntday = parseInt(lastDay);
            Api.statistics.getUserbyDay(daytstr).then((res) => {
                if (res) {
                    for (let j = 1; j <= parseIntday; j++) {
                        let parseIntdaystring = j > 10 ? j + "" : "0" + j;
                        this.UserbyDaydata.legenddata.push(parseIntdaystring + "日");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(year + month + parseIntdaystring)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.UserbyDaydata.list.push(list);
                    };
                }
            });
        },
        getUsertrainmonth(str) {
            Api.statistics.getUsertrainmonth(str).then((res) => {
                if (res) {
                    this.array.forEach(element => {
                        this.Userbytraindata.legenddata.push(element + "月");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(this.dangyear + element)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.Userbytraindata.list.push(list);
                    });
                }
            });
        },
        getUserbyactivitydata(str) {
            Api.statistics.getUserbyactivitydata(str).then((res) => {
                if (res) {
                    this.array.forEach(element => {
                        this.Userbyactivitydata.legenddata.push(element + "月");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(this.dangyear + element)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.Userbyactivitydata.list.push(list);
                    });
                }
            });
        },
        getGeneral() {
            Api.statistics.getGeneral().then((res) => {
                this.general = res;
                let list = [{
                    value: res.mobileRegistSum,
                    name: '微信注册(' + res.mobileRegistSum + '会员)'
                },
                {
                    value: res.pcRegistSum,
                    name: 'PC注册(' + res.pcRegistSum + '会员)'
                }
                ];
                this.RegistRecourcedata.list = list;
                this.RegistRecourcedata.legenddata = ['微信注册(' + res.mobileRegistSum + '会员)', 'PC注册(' + res.pcRegistSum + '会员)'];
                this.RegistRecourcedata.color = ['#EAA228', '#4BB2C5'];
                let list2 = [{
                    value: this.general.identifyCount,
                    name: '实名会员数数量(' + this.general.identifyCount + '会员)'
                },
                {
                    value: this.general.total,
                    name: '会员数量(' + this.general.total + '会员)'
                }
                ];
                this.RegistRecourcedata2.list = list2;
                this.RegistRecourcedata2.legenddata = ['实名会员数数量(' + this.general.identifyCount + '会员)', '会员数量(' + this.general.total + '会员)'];
                this.RegistRecourcedata2.color = ['#4D7496', '#810080'];
            });
            let myDate = new Date(); //获取系统当前时间
            let FullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            this.dangyear = FullYear;
            let Month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)            
            let str = 'startMonth=' + FullYear + "01" + '&endMonth=' + FullYear + "12";
            this.getCurrentMonthLast(FullYear, Month);
            this.getUsertrainmonth(str);
            this.getUserbyactivitydata(str);
            Api.statistics.getUserbyMonth(str).then((res) => {
                if (res) {
                    this.array.forEach(element => {
                        this.UserbyMonthdata.legenddata.push(element + "月");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(FullYear + element)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.UserbyMonthdata.list.push(list);
                    });
                }
            });
        }
    },
    mounted() {
        this.getGeneral();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.welcome {
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  text-indent: 20px;
  letter-spacing: 3px;
}
.welcom-header.bottom {
  border-bottom: 1px solid #ccc;
}
.main {
  width: 50%;
  height: 200px;
  border: 2px solid #999999;
}
.statisTitle {
  margin: 17px;
}
</style>
