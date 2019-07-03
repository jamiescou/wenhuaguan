<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'brand',name: '文化品牌管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="brandForm" :model="brandForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="品牌名称" prop="name">
                        <el-input v-model="brandForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="封面图片" prop="coverPic">
                        <v-cropper class="cover" :imgUrl="nounsPic" :upload="handleUpload" @remove="removeImg" :sizecode='"1200*400"' :aspectRatio="3/1"></v-cropper>
                    </el-form-item>
                    <el-form-item label="关联资讯：" prop="infos">
                        <el-select v-model="infosSelect" multiple placeholder="请选择">
                            <el-option v-for="item in infos" :key="item.id" :label="item.title" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属区域：" prop="region">
                        <el-select v-model="brandForm.region" placeholder="请选择管理区域">
                            <!--:disabled="isEdit"-->
                            <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="简介" prop="brief">
                        <el-input type="textarea" v-model="brandForm.brief"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌描述" prop="describe">
                        <v-richeditor v-model="brandForm.describe" ref="richEditor"></v-richeditor>
                    </el-form-item>
                </el-row>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules';
import Api from '@/api';
export default {
    mixins: [BaseTable],
    data() {
        return {
            title: '',
            flag: '',
            id: '',
            infosSelect: [],
            options: [],
            infos: [],
            nounsPic: '',
            brandForm: {
                infos: [],
                name: '',
                brief: '',
                coverPic: '',
                unitId: '',
                describe: '',
                region: ''
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                brief: [vRules.required],
                coverPic: [vRules.required],
                describe: [vRules.required]
            }
        };
    },
    created() {
        this.getInfos();
        this.getRegions();
    },
    methods: {
        getInfos() {
            let str = 'isPublish:true'
            Api.information.getInformations(str, 1, -1).then((res) => {
                this.infos = res.content;
            });
        },
        back() {
            this.$router.go(-1);
        },
        // 所属区域
        getRegions() {
            let unit = this.$store.getters.user.unit;
            Api.system.getRegionList(unit.region).then((res) => {
                this.options = res;
            });
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.brandForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.brandForm.coverPic = '';
        },
        // 提交
        submitForm() {
            this.$refs['brandForm'].validate((valid) => {
                if (valid) {
                    this.brandForm.infos = [];
                    let infosSelect = this.infosSelect;
                    if (infosSelect.length > 0) {
                        for (let item of infosSelect) {
                            let value = { id: item };
                            this.brandForm.infos.push(value);
                        }
                    }
                    let newForm = Object.assign({}, this.brandForm);
                    if (this.flag === 'add') {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.system.createBrand(newForm).then(this.callback);
                    } else if (this.flag === 'edit') {
                        Api.system.modifyBrand(newForm.id, newForm).then(this.callback);
                    }
                }
            });
        },
        callback() {
            this.showTip();
            this.back();
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        this.id = this.$route.query.id;
        if (this.flag === 'edit') {
            this.title = '编辑文化品牌';
            Api.system.getBrand(this.id).then((res) => {
                this.nounsPic = Api.system.getFileUrl(res.coverPic);
                this.brandForm = res;
                if (res.infos) {
                    for (let item of res.infos) {
                        this.infosSelect.push(item.id);
                    }
                }
            });
        } else {
            this.title = '添加文化品牌';
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
