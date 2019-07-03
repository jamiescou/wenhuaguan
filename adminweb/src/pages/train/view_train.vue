<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'培训详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                 <el-col :span="12">
                    <v-detailItem label="所属文化馆" :value="unitName"></v-detailItem>
                    <v-detailItem label="培训标题" :value="viewForm.title"></v-detailItem>
                    <v-detailItem label="联系人" :value="viewForm.contact"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.contactNumber"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.picture" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="培训标签" :value="viewForm.labels"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="艺术分类" :value="viewForm.artType"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="所在场馆" :value="venueName"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="所在活动室" :value="viewForm.roomName"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="关联文化品牌" :value="viewForm.brandName"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="是否需要审核" :value="viewForm.isAudit"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="允许报名人数" :value="viewForm.allLimitPeoples"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="每人可报名人数" :value="viewForm.userLimitPeoples"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="所属区域" :value="regionName"></v-detailItem>
            <v-detailItem label="培训地址" :value="viewForm.address"></v-detailItem>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="地图坐标-X" :value="viewForm.coordinate.longitude"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="地图坐标-Y" :value="viewForm.coordinate.latitude"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="培训老师" :value="viewForm.trainTeacher"></v-detailItem>
            <v-detailItem label="报名条件" type="custom">
                <div v-for="item in viewForm.condition">
                    {{item}}
                </div>
            </v-detailItem>
          <v-detailItem label="报名时间" type='rich' :value="viewForm.enrolStartTime + '&nbsp;&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;&nbsp;' + viewForm.enrolEndTime"></v-detailItem>
          <v-detailItem label="培训课表" type="custom">
                <el-tabs v-model="tabActive" type="border-card">
                    <el-tab-pane label="课程时间" name="first">
                        <v-schedule :weekTimes="viewForm.weekTimes" :startDate="viewForm.startDate" :endDate="viewForm.endDate" disabled="true"></v-schedule>
                    </el-tab-pane>
                    <el-tab-pane label="例外日期" name="second">
                        <v-exceptSchedule :exceptTimes="viewForm.exceptTimes" disabled="true"></v-exceptSchedule>
                    </el-tab-pane>
                </el-tabs>
            </v-detailItem>
            <v-detailItem label="培训简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="培训介绍" type="rich" :value="viewForm.introduce"></v-detailItem>
            <v-detailItem label="附件信息" type="custom">
                <div v-if="viewForm.attachmentName" @click="downLoadAttach" class="download-file">
                    <i class="sz-ico ico-download"></i>
                    <span class="attach-name">{{viewForm.attachmentName}}</span>
                </div>
            </v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import schedule from './modules/schedule'; // 课程时间表
import exceptSchedule from './modules/except_schedule'; // 例外时间表
import _status from './modules/status'
export default {
    components: {
        'v-schedule': schedule,
        'v-exceptSchedule': exceptSchedule
    },
    data() {
        return {
            unitName: '',
            sex: '',
            age: '',
            viewForm: {
                title: '',
                artType: '',
                traType: '',
                address: '',
                coordinate: { longitude: '', latitude: '' },
                contactNumber: '',
                enrolStartTime: '',
                enrolEndTime: '',
                startDate: '',
                endDate: '',
                weekTimes: [],
                exceptTimes: [],
                condition: [],
                allLimitPeoples: '',
                userLimitPeoples: '',
                isCharge: '',
                introduce: '',
                attachmentName: '',
                onlineStatus: '',
                unitId: '',
                trainTeacher: '',
                roomName: '',
                picture: '',
                brief: ''
            },
            timeForm: [],
            venueName:'',
            regionName:'',
            id: '',
            tabActive: 'first',
            titleInfo: _status.PARENT_NAME[1]
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        convertType(type) {
            return CONDITION[type];
        },
        getDetail() {
            // 详细信息
            Api.train.getTrain(this.id).then((res) => {
                res.allLimitPeoples = res.allLimitPeoples + '';
                res.userLimitPeoples = res.userLimitPeoples + '';
                // 所属文化馆
                let unitName = '';
                Api.system.getUnitInfo(res.unitId).then((res) => {
                    if (res) {
                        this.unitName = res.name;
                    }
                });
                Api.system.getRegion(res.region).then((data) => {
                  this.regionName = data.fullName.substring(3);
                });
                // 培训标签
                res.labels = res.labels.join("、");
                // 艺术分类
                let artType = [];
                for (let item of res.artType) {
                     if(this.dicts.getValueByCode('artistClass', item))
                    artType.push(this.dicts.getValueByCode('artistClass', item));
                }              
                res.artType = artType.join('、');
                // 报名条件
                let conditions = [];
                if (res.condition !== null && res.condition.length > 0) {
                    for (var i = 0; i < res.condition.length; i++) {
                        let condition = res.condition[i];
                        if (condition.type === 'age' && condition.value !== null) {
                            conditions.push('年龄限制：' + condition.value.replace(',', '岁 - ') + '岁');
                        }
                        if (condition.type === 'sex' && condition.value !== null) {
                            let sex = condition.value;
                            switch (sex) {
                                case 'male':
                                    sex = '限男性';
                                    break;
                                case 'female':
                                    sex = '限女性';
                                    break;
                                default:
                                    sex = '不限';
                                    break;
                            }
                            conditions.push('性别限制：' + sex);
                        }
                    }
                    res.condition = conditions;
                }
                if(res.roomId){
                  Api.venue.getVenueRoom(res.roomId).then((r) => {
                    this.venueName = r.venue.name
                  });
                }
                if (res.isAudit===true) {
                  res.isAudit="是"
                }else {
                  res.isAudit = "否";
                }
                res.picture = Api.system.getFileUrl(res.picture);
                this.viewForm = res;
            });
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.attachmentName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.attachment);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        // this.dicts.dictInit('trainForm');
        this.dicts.dictInit('artistClass');
        this.id = this.$route.query.id;
        let flag = this.$route.query.flag || 1;
        this.titleInfo = _status.PARENT_NAME[flag];
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
