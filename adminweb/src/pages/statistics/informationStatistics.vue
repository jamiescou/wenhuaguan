<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>

        <div class="tree-heading content-heading">
            <div class="v-line"></div>
            <h5 class="u-title">资讯发布量统计</h5>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">各栏目资讯发布量</div>
                <v-echartBar class="main" :RegistRecource="regionalActivity" :type="'bar'"></v-echartBar>
            </el-col>
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">1-12月资讯发布统计</div>
                <v-echartBar class="main" :RegistRecource="monthActivities" :type="'bar'"></v-echartBar>
            </el-col>

        </el-row>
    </div>
</template>
<script>
import Api from '@/api';
import BaseTable from '@/mixins/base-table';
import { mapGetters } from 'vuex';
import echartsPie from './echartsPie'
import echartBar from './echartBar'
export default {
    mixins: [BaseTable],
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
            regionalActivity: {
                list: [],
                legenddata: [],
                color: [],
                tooltip: {
                    formatter: "{b} 发布资讯栏目数 {c} "
                }
            },
            monthActivities: {
                list: [],
                legenddata: [],
                color: [],
                tooltip: {
                    formatter: "{b} 发布资讯数 {c} "
                }
            },
            dataList: [],
            dangyear: "",
            month: "",
            year: "",
            titleInfo: {
                name: "资讯统计",
            },
            array: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            searchForm: { year: '', month: '' }
        }
    },
    methods: {
        getInformationForm() {
            Api.statistics.getInformationForm().then((res) => {
                if (res) {
                    res.forEach(element => {
                        this.regionalActivity.legenddata.push(element.name);
                        this.regionalActivity.list.push(element.value);
                    });
                }
            });
        },
        getActivitybymonth() {
            let myDate = new Date();//获取系统当前时间
            let FullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            this.dangyear = FullYear;
            let Month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)            
            let str = 'startMonth=' + FullYear + "01" + '&endMonth=' + FullYear + "12";
            Api.statistics.getInformationByMonth(str).then((res) => {
                if (res) {
                    this.array.forEach(element => {
                        this.monthActivities.legenddata.push(element + "月");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(this.dangyear + element)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.monthActivities.list.push(list);
                    });
                }
            });
        },
        getDate() {
            this.getInformationForm();
            this.getActivitybymonth();
        }
    },
    mounted() {
        this.getDate();
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
}
.statisTitle {
  margin: 17px;
}
</style>
