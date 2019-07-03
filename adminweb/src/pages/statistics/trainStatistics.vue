<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>

        <div class="tree-heading content-heading">
            <div class="v-line"></div>
            <h5 class="u-title">培训发布量统计</h5>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">各类型艺术形式发布量</div>
                <v-echartBar class="main" :RegistRecource="riousActivities" :type="'bar'"></v-echartBar>
            </el-col>
            <el-col :span="12" style="text-align:center;">
                <div class="statisTitle">各区域培训发布量</div>
                <v-echartBar class="main" :RegistRecource="regionalTrain" :type="'bar'"></v-echartBar>
            </el-col>
            <!-- <el-col :span="12" style="text-align:center;">
               <div class="statisTitle">1-12月培训发布统计</div>
                <v-echartBar class="main" :RegistRecource="monthTrain" :type="'bar'"></v-echartBar>
            </el-col> -->

        </el-row>
        <el-row :gutter="20">
            <el-col :span="24" style="text-align:center;">
                <div class="statisTitle">1-12月培训发布统计</div>
                <v-echartBar class="main" :RegistRecource="monthTrain" :type="'bar'"></v-echartBar>
            </el-col>

        </el-row>

        <!-- <div class="tree-heading content-heading">
            <div class="v-line"></div>
            <h5 class="u-title">场馆使用率/空置率</h5>
        </div>
        <el-row :gutter="20">
            <el-col :span="24" style="text-align:center;">              
              <el-table :data="dataList" border stripe  tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="活动室" prop="name" width="240px" align="center">
                    <template scope="scope">
                        <router-link :to="{path:'/trains/viewtrain', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="favoriteCount" label="收藏" align="center" ></el-table-column>
                <el-table-column prop="commentCount" label="评论" align="center"></el-table-column>                            
                <el-table-column prop="thumbCount" label="点赞" align="center"  ></el-table-column>       
                <el-table-column prop="reserveCount" label="报名总数" align="center" ></el-table-column>          
                <el-table-column prop="pcReserveCount" label="pc报名总数" align="center" ></el-table-column>      
                <el-table-column prop="wexinReserveCount" label="微信报名总数" align="center" ></el-table-column>      
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
            </el-col>
        </el-row> -->
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
            dataList: [],
            dangyear: "",
            month: "",
            year: "",
            titleInfo: {
                name: "场馆统计",
            },
            riousVenues: {
                list: [],
                legenddata: [],
                color: [],
                tooltip: {
                    formatter: "{b} 发布场馆数 {c} "
                }
            },
            riousActivities: {
                list: [],
                legenddata: [],
                color: [],
                tooltip: {
                    formatter: "{b} 发布培训数 {c} "
                }
            },
            regionalTrain: {
                list: [],
                legenddata: [],
                color: [],
                tooltip: {
                    formatter: "{b} 发布场馆数 {c} "
                }
            },
            monthTrain: {
                list: [],
                legenddata: [],
                color: []
            },
            array: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            searchForm: { name: '', status: '' },


        }
    },
    methods: {
        getRegionalTrain() {
            let user = this.$store.getters.user;
            let region = user.orgUnit.region;
            Api.statistics.getRegionalTrain(region).then((res) => {
                if (res) {
                    res.forEach(element => {
                        if (this.dicts.regionName(element.name)) {
                            let elementname = this.dicts.regionName(element.name);
                            this.regionalVenues.legenddata.push(elementname);
                            this.regionalVenues.list.push(element.value);
                        }
                    });
                }
            });
        },
        // getTrainbystatistics()
        // {
        //     let str='';
        //     if (this.searchForm.name) { str += ',name~' + this.searchForm.name; }
        //     Api.statistics.getTrainbystatistics(str, this.page, 5).then((res) => {
        //         this.dataList=res.content;
        //     });
        // },
        getTrainbymonth() {
            let myDate = new Date();//获取系统当前时间
            let FullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            this.dangyear = FullYear;
            let Month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)            
            let str = 'startMonth=' + FullYear + "01" + '&endMonth=' + FullYear + "12";
            Api.statistics.getTrainbymonth(str).then((res) => {
                if (res) {
                    this.array.forEach(element => {
                        this.monthTrain.legenddata.push(element + "月");
                        let list = 0;
                        for (let i = 0; i < res.length; i++) {
                            let resname = res[i].name;
                            if (resname.includes(this.dangyear + element)) {
                                list = res[i].value;
                                break;
                            }
                        }
                        this.monthTrain.list.push(list);
                    });
                }
            });
        },
        UsageRate(row, index, value) {
            return row.usageHour == "0" || row.openHour == "0" ? 0 : Math.round(row.usageHour / row.openHour * 10000) / 100.00 + "%";
        },
        vacancyRate(row, index, value) {
            return row.usageHour == "0" || row.openHour == "0" ? 100 + "%" : (100 - Math.round(row.usageHour / row.openHour * 10000) / 100.00) + "%";
        },
        getVenuesform() {
            Api.statistics.getVenuesform().then((res) => {
                if (res) {
                    res.forEach(element => {
                        if (this.dicts.getValueByCode('venueType', element.name)) {
                            let elementname = this.dicts.getValueByCode('venueType', element.name);
                            this.riousVenues.legenddata.push(elementname);
                            this.riousVenues.list.push(element.value);
                        }
                    });
                }
            });
        },
        getTrainform() {
            Api.statistics.getTrainform().then((res) => {
                if (res) {
                    res.forEach(element => {
                        if (this.dicts.getValueByCode('artistClass', element.name)) {
                            let elementname = this.dicts.getValueByCode('artistClass', element.name);
                            this.riousActivities.legenddata.push(elementname);
                            this.riousActivities.list.push(element.value);
                        }
                    });
                }
            });
        },
        getDate() {
            this.getVenuesform();
            this.getRegionalTrain();
            this.getTrainbymonth();
            this.getTrainform();
            // this.getTrainbystatistics();        
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
