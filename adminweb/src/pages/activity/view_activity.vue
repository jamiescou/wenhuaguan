<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'活动详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="所属文化馆" :value="unitName"></v-detailItem>
                    <v-detailItem label="活动名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.contactPhone"></v-detailItem>
                    <v-detailItem label="是否实名制" :value="viewForm.isAuthenticate"></v-detailItem>
                    <v-detailItem label="文化品牌" :value="viewForm.brandName"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="活动地址" :value="viewForm.address"></v-detailItem>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="活动形式" :value="viewForm.activityType"></v-detailItem>
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
            <v-detailItem label="活动标签" :value="viewForm.labels"></v-detailItem>
            <!--<v-detailItem label="所在活动室" :value="viewForm.roomName"></v-detailItem>-->
            <v-detailItem label="所属区域" :value="regionName"></v-detailItem>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="订票方式" :value="viewForm.reserveType"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="活动时间" :value="viewForm.holdStartDate + '  到  ' + viewForm.holdEndDate"></v-detailItem>
                    <!-- <v-detailItem label="活动结束时间" :value=""></v-detailItem> -->
                </el-col>
            </el-row>
            <v-seatTmp :seatTmp="viewForm.seatTemplate" v-if="viewForm.seatTemplate && viewForm.seatTemplate.grids.length"></v-seatTmp>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="每人允许预定数量" :value="viewForm.perAllow||''"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="总票数" :value="viewForm.total||''"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="预约开始时间" :value="viewForm.signStartTime"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="预约结束时间" :value="viewForm.signEndTime"></v-detailItem>
                </el-col>
            </el-row>
            <el-tabs v-model="tabActive" type="border-card" style="margin:10px 0 22px;" v-if="viewForm.itms && viewForm.itms.length">
                <el-tab-pane label="活动场次" name="first">
                    <div :key="arg.id" v-for="arg in viewForm.itms">
                        <el-row>
                            <el-col :span="8">
                                <v-detailItem label="场次日期" :value="arg.itmDate"></v-detailItem>
                            </el-col>
                            <el-col :span="16">
                                <v-detailItem label="时间" :value="arg.startTime + ' ~ ' + arg.endTime"></v-detailItem>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <v-detailItem label="活动简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="活动描述" type="rich" :value="viewForm.desc"></v-detailItem>
            <v-detailItem label="附件信息" type="custom">
                <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                    <i class="sz-ico ico-download"></i>
                    <span class="attach-name">{{viewForm.attachName}}</span>
                </div>
            </v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import seatTmp from '../../components/seat/seattemplate'
import { PARENT_NAME, RESERVETYPE } from './activity_status'
export default {
    components: {
        'v-seatTmp': seatTmp
    },
    data() {
        return {
            flag: 1,
            viewForm: {
                name: '',
                activityType: '',
                artType: '',
                holdStartDate: '',
                holdEndDate: '',
                signStartTime: '',
                signEndTime: '',
                address: '',
                isCharge: '',
                isAuthenticate: '',
                reserveType: '',
                perAllow: '',
                totalAllow: '',
                retainSeats: [],
                desc: '',
                contactPhone: '',
                attachName: '',
                coordinate: { longitude: '', latitude: '' },
                // unit: { id: '', name: '' }, // 组织
                unitName: '',
                roomId: '',
                roomName: '',
                venueName: '',
                // venueRoom: { id: '' }, // 场馆活动室
                itms: '', // 活动场次
                coverPic: '',
                attach: '',
                brief: ''
            },
            roomAddress: '',
            seatTemplate: {
                rows: 0,
                columns: 0,
                grids: []
            },
            venueName: '',
            regionName: '',
            unitName: '',
            cultData: [],
            id: '',
            tabActive: 'first'
        }
    },
    computed: {
        titleInfo() {
            return PARENT_NAME[this.flag];
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            // 详细信息
            Api.activity.getActivity(this.id).then((res) => {
                res.isAuthenticate = res.isAuthenticate === true ? '是' : '否'; // 是否实名
                // 活动形式
                let activityType = [];
                for (let item of res.activityType) {
                    if (this.dicts.getValueByCode('activityForm', item))
                        activityType.push(this.dicts.getValueByCode('activityForm', item));
                }
                res.activityType = activityType.join('、');
                // 所属机构
                let user = this.$store.getters.user;
                this.unitName = user.unit.name;
                res.labels = res.labels.join("、");
                // 艺术分类
                let artType = [];
                for (let item of res.artType) {
                    if (this.dicts.getValueByCode('artistClass', item))
                        artType.push(this.dicts.getValueByCode('artistClass', item));
                }
                res.artType = artType.join('、');

                Api.system.getRegion(res.region).then((data) => {
                    this.regionName = data.fullName.substring(3);
                });
                if (res.roomId) {
                    Api.venue.getVenueRoom(res.roomId).then((r) => {
                        this.venueName = r.venue.name
                    });
                }
                // 活动室地址
                // this.roomAddress = this.activityForm.venueName+this.activityForm.roomName;
                res.reserveType = RESERVETYPE[res.reserveType];
                res.coverPic = Api.system.getFileUrl(res.coverPic);
                this.viewForm = res;
            });
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.attachName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.attach);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.flag = this.$route.query.flag;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
