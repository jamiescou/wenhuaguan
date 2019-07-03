<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="heritageForm" :model="heritageForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="名录名称：" prop="name">
                    <el-input v-model="heritageForm.name" placeholder="名录名称："></el-input>
                </el-form-item>
                <el-form-item label="封面图片：">
                    <v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择封面" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="非遗类型：" prop="type">
                            <el-select v-model="heritageForm.type">
                                <v-option typeName="heritageType"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名录级别：" prop="level">
                            <el-select v-model="heritageForm.level">
                                <v-option typeName="heritageLevel"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申报批次：" prop="batch">
                            <el-select v-model="heritageForm.batch" placeholder="申报批次">
                                <v-option typeName="heritageBatch"></v-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="所属区域" prop="region" class="cooperation">
                    <v-cooperation v-model="heritageForm.region" :code="heritageForm.region"></v-cooperation>
                </el-form-item>
                <el-form-item label="非遗简介：" prop="brief">
                    <el-input type="textarea" v-model="heritageForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="非遗描述：" prop="remark">
                    <v-richeditor v-model="heritageForm.remark" ref="remark"></v-richeditor>
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
import _status, { PARENT_NAME } from './modules/heritage_status'
const DIALOG = {
    add: { title: '添加非遗名录', flag: 'Add' },
    edit: { title: '编辑非遗名录', flag: 'Edit' }
};

export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            titleInfo: PARENT_NAME['index'],
            options: [],
            heritageForm: {
                name: '',
                region: '',
                batch: '',
                level: '',
                remark: '',
                onlineStatus: _status.STATUS.WAITCOMMIT,
                coverPic: '',
                type: '',
                brief: ''
            },
            rules: {
                'name': [vRules.required,vRules.maxLen(40)],
                'type': [vRules.requiredSelect],
                'level': [vRules.requiredSelect],
                'remark': [vRules.requiredSelect],
                'region': [vRules.required],
                'batch': [vRules.requiredSelect]
            }
        }
    },
    created() {
        this.dicts.dictInit('heritageLevel');
        this.dicts.dictInit('heritageType');
        this.dicts.dictInit('heritageBatch');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            this.$refs['heritageForm'].validate((valid) => {
                if (valid) {
                    if (this.flag === DIALOG.add.flag) {
                      // // 提交人信息
                        this.heritageForm.unitId = this.$store.getters.user.orgUnit.id;
                        this.heritageForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.heritage.addHeritage(this.heritageForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        let id = this.heritageForm.id;
                        Api.heritage.modifyHeritage(id, this.heritageForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.heritageForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.heritageForm.coverPic = '';
        },
        getDetail() {
            Api.heritage.getHeritage(this.id).then((info) => {
                this.coverPic = Api.system.getFileUrl(info.coverPic);
                this.heritageForm = info;
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
