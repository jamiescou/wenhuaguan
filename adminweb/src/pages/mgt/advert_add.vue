<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'brand',name: '漂浮广告管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="advertForm" :model="advertForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="广告名称" prop="name">
                        <el-input v-model="advertForm.name"></el-input>
                    </el-form-item>
                     <el-form-item label="URL" prop="url">
                        <el-input v-model="advertForm.url"></el-input>
                     </el-form-item>
                    <el-form-item label="封面图片" prop="coverPic">
                        <v-cropper class="cover" :imgUrl="nounsPic" :upload="handleUpload" @remove="removeImg" :sizecode='"20*360"' :aspectRatio="3/2"></v-cropper>
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
        id: '',
        title: '',
        nounsPic: '',
            advertForm: {
                name: '',
                coverPic: '',
                unitId: '',
                url: 'http://',
                state:'',
                createTime:''
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                url: [vRules.required],
                //coverPic: [vRules.required]
            }
        };
    },
    created() {
        //this.getInfos();
        //this.getRegions();
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
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.advertForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.advertForm.coverPic = '';
        },
        // 提交
        submitForm() {
            this.$refs['advertForm'].validate((valid) => {
                if (valid) {
                    this.advertForm.createTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.advertForm.state = false;
                    let newForm = Object.assign({}, this.advertForm);
                    if (this.flag === 'add') {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        Api.system.createAdvert(newForm).then(this.callback);
                    } else if (this.flag === 'edit') {
                        this.advertForm.lastModifiedTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        Api.system.modifyAdvert(newForm.id, newForm).then(this.callback);
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
            this.title = '编辑广告';
            Api.system.getAdvert(this.id).then((res) => {
                this.nounsPic = Api.system.getFileUrl(res.coverPic);
                this.advertForm = res;
            });
        } else {
            this.title = '添加广告';
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
