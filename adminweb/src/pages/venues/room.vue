<template>
    <div class="edit-wrapper room-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="roomForm" :model="roomForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-row>
                    <el-col :span="14" style="padding-bottom:20px;">
                        <el-form-item label="所属场馆：" prop="venue.id">
                            <el-select v-model="roomForm.venue.id" placeholder="所属场馆">
                                <v-venueOpts></v-venueOpts>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="活动室名称：" prop="name">
                            <el-input v-model="roomForm.name" :maxlength="40" placeholder="活动室名称"></el-input>
                        </el-form-item>
                        <el-form-item label="类别：" prop="type">
                            <el-select v-model="roomForm.type">
                                <v-option typeName="venueRoomType"></v-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contact">
                            <el-input v-model="roomForm.contact"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="telephone">
                            <el-input v-model="roomForm.telephone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class='pic-col'>
                        <!--<v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择封面" :upload="handleUpload" @remove="handleRemove"></v-cropper>-->
                        <el-form-item label-width="0" prop="coverPic">
                            <v-cropper class="cover" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="handleRemove"></v-cropper>
                            <el-input v-model="roomForm.coverPic" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="面积(m²)：" prop="area">
                            <el-input v-model="roomForm.area" placeholder="请输入面积，例如：20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="容纳人数：" prop="totalPeoples">
                            <el-input v-model="roomForm.totalPeoples" placeholder="请输入容纳人数，例如：20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="是否开放预订：" prop="itmDef.isEnable">
                            <el-checkbox v-model="roomForm.itmDef.isEnable"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">
                        <el-form-item label="是否实名：" prop="isAuthenticate">
                            <el-checkbox v-model="roomForm.isAuthenticate"></el-checkbox>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item label="可预订时段：">
                    <div class="actions">
                        <el-button @click="HandleAddPeriod('periodRules',false)" type="primary" icon="plus">添加时段规则</el-button>
                        <el-button @click="HandleAddPeriod('excepts',true)" type="primary" icon="plus">添加例外日期</el-button>
                    </div>
                </el-form-item>
                <el-tabs v-model="tabActive" type="border-card" class="period-tabcard">
                    <el-tab-pane label="预订时段规则" name="first">
                        <v-periodrule ref="periodRules" :rules="roomForm.itmDef.rules"></v-periodrule>
                    </el-tab-pane>
                    <el-tab-pane label="例外日期" name="second">
                        <v-exceptSchedule :exceptTimes="roomForm.itmDef.exceptItms" @weekTimeChange="exepTimesChange"></v-exceptSchedule>
                    </el-tab-pane>
                </el-tabs>
                <el-form-item label="座位模板：">
                    <el-col :span="12" class="pd-r-10">
                        <el-form-item prop="rows">
                            <el-input v-model.number="roomForm.seatTemplate.rows" placeholder="请填写座位行数" :disabled="lockedEdit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="columns">
                            <el-input v-model.number="roomForm.seatTemplate.columns" placeholder="请填写座位列数" :disabled="lockedEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <div v-if="showSeatTmpPanel&&!lockedEdit">
                    <h4 class="title" style="text-align:center;">编辑座位模版</h4>
                    <v-seat ref="roomSeatTmp" :row="roomForm.seatTemplate.rows" :col="roomForm.seatTemplate.columns" :grids="grids" class="seatTmp" @seatChange="saveSeatTemplate"></v-seat>
                </div>
                <v-seatTmp :seatTmp="roomForm.seatTemplate" v-if="showSeatTmpPanel&&lockedEdit"></v-seatTmp>
                <el-form-item label="活动室设施：" prop="facilities">
                    <el-input v-model="roomForm.facilities" placeholder="活动室设施"></el-input>
                </el-form-item>
                <el-form-item label="活动室简介：" prop="brief">
                    <el-input type="textarea" v-model="roomForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="活动室描述：" prop="desc">
                    <v-richeditor v-model="roomForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import vRules from '@/config/validate_rules';
import seat from '../../components/seat/seat'
import seatTmp from '../../components/seat/seattemplate'
import timePeriod from './modules/except_period'
import exceptSchedule from './modules/except_schedule'; // 例外时间表
import periodRule from './modules/period_rule_manage'
import venueOpts from './modules/venue_opts'
import { PARENT_NAME } from './modules/status'
const DIALOG = {
    add: { title: '添加活动室', flag: 'Add' },
    edit: { title: '编辑活动室', flag: 'Edit' }
};
export default {
    components: {
        'v-seat': seat,
        'v-seatTmp': seatTmp,
        'v-timeperiod': timePeriod,
        'v-periodrule': periodRule,
        'v-venueOpts': venueOpts,
        'v-exceptSchedule': exceptSchedule,
    },
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            tag: 1,
            tabActive: 'first',
            seatDialog: false,
            coverPic: '',
            roomForm: {
                coverPic: '',
                name: '',
                contact: '',
                venue: { id: '' },
                unitId: '',
                type: '',
                facilities: '',
                area: '',
                totalPeoples: '',
                desc: '',
                telephone: '',
                // isAuthenticate: false,
                hasSeat: false,
                seatTemplate: { rows: '', columns: '', grids: [] },
                onlineStatus: '',
                itmDef: { isEnable: false, rules: [], exceptItms: [] },
                perAllow: '',
                isRecommend: false,
                brief: ''
            },
            roomEnterPosition: '',
            grids: [],
            rules: {
                coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
                'name': [vRules.required, vRules.maxLen(40)],
                'contact': [vRules.required],
                'venue.id': [vRules.requiredSelect],
                'totalPeoples': [vRules.numberPattern],
                type: [vRules.requiredSelect],
                facilities: [vRules.required],
                desc: [vRules.required],
                telephone: [vRules.required],
                'area': [vRules.numberFloat]
            }
        }
    },
    computed: {
        titleInfo() {
            return PARENT_NAME[this.tag];
        },
        lockedEdit() {
            let notEdit = ['Offline'];
            return this.roomForm.onlineStatus !== '' && notEdit.some(item => item === this.roomForm.onlineStatus);
        },
        showSeatTmpPanel() {
            return this.roomForm.seatTemplate.rows > 0 && this.roomForm.seatTemplate.columns > 0;
        }
    },
    methods: {
        exepTimesChange(times) {

            this.roomForm.itmDef.exceptItms = times;
        },
        back() {
            this.$router.replace(this.titleInfo.path);
            // this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            // 判断例外时间是否在预定时段规则内
            let itmRules = this.$refs.periodRules.periodRules
            let exceptRules = this.roomForm.itmDef.exceptItms
            if (itmRules.length > 0 && exceptRules.length > 0) {
                for (const itm of itmRules) {
                    let itmDate = this.$moment(itm.effectiveDate).format('x');
                    for (let i = 0; i < exceptRules.length; i++) {
                        const exceptDate = this.$moment(exceptRules[i].date).format('x');
                        if (exceptDate < itmDate) {
                            this.showCenterTip('例外日期必须在预定规则内！', 'error');
                            return;
                        }
                    }
                }
            } else if (itmRules.length == 0 && exceptRules.length > 0) {
                this.showCenterTip('请设置预定规则！', 'error');
                return;
            }

            this.$refs['roomForm'].validate((valid) => {
                if (valid) {
                    this.roomForm.itmDef.rules = this.$refs.periodRules.periodRules;
                    // this.roomForm.itmDef.exceptItms = this.$refs.excepts.exceptDates;
                    // this.roomForm.itmDef
                    let newForm = {
                        name: this.roomForm.name,
                        contact: this.roomForm.contact,
                        venue: this.roomForm.venue,
                        unitId: this.roomForm.unitId,
                        type: this.roomForm.type,
                        facilities: this.roomForm.facilities,
                        area: this.roomForm.area,
                        totalPeoples: this.roomForm.totalPeoples,
                        desc: this.roomForm.desc,
                        telephone: this.roomForm.telephone,
                        isAuthenticate: this.roomForm.isAuthenticate,
                        seatTemplate: this.roomForm.seatTemplate,
                        itmDef: this.roomForm.itmDef,
                        coverPic: this.roomForm.coverPic,
                        brief: this.roomForm.brief
                    }
                    if (this.flag === DIALOG.add.flag) {
                        newForm.creator = {
                            userId: this.$store.getters.user.id,
                            userName: this.$store.getters.user.name
                        };
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.venue.addVenueRoom(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.lastModifier = {
                            userId: this.$store.getters.user.id,
                            userName: this.$store.getters.user.name
                        }
                        let roomid = this.roomForm.id;
                        Api.venue.modifyVenueRoom(roomid, newForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传活动室封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.roomForm.coverPic = res.url;
            })
        },
        // 删除图片
        handleRemove() {
            this.roomForm.coverPic = '';
        },
        // 添加时段规则
        HandleAddPeriod(name, except = false) {
            this.tabActive = except ? 'second' : 'first';
            this.$refs[name].HandleAddPeriod();
        },
        // 保存座位模版
        saveSeatTemplate(seats) {
            this.roomForm.seatTemplate.grids = seats;
        },
        getDetail() {
            Api.venue.getVenueRoom(this.id).then((res) => {
                res.itmDef = res.itmDef || { isEnable: false, rules: [], exceptItms: [] };
                res.seatTemplate = res.seatTemplate || { rows: '', columns: '', grids: [] };
                this.roomForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
                this.grids = res.seatTemplate.grids;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.tag = this.$route.query.flag;
            this.getDetail();
        } else {
            this.roomForm.unitId = this.$store.getters.user.orgUnit.id;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.room-wrapper {
  .period-item {
    display: inline-block;
    vertical-align: top;
    margin: 5px;
  }
  .period-tabcard {
    margin-bottom: 22px;
  }
  .seatTmp {
    margin-top: 20px;
  }
}
</style>
