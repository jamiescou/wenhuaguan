<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="heritageForm" :model="heritageForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="保护区名称：" prop="name">
                    <el-input v-model="heritageForm.name" placeholder="保护区名称："></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" prop="coverPic">
                    <v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择封面" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="保护主体：" prop="protectSubject">
                    <el-input v-model="heritageForm.protectSubject" placeholder="保护主体"></el-input>
                </el-form-item>

                <el-form-item label="所属区域" prop="region" class="cooperation">
                    <v-cooperation v-model="heritageForm.region" :code="heritageForm.region"></v-cooperation>
                </el-form-item>
                 <el-form-item label="详细地址" prop="address">
                     <el-input v-model="heritageForm.address" placeholder="详细地址"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="关联名录：" prop="projects">
                            <el-select v-model="projectsSelect" multiple placeholder="请选择">
                                <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="关联传承人：" prop="successors">
                            <el-select v-model="successorsSelect" multiple placeholder="请选择">
                                <el-option v-for="item in successors" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="非遗保护区简介：" prop="brief">
                    <el-input type="textarea" v-model="heritageForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="非遗保护区描述：" prop="remark">
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
import _status, { AREA_NAME } from './modules/heritage_status'
const DIALOG = {
    add: { title: '添加非遗保护区', flag: 'Add' },
    edit: { title: '编辑非遗保护区', flag: 'Edit' }
};

export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            titleInfo: AREA_NAME['index'],
            projectsSelect: [],
            successorsSelect: [],
            projects: [],
            successors: [],
            options: [],
            heritageForm: {
                name: '',
                region: '',
                protectSubject: '',
                coverPic: '',
                remark: '',
                onlineStatus: _status.STATUS.WAITCOMMIT,
                address: '',
                projects: [],
                successors: [],
                brief: ''
            },
            rules: {
                'name': [vRules.required,vRules.maxLen(40)],
                'coverPic': [vRules.required]
            }
        }
    },
    created() {
        // this.dicts.dictInit('heritageLevel');
        this.getRegions();
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        getRegions() {
            // 关联名录
            Api.heritage.getHeritageList('', 1, -1).then((res) => {
                this.projects = res.content;
            });
            // 关联传承人
            Api.heritage.getSuccessorList('', 1, -1).then((res) => {
                this.successors = res.content;
            });
        },
        submitForm() {
            this.$refs['heritageForm'].validate((valid) => {
                if (valid) {
                    //转换名录和传承人
                    this.heritageForm.projects = [];
                    this.heritageForm.successors = [];
                    let projectsSelect = this.projectsSelect;
                    if (projectsSelect.length > 0) {
                        for (let item of projectsSelect) {
                            let value = { id: item };
                            this.heritageForm.projects.push(value);
                        }
                    }

                    let successorsSelect = this.successorsSelect;
                    if (successorsSelect.length > 0) {
                        for (let item of successorsSelect) {
                            let value = { id: item };
                            this.heritageForm.successors.push(value);
                        }
                    }
                    delete this.heritageForm.regionAddress;
                    if (this.flag === DIALOG.add.flag) {
                        this.heritageForm.unitId = this.$store.getters.user.orgUnit.id;
                        this.heritageForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.heritage.addHeritageArea(this.heritageForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        let id = this.heritageForm.id;
                        Api.heritage.modifyHeritageArea(id, this.heritageForm).then(this.callback);
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
            Api.heritage.getHeritageArea(this.id).then((info) => {
                this.coverPic = Api.system.getFileUrl(info.coverPic);
                this.heritageForm = info;
                // 名录
                if (info.projects) {
                    for (let item of info.projects) {
                        this.projectsSelect.push(item.id);
                    }
                }
                // 传承人
                if (info.successors) {
                    for (let item of info.successors) {
                        this.successorsSelect.push(item.id);
                    }
                }
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
