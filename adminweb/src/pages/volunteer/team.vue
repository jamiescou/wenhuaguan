<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '志愿者团队管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="nounsForm" :model="nounsForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-form-item label="团队名称" prop="name">
                    <el-input v-model="nounsForm.name"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" prop="region">
                    <el-select v-model="nounsForm.region" placeholder="请选择所属区域">
                        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="团队类型" filterable prop="type">
                    <el-checkbox-group v-model="nounsForm.type">
                        <v-option typeName="teamType" optType="check"></v-option>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailAddress">
                    <el-input v-model="nounsForm.detailAddress"></el-input>
                </el-form-item>
                <el-form-item label="封面图片" prop="coverPic">
                    <v-cropper class="cover" :imgUrl="nounsPic" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                    <el-input v-model="nounsForm.contactPhone"></el-input>
                </el-form-item>
                <el-form-item label="团队描述" prop="brief">
                    <v-richeditor v-model="nounsForm.brief" ref="richEditor"></v-richeditor>
                </el-form-item>
                <!-- <el-form-item label="团队负责人" prop="leaderName">
                    <el-select v-model="nounsForm.leader.id" clearable filterable placeholder="请选择">
                        <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
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
    add: { title: '新增志愿者团队', flag: 'add' },
    edit: { title: '编辑志愿者团队', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            nounsPic: '',
            culid: '',
            cultData: [],
            options: [],
            users: [],
            nounsForm: {
                name: '',
                coverPic: '',
                unitId: '',
                detailAddress: '',
                brief: '',
                contactPhone: '',
                region: '',
                type: [],
                // unitName: ''
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                region: [vRules.required],
                type: [vRules.required],
                coverPic: [vRules.required],
            }
        }
    },
    methods: {
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.nounsForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.nounsForm.coverPic = '';
        },
        getRegions() {
            let unit = this.$store.getters.user.unit;
            Api.system.getRegionList(unit.region).then((res) => {
                this.options = res;
            });
        },
        submitForm() {
            this.$refs['nounsForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.nounsForm);
                    if (this.flag === DIALOG.add.flag) {
                        newForm.creator = this.$store.getters.AuditUser;
                        Api.nouns.addNouns(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.lastModifier = this.$store.getters.AuditUser;
                        Api.nouns.editNouns(this.culid, newForm).then(this.callback);
                    }
                }
            })
        },
        callback() {
            this.showTip();
            this.back();
        },
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.nouns.getNouns(this.culid).then((res) => {
                this.nounsForm = res;
                this.nounsPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    created() {
        this.culid = this.$route.query.flag;
        if (this.culid) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        } else {
            let orgUnit = this.$store.getters.user.orgUnit;
            this.nounsForm.unitId = orgUnit.id;
            // this.nounsForm.unitName = orgUnit.name;
        }
        this.getRegions();
        // 获取会员信息
        Api.user.getUserList('', 1, -1).then((res) => {
            this.users = res.content;
            // this.member.result = this.selectList;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
