<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'../'+titleInfo.path,name: titleInfo.name },{name:'活动室详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">
            <el-row>
                <el-col :span="12">
                    <v-detailItem label="所属场馆" :value="viewForm.venue.name"></v-detailItem>
                    <v-detailItem label="活动室名称" :value="viewForm.name"></v-detailItem>
                    <v-detailItem label="活动室类别" :value="viewForm.type"></v-detailItem>
                    <v-detailItem label="联系电话" :value="viewForm.telephone"></v-detailItem>
                </el-col>
                <el-col :span="12">
                    <v-detailItem label="封面图片" type="image" :value="viewForm.coverPic" class="cover"></v-detailItem>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <v-detailItem label="是否开放预订" :value="viewForm.itmDef.isEnable?'是':'否'"></v-detailItem>
                </el-col>
                <!-- <el-col :span="6">
                    <v-detailItem label="是否实名" :value="viewForm.isAuthenticate?'是':'否'"></v-detailItem>
                </el-col> -->
            </el-row>
            <v-detailItem label="时段规则" type="custom">
                <el-tabs v-model="tabActive" type="border-card">
                    <el-tab-pane label="预订时段规则" name="first">
                        <v-periodrule ref="periodRules" :rules="viewForm.itmDef.rules" :disabled="true"></v-periodrule>
                    </el-tab-pane>
                    <el-tab-pane label="例外日期" name="second">
                        <v-timeperiod ref="excepts" :exceptItms="viewForm.itmDef.exceptItms" :disabled="true"></v-timeperiod>
                    </el-tab-pane>
                </el-tabs>
            </v-detailItem>
            <el-row>
                <el-col :span="6">
                    <v-detailItem label="面积(m²)" :value="viewForm.area"></v-detailItem>
                </el-col>
                <el-col :span="6">
                    <v-detailItem label="容纳人数" :value="viewForm.totalPeoples"></v-detailItem>
                </el-col>
                <el-col :span="6">
                    <v-detailItem label="座位行数" :value="viewForm.seatTemplate.rows"></v-detailItem>
                </el-col>
                <el-col :span="6">
                    <v-detailItem label="座位列数" :value="viewForm.seatTemplate.columns"></v-detailItem>
                </el-col>
            </el-row>
            <v-detailItem label="座位模版" type="custom">
                <v-seatTmp :seatTmp="viewForm.seatTemplate" v-if="viewForm.seatTemplate && viewForm.seatTemplate.grids.length"></v-seatTmp>
            </v-detailItem>

            <v-detailItem label="活动室设施" :value="viewForm.facilities"></v-detailItem>
            <v-detailItem label="活动室简介" :value="viewForm.brief"></v-detailItem>
            <v-detailItem label="活动室描述" type="rich" :value="viewForm.desc"></v-detailItem>
            <div class="dialog-footer">
                <el-button @click="back">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import seatTmp from '../../components/seat/seattemplate'
import timePeriod from './modules/except_period'
import periodRule from './modules/period_rule_manage'
import { PARENT_NAME } from './modules/status'
export default {
    components: {
        'v-seatTmp': seatTmp,
        'v-timeperiod': timePeriod,
        'v-periodrule': periodRule
    },
    data() {
        return {
            tabActive: 'first',
            viewForm: {
                coverPic: '',
                name: '',
                venue: { id: '' },
                unit: {},
                type: '',
                facilities: '',
                area: '',
                totalPeoples: '',
                desc: '',
                telephone: '',
                isAuthenticate: false,
                hasSeat: false,
                seatTemplate: { rows: '', columns: '', grids: [] },
                onlineStatus: '',
                itmDef: { isEnable: false, rules: [], exceptItms: [] },
                perAllow: '',
                uploadFiles: { coverPic: '' },
                brief: ''
            },
            flag: 1
        }
    },
    computed: {
        titleInfo() {
            return PARENT_NAME[this.flag];
        }
    },
    created() {
        this.dicts.dictInit('venueRoomType');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.venue.getVenueRoom(this.id).then((res) => {
                res.itmDef = res.itmDef || { isEnable: false, rules: [], exceptItms: [] };
                res.seatTemplate = res.seatTemplate || { rows: '', columns: '', grids: [] };
                res.coverPic = Api.system.getFileUrl(res.coverPic);
                res.type = this.dicts.getValueByCode('venueRoomType', res.type);
                this.viewForm = res;
            });
        }
    },
    mounted() {
        this.id = this.$route.params.id; 
        this.flag = this.$route.query.flag;
        this.getDetail();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>