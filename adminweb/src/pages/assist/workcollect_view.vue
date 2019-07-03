<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'workcollect',name: '征集管理' },{name:'作品审核'}]"></v-pageheader>
        <div class="tree-content-panel">
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">基本信息</h5>
            </div>
            <el-row :gutter="10">
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="活动名称" :value="actname"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="指导文化馆" :value="unitName"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="联系人" :value="viewForm.contact"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="联系电话" :value="viewForm.telephone"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isStageShow">
                    <el-col :span="12">
                        <v-detailItem label="节目时长(分钟)" :value="viewForm.hourLong"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="参演人数(人)" :value="viewForm.peoples"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isStageShow">
                    <el-col :span="12">
                        <v-detailItem label="艺术门类" :value="viewForm.arts"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="演出单位" :value="viewForm.producer"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isStageShow">
                    <el-col :span="12">
                        <v-detailItem label="灯光要求" :value="viewForm.lampLight"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="话筒音响要求" :value="viewForm.voiceTube"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isStageShow">
                    <el-col :span="12">
                        <v-detailItem label="特效要求" :value="viewForm.specialEffects"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isExhiShow">
                    <el-col :span="12">
                        <v-detailItem label="身份证号" :value="viewForm.idNumber"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="邮编" :value="viewForm.postCode"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isExhiShow">
                    <el-col :span="12">
                        <v-detailItem label="作品尺寸" :value="viewForm.workSize"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="创作时间" :value="viewForm.createDate"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row v-show="isExhiShow">
                    <el-col :span="24">
                        <v-detailItem label="详细地址" :value="viewForm.address"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <v-detailItem label="作品简介" :value="viewForm.workBrief"></v-detailItem>
                    </el-col>
                </el-row>

          

            </el-row>
        </div>

        <div class="tree-content-panel" v-show="isStageShow">
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">主创人员</h5>
            </div>
            <el-row>
                <el-col :span="24">
                    <el-table :data="maindataList" border stripe v-loading.body="loading">
                        <el-table-column type="index" width="100" label="序列">
                        </el-table-column>
                        <el-table-column prop="userName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="sex" label="性别" :formatter="sexFormat"></el-table-column>
                        <el-table-column prop="age" label="年龄"></el-table-column>

                        <el-table-column label="主创人员担任角色" prop="roles" align="center"></el-table-column>
                        <el-table-column prop="works" label="工作单位"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>

        <div class="tree-content-panel" v-show="isStageShow">
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">参演人员</h5>
            </div>
            <el-row>
                <el-col :span="24">
                    <el-table :data="joindataList" border stripe v-loading.body="loading">
                        <el-table-column type="index" width="100" label="序列">
                        </el-table-column>
                        <el-table-column prop="userName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="sex" label="性别" :formatter="sexFormat"></el-table-column>
                        <el-table-column prop="age" label="年龄"></el-table-column>

                        <el-table-column label="饰演角色（注明主演、主奏、领舞等）" prop="roles" align="center"></el-table-column>
                        <el-table-column prop="works" label="工作单位"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>

        <div class="tree-content-panel" v-if="viewForm.attach">
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">附件信息</h5>
            </div>
            <el-row>
                <div v-if="viewForm.attachName" @click="downLoadAttach" class="download-file">
                    <i class="sz-ico ico-download"></i>
                    <span class="attach-name">{{viewForm.attachName}}</span>
                </div>
            </el-row>
        </div>

        <div class="tree-content-panel">
            <div class="tree-heading">
                <div class="v-line"></div>
                <h5 class="u-title">审核信息</h5>
            </div>
            <el-row>
                <el-form ref="workForm" :model="workForm" label-position="right" label-width="120px" class="m-form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="审核：" prop="isPass">
                                <el-radio-group v-model="workForm.isPass">
                                    <el-radio :label=true>通过</el-radio>
                                    <el-radio :label=false>拒绝</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="意见：" prop="auditRemark">
                                <el-input v-model="workForm.auditRemark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
        </div>

        <div class="dialog-footer">
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
        </div>

    </div>
</template>

<script>
import Api from '@/api'
export default {
    data() {
        return {
            loading: false,
            id: '',
            actname: '',
            unitName: '',
            isExhiShow: true,
            isStageShow: true,
            viewForm: {
            },
            maindataList: [],
            joindataList: [],
            workForm: { isPass: true, auditRemark: '' },
            auditRadio: ''
        }
    },
    created() {
        this.dicts.dictInit('artcategory');
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 提交
        submit() {
            // 审核拒绝需填写意见信息
            if (!this.workForm.isPass && this.workForm.auditRemark == '') {
                this.$message({
                    type: 'warning',
                    message: '请填写意见信息'
                });
                return;
            }
            // 审核
            Api.assist.auditActWorks(this.id, this.workForm.isPass, this.workForm.auditRemark).then(this.back);
        },
        sexFormat(row, col, cell) {
            if (cell == 'male') return '男';
            else if (cell == 'female') return '女';
            else return '未知';
        },
        // 下载附件
        downLoadAttach() {
            let filename = this.viewForm.attachName;
            let fileUrl = Api.system.getFileUrl(this.viewForm.attach);
            this.downloadFile(filename, fileUrl);
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        // 获取详情
        Api.assist.getUserSheet(this.id).then((res) => {
            if (res.works.type == 'stageArts') {
                this.isStageShow = true;
                this.isExhiShow = false;
            } else {
                this.isStageShow = false;
                this.isExhiShow = true;
            }
            this.viewForm = res.works;
            this.maindataList = res.works.mainPeoples;
            this.joindataList = res.works.actinPeoples;
            this.viewForm.workSize = (res.works.workWidth == null ? '' : res.works.workWidth + 'cm(宽)') + '-' + (res.works.workHeight == null ? '' : res.works.workHeight + 'cm(高)')
            this.viewForm.arts = this.dicts.getValueByCode('artcategory', res.works.arts);

            // 活动名称
            Api.assist.getAct(res.activityId).then((res) => {
                if (res) this.actname = res.name;
            });

            Api.system.getUnitInfo(res.unitId).then((res) => {
                this.unitName = res.name;
            });
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.detail-block {
  position: relative;
  border: 1px solid #d4d4d4;
  padding: 30px 10px;
  border-radius: 10px;
  // box-shadow: inset 0 -5px 4px 4px rgba(49, 49, 64, 0.1);
  .block-title {
    position: absolute;
    top: -12px;
    left: 30px;
    display: inline-block;
    padding: 0 15px;
    line-height: 24px;
    background-color: #fff;
  }
}
</style>