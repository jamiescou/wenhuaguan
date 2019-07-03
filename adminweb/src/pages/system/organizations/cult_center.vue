<template>
    <div class="cultCenter">
        <v-pageheader :breadcrumbs="[{ name: '机构管理' }]"></v-pageheader>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">机构</h5>
                    <div class="tree-opers">
                        <el-button size="small" @click="HandAdd" type="primary" icon="plus">添加机构</el-button>
                    </div>
                </div>
                <v-orgtree @orgClick="orgClick" ref="cultCenterTree" orgType="org"></v-orgtree>
            </el-col>
            <el-col :span="18">
                <div class="tree-content-panel">
                    <div class="tree-heading content-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">机构详细信息</h5>
                    </div>
                    <div class="detail-panel">
                        <el-row>
                            <el-row>
                                <el-col :span="12">
                                    <v-detailItem label="机构名称" :value="cultCenter.name"></v-detailItem>
                                </el-col>
                                <el-col :span="12">
                                    <v-detailItem label="管理区域" :value="regionName"></v-detailItem>
                                </el-col>
                            </el-row>
                            <el-col :span="12">
                                <v-detailItem label="LOGO" type="image" :value="cultLogo" class="cult-pic"></v-detailItem>
                            </el-col>
                            <el-col :span="12">
                                <v-detailItem label="封面图片" type="image" :value="cultCover" class="cult-pic"></v-detailItem>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <v-detailItem label="联系人" :value="cultCenter.contactName"></v-detailItem>
                            </el-col>
                            <el-col :span="12">
                                <v-detailItem label="联系电话" :value="cultCenter.contactPhone"></v-detailItem>
                            </el-col>
                        </el-row>

                      <el-row>
                        <el-col :span="12">
                          <v-detailItem label="PC站点域名" :value="cultCenter.site"></v-detailItem>
                        </el-col>
                        <el-col :span="12">
                          <v-detailItem label="微网站域名" :value="cultCenter.mobileSite"></v-detailItem>
                        </el-col>
                      </el-row>
                        <v-detailItem label="详细地址" :value="cultCenter.address"></v-detailItem>
                        <v-detailItem label="简介" :value="cultCenter.remark"></v-detailItem>
                    </div>
                    <div class="actions">
                        <el-button @click="handleEdit" type="primary">编辑</el-button>
                        <el-button @click="handleDel" type="primary">删除</el-button>

                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false" class="dialog-cultCenter" @close="resetForm('cultCenterForm')">
            <el-form ref="cultCenterForm" :model="cultCenterForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="LOGO：" class="u-upload" required prop="logoPic">
                            <v-uploadimg class="cover" btnTxt="点击选择LOGO" :imgUrl="logo" :upload="handleLogoUpload"></v-uploadimg>
                            <el-input v-model="cultCenterForm.logoPic" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="封面图片：" class="u-upload" required prop="coverPic">
                            <v-cropper class="cover" btnTxt="点击选择封面" :imgUrl="cover" :upload="handleUpload" @remove="handleRemove"></v-cropper>
                            <el-input v-model="cultCenterForm.coverPic" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="机构名称：" prop="name">
                            <el-input v-model="cultCenterForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人：" prop="contactName">
                            <el-input v-model="cultCenterForm.contactName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="联系电话：" prop="contactPhone">
                            <el-input v-model="cultCenterForm.contactPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="管理区域：" prop="region">
                            <el-select v-model="cultCenterForm.region" placeholder="请选择管理区域" :disabled="isEdit">
                                <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="外部站点：" prop="isExternal">
                            <el-checkbox v-model="cultCenterForm.isExternal">是否是外部站点</el-checkbox>
                        </el-form-item>
                    </el-col>
                  <el-col :span="8">
                    <el-form-item label="PC站点域名：" prop="site">
                      <el-input v-model="cultCenterForm.site"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="微网站域名：" prop="site">
                      <el-input v-model="cultCenterForm.mobileSite"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="详细地址：" prop="address">
                    <el-input v-model="cultCenterForm.address"></el-input>
                </el-form-item>
                <el-form-item label="背景图片：" prop="backPic">
                    <v-uploadimg class="cover-back" btnTxt="点击选择LOGO" :imgUrl="logo" :upload="handleBackUpload" @remove="handleBackRemove"></v-uploadimg>
                    <el-input v-model="cultCenterForm.backPic" v-show="false"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="remark">
                    <el-input type="textarea" :rows="3" v-model="cultCenterForm.remark"></el-input>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button @click="resetForm('cultCenterForm')">取消</el-button>
                    <el-button @click="submitForm('cultCenterForm')" type="primary">确定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import treePanel from './org_tree_panel'
import vRules from '@/config/validate_rules';

const ORGDIALOG = {
    add: { title: '新增机构信息', flag: 'orgAdd' },
    edit: { title: '编辑机构信息', flag: 'orgEdit' }
};

const ORG_TYPE = {
    'org': '机构',
    'dep': '部门'
}

export default {
    components: {
        'v-orgtree': treePanel
    },
    data() {
        return {
            dialogVisible: false,
            title: ORGDIALOG.add.title,
            flag: ORGDIALOG.add.flag,
            initForm: {
                'name': '',
                'contactName': '',
                'contactPhone': '',
                'region': '',
                'address': '',
                'site': '',
                'mobileSite': '',
                'remark': '',
                'seqno': '',
                'logoPic': '',
                'coverPic': '',
                'backPic': '',
                'isExternal': false,
                parent: { id: '' }
            },
            options: [],
            cultCenterForm: {},
            cultCenter: {},
            cultLogo: '',
            cultCover: '',
            logo: '',
            cover: '',
            regincode: '',
            regionName: '',
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                region: [vRules.required],
                coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
                logoPic: [vRules.required_Msg('没有选择LOGO图片或图片上传中')]
            }
        }
    },
    computed: {
        isEdit() {
            return this.flag === ORGDIALOG.edit.flag;
        }
    },
    methods: {
        orgClick(orgInfo) {
            if (!this.cultCenter || orgInfo !== this.cultCenter) {
                this.cultCenter = orgInfo;
                this.cultLogo = Api.system.getFileUrl(this.cultCenter.logoPic);
                this.cultCover = Api.system.getFileUrl(this.cultCenter.coverPic);
                this.regincode = orgInfo.region;
                Api.system.getRegionList(orgInfo.region).then((res) => {
                    this.options = res;
                });
                Api.system.getRegion(orgInfo.region).then((res) => {
                    this.regionName = res.name;
                });
            }
        },
        convertType(type) {
            return ORG_TYPE[type];
        },
        // 添加组织机构
        HandAdd() {
            this.flag = ORGDIALOG.add.flag;
            this.title = ORGDIALOG.add.title;
            this.cultCenterForm = Object.assign({}, this.initForm);
            this.cultCenterForm.parent.id = this.cultCenter.id;
            this.cultCenterForm.type = 'org';
            this.logo = '';
            this.cover = '';
            this.dialogVisible = true;
            Api.system.getRegionList(this.regincode).then((res) => {
                this.options = res;
            });
        },
        handleEdit() {
            if (this.isEmptyObject(this.cultCenter)) {
                this.showTip('请选择相应文化馆', 'warning');
                return;
            }
            this.flag = ORGDIALOG.edit.flag;
            this.title = ORGDIALOG.edit.title;
            this.cultCenterForm = Object.assign({}, this.cultCenter);
            this.logo = Api.system.getFileUrl(this.cultCenter.logoPic);
            this.cover = Api.system.getFileUrl(this.cultCenter.coverPic);
            this.dialogVisible = true;
            Api.system.getRegion(this.regincode).then((res) => {
                this.options = [res];
            });
        },
        handleDel() {
            let cult = this.cultCenter;
            if (cult.hasOrgChildren || cult.hasDepChildren) {
                this.showTip('请先删除下级文化馆！', 'error');
                return;
            }
            this.delConfirm(this.cultCenter.name + '信息', () => {
                Api.system.delUnit(cult.id).then(this.callback);
            });
        },
        resetForm(FormName) {
            this.logo = '';
            this.cover = '';
            if (this.$refs[FormName]) this.$refs[FormName].resetFields();
            this.dialogVisible = false;
        },
        callback() {
            this.showTip();
            this.cultLogo = Api.system.getFileUrl(this.cultCenterForm.logoPic);
            this.cultCover = Api.system.getFileUrl(this.cultCenterForm.coverPic);
            this.resetForm('cultCenterForm');
            this.$refs.cultCenterTree.getTreedatas();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let newForm = {
                        name: this.cultCenterForm.name,
                        contactName: this.cultCenterForm.contactName,
                        contactPhone: this.cultCenterForm.contactPhone,
                        region: this.cultCenterForm.region,
                        address: this.cultCenterForm.address,
                        site: this.cultCenterForm.site,
                        mobileSite: this.cultCenterForm.mobileSite,
                        isExternal: this.cultCenterForm.isExternal,
                        remark: this.cultCenterForm.remark,
                        seqno: this.cultCenterForm.seqno,
                        logoPic: this.cultCenterForm.logoPic,
                        coverPic: this.cultCenterForm.coverPic,
                        backPic: this.cultCenterForm.backPic,
                        parent: this.cultCenterForm.parent
                    }

                    if (this.flag === ORGDIALOG.add.flag) {
                        Api.system.addUnit(this.cultCenterForm).then(this.callback);
                    } else if (this.flag === ORGDIALOG.edit.flag) {
                        newForm.id = this.cultCenterForm.id;
                        delete newForm.parent;
                        Api.system.modifyUnit(this.cultCenterForm.id, newForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.cultCenterForm.coverPic = res.url;
            })
        },
        handleRemove() {
            this.cultCenterForm.coverPic = '';
        },
        // 上传背景图
        handleBackUpload(req) {
            let file = req.file;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name)
            return Api.system.uploadFile(formData, 'pic').then((res) => {
                this.cultCenterForm.backPic = res.url;
            });
        },
        // 删除背景图
        handleBackRemove() {
            this.cultCenterForm.backPic = '';
        },
        /**
         * 上传Logo图片
         */
        handleLogoUpload(req) {
            let file = req.file;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name)
            return Api.system.uploadFile(formData, 'pic').then((res) => {
                this.cultCenterForm.logoPic = res.url;
            });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.cultCenter {
  .tree-wrapper {
    min-width: 240px;
  }
  .actions {
    margin-top: 30px;
    text-align: center;
  }
  .cover,
  .cult-pic img {
    width: 240px;
    height: 160px;
  }
  .cover-back {
    width: 300px;
    height: 200px;
  }
  .u-upload {
    .el-form-item__content {
      line-height: inherit;
    }
  }
  .dialog-cultCenter {
    .el-dialog {
      min-width: 750px;
    }
  }
}
</style>
