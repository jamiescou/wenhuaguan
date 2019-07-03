<template>
    <div class="eidt-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="successorForm" :model="successorForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="传承人名称：" prop="name">
                    <el-input v-model="successorForm.name" placeholder="传承人名称："></el-input>
                </el-form-item>
                <el-form-item label="传承人照片：" prop="coverPic">
                    <v-cropper style=" width: 354px; height: 236px;" class="cover" :imgUrl="coverPic" btnTxt="点击选择传承人照片" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                  <el-col :span="10">
                  <el-date-picker v-model="successorForm.birthday" type="date" format="yyyy-MM-dd" placeholder="出生日期" :editable="false"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="所属区域" prop="region" class="cooperation">
                  <v-cooperation v-model="successorForm.region" :code="successorForm.region"></v-cooperation>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="传承人类型：" prop="type">
                            <el-select v-model="successorForm.type">
                                <v-option typeName="heritageType"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传承人级别：" prop="level">
                            <el-select v-model="successorForm.level">
                                <v-option typeName="heritageLevel"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申报批次：" prop="batch">
                            <el-select v-model="successorForm.batch" placeholder="申报批次">
                                <v-option typeName="heritageBatch"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名录项目：" prop="project.id">
                            <el-select v-model="successorForm.project.id" placeholder="名录项目">
                                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in directoryOpts"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--<el-row>
                  <el-col :span="12">
                    <el-form-item label="所属区域：" prop="region">
                      <el-select v-model="successorForm.region" placeholder="请选择管理区域" > &lt;!&ndash;:disabled="isEdit"&ndash;&gt;
                        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>-->

                    <el-form-item label="传承人简介：" prop="brief">
                        <el-input type="textarea" v-model="successorForm.brief"></el-input>
                    </el-form-item>
                    <el-form-item label="传承人描述：" prop="remark">
                        <v-richeditor v-model="successorForm.remark" ref="remark"></v-richeditor>
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
import _status, { PARENT_NAME } from './modules/successor_status'
const DIALOG = {
    add: { title: '添加非遗传承人', flag: 'Add' },
    edit: { title: '编辑非遗传承人', flag: 'Edit' }
};

export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            titleInfo: PARENT_NAME['index'],
            options:[],
            successorForm: {
                name: '',
                region: '',
                batch: '',
                level: '',
                remark: '',
                onlineStatus: _status.STATUS.WAITCOMMIT,
                coverPic: '',
                type: '',
                birthday:'',
                project: { id: '', name: '' },
                brief: ''
            },
            directoryOpts: [],
            rules: {
                'name': [vRules.required,vRules.maxLen(40)],
                'birthday': [vRules.required],
                'coverPic': [vRules.required],
                'type': [vRules.requiredSelect],
                'level': [vRules.requiredSelect],
                'remark': [vRules.required],
                'region': [vRules.required],
                'batch': [vRules.requiredSelect]
            }
        }
    },
    created() {
        this.getRegions();
        // let id = this.$store.getters.user.orgUnit.id; // 'unit.id:' + id
        let str='searchUnitId,onlineStatus:Published';
        Api.heritage.getHeritageList(str, 1, -1).then((res) => {
            this.directoryOpts = res.content;
        }).finally(this.closeLoading);
    },
    methods: {
        getRegions() {
            let unit = this.$store.getters.user.unit;
            Api.system.getRegionList(unit.region).then((res) => {
              this.options = res;
            });
        },
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            this.$refs['successorForm'].validate((valid) => {
                if (valid) {
                    this.successorForm.birthday = this.formatDate(this.successorForm.birthday , 'yyyy-MM-dd');
                    if (this.flag === DIALOG.add.flag) {
                         this.successorForm.unitId = this.$store.getters.user.orgUnit.id;
                         this.successorForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.heritage.addSuccessor(this.successorForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        let id = this.successorForm.id;
                        Api.heritage.modifySuccessor(id, this.successorForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.successorForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.successorForm.coverPic = '';
        },
        getDetail() {
            Api.heritage.getSuccessor(this.id).then((info) => {             
                if (!info.project) info.project = { id: '' }
                if (info.birthday) info.birthday = this.convertToDate(info.birthday);
                this.coverPic = Api.system.getFileUrl(info.coverPic);
                this.successorForm = info;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            let tag = this.$route.query.flag || 'index';
            this.titleInfo = PARENT_NAME[tag];
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
