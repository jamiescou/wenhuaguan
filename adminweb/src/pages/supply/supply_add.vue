<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '文化配送管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="supplyForm" :model="supplyForm" :rules="rules" label-position="right" label-width="130px" class="m-form">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="配送服务名称" prop="title">
                            <el-input v-model="supplyForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="资源类型" prop="type">
                            <el-select v-model="supplyForm.type" placeholder="请选择类型">
                                <v-option typeName="cultural"></v-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contactPerson">
                            <el-input v-model="supplyForm.contactPerson"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="supplyForm.contactPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="服务时长" prop="serveTime">
                            <el-input v-model="supplyForm.serveTime" placeholder="请输入服务时长，例如：3">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class='pic-col'>
                        <el-form-item label="配送服务封面" prop="coverPic">
                            <v-cropper class="cover" :imgUrl="coverPic" :upload="handleUpload" @remove="removeImg"></v-cropper>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="服务价格" prop="servePrice">
                    <el-input v-model="supplyForm.servePrice"></el-input>
                </el-form-item>
                <el-form-item label="服务提供">
                    <el-radio-group v-model="supplyForm.serveType">
                        <el-radio key="person" label="person">个人</el-radio>
                        <el-radio key="team" label="team">团队</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="服务团队名称" prop="teamName" v-if="supplyForm.serveType == 'team'">
                    <el-input v-model="supplyForm.teamName"></el-input>
                </el-form-item>
                <el-form-item label="场地及设施要求" prop="site">
                    <el-input type="textarea" :rows="3" v-model="supplyForm.site"></el-input>
                </el-form-item>
                <el-form-item label="服务备注" prop="remark">
                    <el-input type="textarea" :rows="3" v-model="supplyForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="预约须知" prop="notice">
                    <el-input type="textarea" :rows="3" v-model="supplyForm.notice"></el-input>
                    <!-- <v-richeditor v-model="supplyForm.notice" :key="1"></v-richeditor> -->
                </el-form-item>
                <el-form-item label="配送服务内容" prop="desc">
                    <el-input type="textarea" :rows="3" v-model="supplyForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="服务团队介绍" prop="teamIntro">
                    <v-richeditor v-model="supplyForm.teamIntro" :key="2"></v-richeditor>
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
import Api from '@/api'
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增文化配送', flag: 'add' },
    edit: { title: '编辑文化配送', flag: 'edit' }
};
export default {
    data() {
        return {
            person: 'person',
            team: 'team',
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            id: '',
            cultData: [],
            options: [],
            users: [],
            supplyForm: {
                contactPerson: '',
                serveTime: '',
                teamIntro: '',
                desc: '',
                servePrice: '',
                site: '',
                teamName: '',
                type: '',
                notice: '',
                title: '',
                coverPic: '',
                unitId: '',
                contactPhone: '',
                serveType: 'person'
            },
            rules: {
                title: [vRules.required,vRules.maxLen(40)],
                coverPic: [vRules.required],
                serveTime: [vRules.required,vRules.numberFloat],
                site: [vRules.required],
                notice: [vRules.required],
                type: [vRules.requiredSelect],
            }
        }
    },
    watch: {
        'supplyForm.serveType'(val) {
            if (val === 'person') {
                this.supplyForm.teamName = '';
            }
        }
    },
    methods: {
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.supplyForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.supplyForm.coverPic = '';
        },
        submitForm() {
            this.$refs['supplyForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.supplyForm);
                    let user = this.$store.getters.user;
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = user.orgUnit.id;
                        newForm.dataDeptId = user.unit.id;
                        Api.supply.addSupply(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.supply.editSupply(this.id, newForm).then(this.callback);
                    }
                }
            })
        },
        callback() {
            this.back();
            this.showTip();
        },
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.supply.getSupply(this.id).then((res) => {
                this.supplyForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        if (this.flag === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.id = this.$route.query.id;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
